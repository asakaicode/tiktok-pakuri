use axum::{routing::get, Router};

use crate::{handlers, state::AppState};

pub fn router(state: AppState) -> Router {
  Router::new().route("/feed", get(handlers::feed_get::get_feed)).with_state(state)
}
