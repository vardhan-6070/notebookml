import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

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
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.from_location} to {plan.to_location}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{plan.number_of_days} days</p>
                  <p>Created: {new Date(plan.created_at).toLocaleDateString()}</p>
                  <Link href={`/itinerary/${plan.id}`} className="text-blue-500 hover:underline">
                    View Itinerary
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center">No travel plans found.</p>
        )}
      </div>
    </main>
  );
}
