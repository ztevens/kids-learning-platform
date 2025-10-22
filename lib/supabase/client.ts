import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Key are required to create a Supabase client! Check your Supabase project's API settings to find these values: https://supabase.com/dashboard/project/_/settings/api")
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  )
}