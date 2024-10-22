'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelPlan {
  id: string;
  from_location: string;
  to_location: string;
  number_of_members: number;
  travel_type: string;
  travel_group_type: string;
  number_of_days: number;
  interests: string[];
  itinerary: string;
}

interface EditTravelPlanFormProps {
  travelPlan: TravelPlan;
}

export function EditTravelPlanForm({ travelPlan }: EditTravelPlanFormProps) {
  const [formData, setFormData] = useState<TravelPlan>(travelPlan);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/travel-planner/${travelPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/history');
      } else {
        console.error('Failed to update travel plan');
      }
    } catch (error) {
      console.error('Error updating travel plan:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest),
    }));
  };

  return (
    <div className="w-full mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Travel Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from_location">From Location</Label>
          <Input
            id="from_location"
            name="from_location"
            value={formData.from_location}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to_location">To Location</Label>
          <Input
            id="to_location"
            name="to_location"
            value={formData.to_location}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number_of_members">Number of Members</Label>
          <Input
            id="number_of_members"
            name="number_of_members"
            type="number"
            value={formData.number_of_members}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travel_type">Travel Type</Label>
          <Select onValueChange={(value) => handleSelectChange("travel_type", value)} value={formData.travel_type}>
            <SelectTrigger>
              <SelectValue placeholder="Select travel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="road">Road</SelectItem>
              <SelectItem value="air">Air</SelectItem>
              <SelectItem value="train">Train</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="travel_group_type">Travel Group Type</Label>
          <Select onValueChange={(value) => handleSelectChange("travel_group_type", value)} value={formData.travel_group_type}>
            <SelectTrigger>
              <SelectValue placeholder="Select group type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="solo">Solo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="number_of_days">Number of Days</Label>
          <Input
            id="number_of_days"
            name="number_of_days"
            type="number"
            value={formData.number_of_days}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {["mustSee", "greatFood", "hiddenGems", "wineBeer"].map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={interest}
                  checked={formData.interests.includes(interest)}
                  onCheckedChange={(checked) => handleCheckboxChange(interest, checked as boolean)}
                />
                <Label htmlFor={interest}>{interest}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="itinerary">Itinerary</Label>
          <Textarea
            id="itinerary"
            name="itinerary"
            value={formData.itinerary}
            onChange={handleInputChange}
            rows={5}
          />
        </div>
        <Button type="submit" className="w-full">Update Travel Plan</Button>
      </form>
    </div>
  );
}
