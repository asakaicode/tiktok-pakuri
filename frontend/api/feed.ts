export type FeedItem = {
  id: string
  hlsUrl: string
  thumbnailUrl?: string
  caption?: string
  creator?: { id: string; name: string }
  createdAt: string
}

export type FeedResponse = {
  items: FeedItem[]
  nextCursor: string | null
}

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? 'http://localhost:3000'

export async function fetchFeed(params: {
  cursor?: string | null
  limit?: number
}): Promise<FeedResponse> {
  const { cursor, limit = 10 } = params
  const url = new URL(`${API_BASE}/feed`)

  url.searchParams.set('limit', String(limit))

  if (cursor) {
    url.searchParams.set('cursor', cursor)
  }

  const result = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!result.ok) {
    const text = await result.text().catch(() => '')
    throw new Error(`feed fetch failed: ${result.status} ${text}`)
  }

  return (await result.json()) as FeedResponse
}
