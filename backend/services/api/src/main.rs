mod app;
mod config;
mod db;
mod domain;
mod handlers;
mod repo;
mod routes;
mod state;

use axum::serve;
use dotenvy::dotenv;
use sqlx::PgPool;
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  dotenv().ok();

  tracing_subscriber::registry()
    .with(tracing_subscriber::EnvFilter::from_default_env().add_directive("info".parse()?))
    .with(tracing_subscriber::fmt::layer())
    .init();

  let cfg = config::Config::from_env()?;

  let db = PgPool::connect(&cfg.database_url).await?;

  // 初回のマイグレーションが必要になる場合にはここでマイグレーションが実行される
  sqlx::migrate!("./migrations").run(&db).await?;

  let state = state::AppState { db };
  let app = app::build_app(state);

  let addr: SocketAddr = cfg.bind.parse()?;
  tracing::info!("api listening on {}", addr);

  let listener = tokio::net::TcpListener::bind(addr).await?;
  serve(listener, app).await?;

  Ok(())
}
