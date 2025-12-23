use std::env;

#[derive(Clone)]
pub struct Config {
  pub bind: String,
  pub database_url: String,
}

impl Config {
  pub fn from_env() -> anyhow::Result<Self> {
    let bind = env::var("API_BIND").unwrap_or_else(|_| "0.0.0.0:3000".to_string());
    let database_url = env::var("DATABASE_URL")?;
    Ok(Self { bind, database_url })
  }
}
