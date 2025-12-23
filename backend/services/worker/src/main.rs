//mod config;
//mod processors;
//mod queue;
//mod repo;
//mod state;
//mod storage;

use dotenvy::dotenv;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
  dotenv().ok();

  tracing_subscriber::registry()
    .with(tracing_subscriber::EnvFilter::from_default_env().add_directive("info".parse()?))
    .with(tracing_subscriber::fmt::layer())
    .init();

  tracing::info!("worker starting (skeleton)");
  // TODO: dequeue -> transcode -> upload -> db update
  Ok(())
}
