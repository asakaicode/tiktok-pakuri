use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
  #[error("bad request: {0}")]
  BadRequest(String),

  #[error("internal error: {0}")]
  Internal(String),
}
