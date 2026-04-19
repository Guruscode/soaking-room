const requiredServerEnv = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN", "SESSION_SECRET", "SMTP_USER", "SMTP_PASS"] as const

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
  smtpUser: getEnvValue("SMTP_USER"),
  smtpPass: getEnvValue("SMTP_PASS"),
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: parseInt(process.env.SMTP_PORT || "587"),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpFromName: process.env.SMTP_FROM_NAME || "Tsr Academy",
  smtpFromEmail: process.env.SMTP_FROM_EMAIL || getEnvValue("SMTP_USER"),
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD,
  adminFullName: process.env.ADMIN_FULL_NAME?.trim() || "Academy Administrator",
}
