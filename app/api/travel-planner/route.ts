import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define the API route function
export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { message: "User not authenticated or email not available" },
        { status: 401 }
      );
    }

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
      Plan a detailed ${numDays}-day trip from ${fromLocation} to ${toLocation} for a group of ${numMembers} travelers. They will be traveling by ${travelType} and are a group of ${travelGroupType}. The travelers are interested in ${interests.join(", ")}. Create a personalized itinerary that includes:
      - Must-see attractions for each day.
      - Recommended food and dining spots, including local specialties.
      - Hidden gems and off-the-beaten-path experiences.
      - Travel tips and logistical advice for smooth navigation.
      - Suggestions for activities that align with their preferences.
      Ensure the itinerary is well-balanced, tailored to their interests, and offers a memorable travel experience.
    `;

    // Prepare the OpenAI API request
    const messages = [
      {
        role: "system",
        content: `You are an AI travel planner assistant. Your role is to generate personalized travel itineraries based on user input. The user will provide details such as the starting location, destination, number of travelers, travel group type, travel mode, trip duration, and specific interests. Based on this information, create a comprehensive and enjoyable itinerary for the user, which includes:
                  - A detailed day-by-day schedule for the trip.
                  - Recommended attractions, dining spots, and activities based on user preferences.
                  - Hidden gems and off-the-beaten-path experiences for each destination.
                  - Local travel tips, including advice on transportation and accommodations.
                  - Suggestions for wine and beer tasting venues.
                  - Logistics such as travel schedules and local transportation options.
                  - A detailed budget breakdown for the trip.
                  - A list of recommended hotels and accommodations.
                  - A list of recommended activities and experiences.
                  - Give me links to the places mentioned in the itinerary.
                  - links for booking tickets for planes, trains, buses and to the places mentioned in the itinerary.
                  - Always give me a trip plan for the round trip.
                  - If the provided details are insufficient or it is not technically feasible to plan the trip, inform the user that it is not possible to create a trip plan with the current input. Clearly explain the reason, and suggest adjustments to the trip plan accordingly. Also, ensure to mention any modifications you have made in the final itinerary to keep the user informed.
                  Ensure the itinerary is tailored to the users group type  and maximizes their travel experience.`,
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
        model: "gpt-4o-mini", // Ensure you're using the correct model
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
        itinerary: result,
        email_id: user.email  // Add the user's email to the database entry
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
