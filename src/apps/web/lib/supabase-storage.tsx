import { createClient } from "@supabase/supabase-js";

export const supabaseStorage = createClient(
  process.env.NEXT_PUBLIC_API!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER ONLY
);
