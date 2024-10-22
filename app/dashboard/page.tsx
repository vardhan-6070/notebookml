import { redirect } from "next/navigation";
import { Page } from "@/components/app-page";

export default async function DashboardPage() {

  return (
    <main className="max-h-screen w-full bg-background flex justify-center items-start">
      <div className="w-full max-w-6xl px-4 py-10">
        <Page />
      </div>
    </main>
  );
}
