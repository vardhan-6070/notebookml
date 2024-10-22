import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { TravelPlanCard } from "@/components/travel-plan-card";

interface TravelPlan {
  id: string;
  from_location: string;
  to_location: string;
  number_of_days: number;
  created_at: string;
}

export default async function HistoryPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch travel plans for the current user
  const { data: travelPlans, error } = await supabase
    .from('travel_plans')
    .select('id, from_location, to_location, number_of_days, created_at')
    .eq('email_id', user.email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching travel plans:", error);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-6">Travel History</h1>
        {travelPlans && travelPlans.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {travelPlans.map((plan: TravelPlan) => (
              <TravelPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <p className="text-center">No travel plans found.</p>
        )}
      </div>
    </main>
  );
}
