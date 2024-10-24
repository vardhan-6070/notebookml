"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown"; // Import react-markdown

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
          <CardTitle className="text-3xl font-bold text-center mb-6">
            Your Travel Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-100 rounded-md text-black">
            <ReactMarkdown
              components={{
                p: ({ node, children }) => (
                  <p className="mb-6 mt-4 whitespace-pre-wrap">{children}</p> // Margin bottom for paragraphs
                ),
                h1: ({ node, children }) => (
                  <h1 className="text-2xl font-bold mt-6 ">{children}</h1> // Margin above and below H1
                ),
                h2: ({ node, children }) => (
                  <h2 className="text-xl font-bold mt-6 ">{children}</h2> // Margin above and below H2
                ),
                h3: ({ node, children }) => (
                  <h3 className="text-lg font-bold mt-6 ">{children}</h3> // Margin above and below H3
                ),
                a: ({ node, href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {children}
                  </a>
                ), // Custom link styling
              }}
            >
              {itinerary}
            </ReactMarkdown>
          </div>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              Back to Planner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
