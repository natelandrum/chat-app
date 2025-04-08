import { NextResponse } from "next/server";
import Ably from "ably";
import { auth } from "@/auth";

const ablyRest = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const tokenRequestData = await ablyRest.auth.createTokenRequest({ clientId: userId });
    return NextResponse.json(tokenRequestData, { status: 200 });
  } catch (error) {
    console.error("Error generating Ably token:", error);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
