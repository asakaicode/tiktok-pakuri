create table if not exists users (
  id text primary key,
  name text not null
);

create table if not exists videos (
  id text primary key,
  user_id text not null references users(id),
  caption text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists video_assets (
  video_id text primary key references videos(id),
  hls_master_url text not null,
  thumbnail_url text,
  duration_sec int,
  width int,
  height int
);

create index if not exists videos_feed_idx
  on videos (status, created_at desc, id desc);
