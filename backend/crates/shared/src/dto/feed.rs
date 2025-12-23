use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct FeedQuery {
  pub cursor: Option<String>,
  pub limit: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedResponse {
  pub items: Vec<FeedItem>,
  pub next_cursor: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FeedItem {
  pub id: String,
  pub hls_url: String,
  pub thumbnail_url: Option<String>,
  pub caption: Option<String>,
  pub creator: Creator,
  pub created_at: String,
}

#[derive(Debug, Serialize)]
pub struct Creator {
  pub id: String,
  pub name: String,
}
