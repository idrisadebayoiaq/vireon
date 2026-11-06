import "server-only";

export function getServerEnv() {
  const url = process.env.SUPABASE_PROJECT_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!url || !anon || !serviceRole || !openRouterKey) {
    throw new Error("Missing server environment variables");
  }

  return { url, anon, serviceRole, openRouterKey };
}
