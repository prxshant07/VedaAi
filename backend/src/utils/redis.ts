import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function connectRedis(): Promise<void> {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is missing');
  }

  redisClient = createClient({
    url: process.env.REDIS_URL,

    socket: {
      tls: true,
      reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
      keepAlive: 5000,
      connectTimeout: 10000,
    },
  }) as RedisClientType;

  redisClient.on('error', (err) =>
    console.error('❌ Redis error:', err)
  );

  redisClient.on('connect', () =>
    console.log('✅ Redis connected')
  );

  redisClient.on('ready', () =>
    console.log('🚀 Redis ready')
  );

  redisClient.on('reconnecting', () =>
    console.log('🔄 Redis reconnecting...')
  );

  redisClient.on('end', () =>
    console.log('⚠️ Redis connection closed')
  );

  await redisClient.connect();
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error(
      'Redis client not initialized. Call connectRedis() first.'
    );
  }

  return redisClient;
}

// Cache helpers
export async function cacheGet(
  key: string
): Promise<string | null> {
  return getRedisClient().get(key);
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds = 3600
): Promise<void> {
  await getRedisClient().setEx(key, ttlSeconds, value);
}

export async function cacheDel(key: string): Promise<void> {
  await getRedisClient().del(key);
}

export async function setJobStatus(
  jobId: string,
  status: object
): Promise<void> {
  await cacheSet(
    `job:${jobId}`,
    JSON.stringify(status),
    86400
  );
}

export async function getJobStatus(
  jobId: string
): Promise<object | null> {
  const data = await cacheGet(`job:${jobId}`);

  return data ? JSON.parse(data) : null;
}