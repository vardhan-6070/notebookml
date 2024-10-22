import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Page } from "@/components/app-page";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background">
      <Page />
    </main>
  );
}
