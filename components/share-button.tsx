'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";

export function ShareButton({ id }: { id: string }) {
  const [shareLink, setShareLink] = useState('');

  const handleShare = async () => {
    const response = await fetch(`/api/share/${id}`, { method: 'POST' });
    const data = await response.json();
    setShareLink(`${window.location.origin}/shared/${data.share_token}`);
  };

  return (
    <div>
      <Button onClick={handleShare}>Share Itinerary</Button>
      {shareLink && (
        <div className="mt-2">
          <input value={shareLink} readOnly className="border p-2 mr-2" />
          <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
            Copy Link
          </Button>
        </div>
      )}
    </div>
  );
}
