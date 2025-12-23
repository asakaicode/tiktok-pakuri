use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};

use shared::dto::feed::{FeedQuery, FeedResponse};
use shared::error::AppError;

use crate::{domain, state::AppState};

pub async fn get_feed(
    State(st): State<AppState>,
    Query(q): Query<FeedQuery>,
) -> Result<Json<FeedResponse>, (StatusCode, String)> {
    let limit = q.limit.unwrap_or(10).clamp(1, 30);

    let res = domain::feed_service::get_feed(&st.db, q.cursor.as_deref(), limit)
        .await
        .map_err(map_err)?;

    Ok(Json(res))
}

fn map_err(e: AppError) -> (StatusCode, String) {
    match e {
        AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
        AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
    }
}
