import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/share-button";
import ReactMarkdown from 'react-markdown';

interface TravelPlan {
  id: string;
  from_location: string;
  to_location: string;
  number_of_days: number;
  travel_type: string;
  travel_group_type: string;
  number_of_members: number;
  interests: string[];
  itinerary: string;
  created_at: string;
}

export default async function ItineraryPage({ params }: { params: { id: string } }) {
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
    return notFound();
  }

  const plan = travelPlan as TravelPlan;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {plan.from_location} to {plan.to_location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p><strong>Duration:</strong> {plan.number_of_days} days</p>
              <p><strong>Travel Type:</strong> {plan.travel_type}</p>
              <p><strong>Group Type:</strong> {plan.travel_group_type}</p>
              <p><strong>Number of Travelers:</strong> {plan.number_of_members}</p>
              <p><strong>Interests:</strong> {plan.interests.join(", ")}</p>
              <p><strong>Created:</strong> {new Date(plan.created_at).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-md text-black">
              <h3 className="text-xl font-semibold mb-2">Itinerary</h3>
              <ReactMarkdown
                components={{
                  p: ({ node, children }) => (
                    <p className="mb-4 mt-4 whitespace-pre-wrap">{children}</p>
                  ),
                  h1: ({ node, children }) => (
                    <h1 className="text-2xl font-bold mt-6 ">{children}</h1>
                  ),
                  h2: ({ node, children }) => (
                    <h2 className="text-xl font-bold mt-6 ">{children}</h2>
                  ),
                  h3: ({ node, children }) => (
                    <h3 className="text-lg font-bold mt-6 ">{children}</h3>
                  ),
                  a: ({ node, href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {plan.itinerary}
              </ReactMarkdown>
            </div>
            <div className="mt-6 flex justify-between">
              <Link href="/history" passHref>
                <Button variant="outline">Back to History</Button>
              </Link>
              <ShareButton id={plan.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
