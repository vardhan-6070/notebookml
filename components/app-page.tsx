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
import { useRouter } from "next/navigation";

export function Page() {
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    numMembers: 1,
    travelType: "",
    travelGroupType: "",
    numDays: 1,
    interests: [],
  });

  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interestsArray = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      interests: interestsArray,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/travel-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the itinerary in localStorage
        localStorage.setItem("itinerary", data.itinerary);
        // Redirect to the itinerary page
        router.push("/itinerary");
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
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Bike">Bike</SelectItem>
                    <SelectItem value="Ship">Ship</SelectItem>
                    <SelectItem value="Train">Train</SelectItem>
                    <SelectItem value="Plane">Plane</SelectItem>
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
                    <SelectItem value="Couple">Couple</SelectItem>
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
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  placeholder="MustSee, GreatFood, HiddenGems, WineBeer"
          />
                  value={formData.interests.join(', ')}
                  onChange={handleInterestsChange}
                />
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
