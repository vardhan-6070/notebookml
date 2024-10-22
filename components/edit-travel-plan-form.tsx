'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function EditTravelPlanForm({ travelPlan }) {
  const [formData, setFormData] = useState(travelPlan);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="from_location"
        value={formData.from_location}
        onChange={handleChange}
        placeholder="From Location"
      />
      <Input
        name="to_location"
        value={formData.to_location}
        onChange={handleChange}
        placeholder="To Location"
      />
      <Input
        name="number_of_days"
        type="number"
        value={formData.number_of_days}
        onChange={handleChange}
        placeholder="Number of Days"
      />
      <Textarea
        name="itinerary"
        value={formData.itinerary}
        onChange={handleChange}
        placeholder="Itinerary"
        rows={10}
      />
      <Button type="submit">Update Travel Plan</Button>
    </form>
  );
}
