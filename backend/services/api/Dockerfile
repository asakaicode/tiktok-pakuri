############################
# Build stage
############################
FROM rust:1.92.0-slim-bookworm AS builder
WORKDIR /app

# 依存キャッシュを効かせる
COPY Cargo.toml Cargo.lock ./
COPY crates ./crates
COPY services ./services

# release build
RUN cargo build -p api --release

############################
# Runtime stage
############################
FROM debian:bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/api /app/api

# ※ api 側で sqlx::migrate!("./migrations") を使う場合のみ必要
COPY services/api/migrations /app/migrations

EXPOSE 3000

CMD ["/app/api"]