import { redirect } from "next/navigation";
import { Page } from "@/components/app-page";

export default async function DashboardPage() {

  return (
    <main className="min-h-screen bg-background">
      <Page />
    </main>
  );
}
