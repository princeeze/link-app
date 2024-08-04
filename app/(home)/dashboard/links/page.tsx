import { createClient } from "@/utils/supabase/server";

export default async function Links() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return <div>how tf did you get here</div>;
  } else if (!data) {
    return <div>no data</div>;
  }
  return (
    <div>
      <p>Links</p>
      <p>{data.user.email}</p>
    </div>
  );
}
