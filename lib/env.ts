const requiredServerEnv = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN", "SESSION_SECRET"] as const

type RequiredServerEnv = (typeof requiredServerEnv)[number]

function getEnvValue(name: RequiredServerEnv) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  tursoDatabaseUrl: getEnvValue("TURSO_DATABASE_URL"),
  tursoAuthToken: getEnvValue("TURSO_AUTH_TOKEN"),
  sessionSecret: getEnvValue("SESSION_SECRET"),
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD,
  adminFullName: process.env.ADMIN_FULL_NAME?.trim() || "Academy Administrator",
}
