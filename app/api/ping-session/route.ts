import { auth } from "@/auth"; // this is your NextAuth auth()



export async function GET() {
  const session = await auth(); // this triggers session rolling if authenticated
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ status: "ok", userId: session?.user?.id || null });
}
