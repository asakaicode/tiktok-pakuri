use axum::Router;

use crate::state::AppState;

pub mod feed;
pub mod health;

pub fn router(state: AppState) -> Router {
  Router::new().merge(health::router()).merge(feed::router(state))
}
