"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure Checkbox is correctly implemented

export function Page() {
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    numMembers: 1,
    travelType: "",
    travelGroupType: "",
    numDays: 1,
    interests: {
      mustSee: false,
      greatFood: false,
      hiddenGems: false,
      wineBeer: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "number" ? parseInt(value) : value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (
    id: keyof typeof formData.interests,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      interests: { ...prev.interests, [id]: checked },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    // Extract checked interests into an array
    const selectedInterests = Object.keys(formData.interests).filter(
      (key) => formData.interests[key as keyof typeof formData.interests]
    );

    try {
      const response = await fetch("/api/travel-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setItinerary(data.itinerary);
      } else {
        setError(data.message || "Failed to generate travel plan.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            AI Travel Planner
          </CardTitle>
          <CardDescription className="text-center">
            Plan your perfect trip with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fromLocation">From Location</Label>
                <Input
                  id="fromLocation"
                  placeholder="Enter starting point"
                  value={formData.fromLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="toLocation">To Location</Label>
                <Input
                  id="toLocation"
                  placeholder="Enter destination"
                  value={formData.toLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numMembers">Number of Members</Label>
                <Input
                  id="numMembers"
                  type="number"
                  min="1"
                  value={formData.numMembers}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="travelType">Travel Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, travelType: value }))
                  }
                >
                  <SelectTrigger id="travelType">
                    <SelectValue placeholder="Select travel mode" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="road">Road</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="travelGroupType">Travel Group Type</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, travelGroupType: value }))
                  }
                >
                  <SelectTrigger id="travelGroupType">
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="friends">Friends</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="solo">Solo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="numDays">Number of Days</Label>
                <Input
                  id="numDays"
                  type="number"
                  min="1"
                  value={formData.numDays}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label>Interests</Label>
                <div className="flex flex-col space-y-2">
                  {(
                    ["mustSee", "greatFood", "hiddenGems", "wineBeer"] as Array<
                      keyof typeof formData.interests
                    >
                  ).map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests[interest]}
                        onCheckedChange={(checked: boolean) =>
                          handleCheckboxChange(interest, checked)
                        }
                      />
                      <label htmlFor={interest} className="text-sm font-medium">
                        {interest.replace(/([A-Z])/g, " $1")}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-center">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Planning..." : "Plan My Trip"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>

        {itinerary && (
          <CardFooter className="mt-4">
            <div className="w-full p-4 bg-gray-100 rounded-md text-black">
              <h3 className="text-lg font-bold mb-2">Your Itinerary:</h3>
              <p>{itinerary}</p>
            </div>
          </CardFooter>
        )}

        {error && (
          <CardFooter className="mt-4 text-red-500">
            <p>{error}</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
