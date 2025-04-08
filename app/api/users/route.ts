import { auth } from "@/auth";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const search = body.search?.trim().toLowerCase();

  if (search === "") {
    return NextResponse.json({users: []}, { status: 200 });
  }
  // Basic input validation
  if (search && typeof search !== "string") {
    return NextResponse.json({ error: "Invalid search input" }, { status: 400 });
  }

  try {
    let query = `
      SELECT id, name, email
      FROM users
      WHERE id != $1
    `;
    const params: (string | number | null)[] = [session.user.id];

    if (search) {
      query += ` AND (LOWER(name) LIKE $2 OR LOWER(email) LIKE $2)`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY name LIMIT 20`;

    const { rows } = await sql.query(query, params);
    
    return NextResponse.json({ users: rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
