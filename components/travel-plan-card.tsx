'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface TravelPlan {
  id: string;
  from_location: string;
  to_location: string;
  number_of_days: number;
  created_at: string;
}

export function TravelPlanCard({ plan }: { plan: TravelPlan }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/travel-planner/${plan.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.refresh(); // This will trigger a re-render of the page
      } else {
        console.error('Failed to delete travel plan');
      }
    } catch (error) {
      console.error('Error deleting travel plan:', error);
    }
    setIsDeleting(false);
  };

  return (
    <Card key={plan.id}>
      <CardHeader>
        <CardTitle>{plan.from_location} to {plan.to_location}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{plan.number_of_days} days</p>
        <p>Created: {new Date(plan.created_at).toLocaleDateString()}</p>
        <div className="mt-4 space-x-2">
          <Link href={`/itinerary/${plan.id}`} passHref>
            <Button variant="outline">View Itinerary</Button>
          </Link>
          <Link href={`/edit/${plan.id}`} passHref>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
