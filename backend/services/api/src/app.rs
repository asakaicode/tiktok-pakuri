use axum::Router;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::routes;

pub fn build_app(state: crate::state::AppState) -> Router {
  Router::new().merge(routes::router(state)).layer(TraceLayer::new_for_http()).layer(CorsLayer::permissive())
}
