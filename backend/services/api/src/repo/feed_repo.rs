use chrono::{DateTime, Utc};
use sqlx::PgPool;

#[derive(Debug, sqlx::FromRow)]
pub struct FeedRow {
    pub video_id: String,
    pub caption: Option<String>,
    pub created_at: DateTime<Utc>,
    pub hls_master_url: String,
    pub thumbnail_url: Option<String>,
    pub user_id: String,
    pub user_name: String,
}

pub async fn fetch_feed_latest(db: &PgPool, limit: i64) -> Result<Vec<FeedRow>, sqlx::Error> {
    sqlx::query_as::<_, FeedRow>(
        r#"
        select
          v.id as video_id,
          v.caption,
          v.created_at,
          a.hls_master_url,
          a.thumbnail_url,
          u.id as user_id,
          u.name as user_name
        from videos v
        join video_assets a on a.video_id = v.id
        join users u on u.id = v.user_id
        where v.status = 'READY'
        order by v.created_at desc, v.id desc
        limit $1
        "#,
    )
    .bind(limit)
    .fetch_all(db)
    .await
}

pub async fn fetch_feed_after(
    db: &PgPool,
    cursor_created_at: DateTime<Utc>,
    cursor_id: &str,
    limit: i64,
) -> Result<Vec<FeedRow>, sqlx::Error> {
    sqlx::query_as::<_, FeedRow>(
        r#"
        select
          v.id as video_id,
          v.caption,
          v.created_at,
          a.hls_master_url,
          a.thumbnail_url,
          u.id as user_id,
          u.name as user_name
        from videos v
        join video_assets a on a.video_id = v.id
        join users u on u.id = v.user_id
        where
          v.status = 'READY'
          and (v.created_at, v.id) < ($1, $2)
        order by v.created_at desc, v.id desc
        limit $3
        "#,
    )
    .bind(cursor_created_at)
    .bind(cursor_id)
    .bind(limit)
    .fetch_all(db)
    .await
}
