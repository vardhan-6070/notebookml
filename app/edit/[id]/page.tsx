import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EditTravelPlanForm } from "@/components/edit-travel-plan-form";

export default async function EditPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: travelPlan, error } = await supabase
    .from('travel_plans')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !travelPlan) {
    console.error("Error fetching travel plan:", error);
    return redirect("/history");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <EditTravelPlanForm travelPlan={travelPlan} />
      </div>
    </main>
  );
}
