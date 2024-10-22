import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { data, error } = await supabase
    .from('travel_plans')
    .update(body)
    .eq('id', params.id)
    .eq('email_id', user.email)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from('travel_plans')
    .delete()
    .eq('id', params.id)
    .eq('email_id', user.email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Travel plan deleted successfully" });
}
