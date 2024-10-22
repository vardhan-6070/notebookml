import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SharedItineraryPage({ params }: { params: { token: string } }) {
  const supabase = createClient();

  const { data: travelPlan, error } = await supabase
    .from('travel_plans')
    .select('*')
    .eq('share_token', params.token)
    .single();

  if (error || !travelPlan) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Shared Itinerary: {travelPlan.from_location} to {travelPlan.to_location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p><strong>Duration:</strong> {travelPlan.number_of_days} days</p>
              <p><strong>Travel Type:</strong> {travelPlan.travel_type}</p>
              <p><strong>Group Type:</strong> {travelPlan.travel_group_type}</p>
              <p><strong>Number of Travelers:</strong> {travelPlan.number_of_members}</p>
              <p><strong>Interests:</strong> {travelPlan.interests.join(", ")}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-md text-black">
              <h3 className="text-xl font-semibold mb-2">Itinerary</h3>
              <p className="whitespace-pre-wrap">{travelPlan.itinerary}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
