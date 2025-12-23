use chrono::{DateTime, Utc};
use shared::dto::feed::{Creator, FeedItem, FeedResponse};
use shared::error::AppError;
use sqlx::PgPool;

use crate::repo;

fn parse_cursor(cursor: &str) -> Result<(DateTime<Utc>, String), AppError> {
    let (ts, id) = cursor
        .split_once('|')
        .ok_or_else(|| AppError::BadRequest("invalid cursor format".into()))?;

    let dt = DateTime::parse_from_rfc3339(ts)
        .map_err(|_| AppError::BadRequest("invalid cursor timestamp".into()))?
        .with_timezone(&Utc);

    Ok((dt, id.to_string()))
}

fn make_cursor(created_at: DateTime<Utc>, id: &str) -> String {
    format!("{}|{}", created_at.to_rfc3339(), id)
}

pub async fn get_feed(
    db: &PgPool,
    cursor: Option<&str>,
    limit: i64,
) -> Result<FeedResponse, AppError> {
    let rows = if let Some(c) = cursor {
        let (dt, id) = parse_cursor(c)?;
        repo::feed_repo::fetch_feed_after(db, dt, &id, limit)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?
    } else {
        repo::feed_repo::fetch_feed_latest(db, limit)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?
    };

    let items: Vec<FeedItem> = rows
        .iter()
        .map(|r| FeedItem {
            id: r.video_id.clone(),
            hls_url: r.hls_master_url.clone(),
            thumbnail_url: r.thumbnail_url.clone(),
            caption: r.caption.clone(),
            creator: Creator {
                id: r.user_id.clone(),
                name: r.user_name.clone(),
            },
            created_at: r.created_at.to_rfc3339(),
        })
        .collect();

    let next_cursor = rows.last().map(|r| make_cursor(r.created_at, &r.video_id));

    Ok(FeedResponse { items, next_cursor })
}
