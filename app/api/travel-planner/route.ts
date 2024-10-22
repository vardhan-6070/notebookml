import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define the API route function
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Extract form data from the request body
    const {
      fromLocation,
      toLocation,
      numMembers,
      travelType,
      travelGroupType,
      numDays,
      interests,
    } = await request.json();

    // Validate required inputs
    if (!fromLocation || !toLocation || !numMembers || !numDays || !travelType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construct prompt based on the provided data
    const prompt = `
      Plan a trip from ${fromLocation} to ${toLocation} for ${numMembers} people. 
      It will be a ${numDays}-day trip using ${travelType} travel. 
      The travelers are ${travelGroupType}, and they are interested in ${interests.join(", ")}. 
      Provide a brief itinerary with recommendations for must-see attractions, food options, and hidden gems.
    `;

    // Prepare the OpenAI API request
    const messages = [
      {
        role: "system",
        content: "You are an AI travel assistant that generates personalized travel itineraries.",
      },
      { role: "user", content: prompt },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4", // Ensure you're using the correct model
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Extract the result from the OpenAI response
    const result = data.choices?.[0]?.message?.content?.trim();
    if (!result) {
      throw new Error("Failed to generate travel plan.");
    }

    // Store the inputs and generated plan in the Supabase database
    const { data: insertedData, error: insertError } = await supabase
      .from('travel_plans')
      .insert({
        from_location: fromLocation,
        to_location: toLocation,
        number_of_members: numMembers,
        travel_group_type: travelGroupType,
        travel_type: travelType,
        number_of_days: numDays,
        interests: interests,
        itinerary: result
      })
      .select();

    if (insertError) {
      throw new Error(`Failed to store travel plan: ${insertError.message}`);
    }

    // Return the result as a JSON response
    return NextResponse.json({ itinerary: result, id: insertedData[0].id }, { status: 200 });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { message: "Error generating or storing travel plan", error: errorMessage },
      { status: 500 }
    );
  }
}
