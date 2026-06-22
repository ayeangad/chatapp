import "dotenv/config"

function readEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env variable: ${value}`)
  return value;
}

export const envFiles = {
  jwtSecret: readEnv("JWT_SECRET"),
  databaseUrl: readEnv("DATABASE_URL"),
  PORT: readEnv("PORT"),
  redisUrl: readEnv("REDIS_URL")
}
