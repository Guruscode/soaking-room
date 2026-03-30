import { createClient } from "@libsql/client"
import { env } from "@/lib/env"

export const turso = createClient({
  url: env.tursoDatabaseUrl,
  authToken: env.tursoAuthToken,
})
