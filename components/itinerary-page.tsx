"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ItineraryPage() {
  const [itinerary, setItinerary] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedItinerary = localStorage.getItem("itinerary");
    if (storedItinerary) {
      setItinerary(storedItinerary);
      localStorage.removeItem("itinerary"); // Clear the stored itinerary
    } else {
      router.push("/itinerary"); // Redirect if no itinerary is found
    }
  }, [router]);

  if (!itinerary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Your Travel Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-100 rounded-md text-black">
            <p className="whitespace-pre-wrap">{itinerary}</p>
          </div>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/dashboard")}>
              Back to Planner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
