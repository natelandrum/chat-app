import { auth } from "@/auth"; // NextAuth handler
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { validate as isValidUUID } from "uuid";



export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const limit = 4; // Default limit
  const cursor = searchParams.get("cursor"); // ISO timestamp

  let query = `
    SELECT c.id, c.name, c.created_at,
           (
             SELECT content FROM messages
             WHERE conversation_id = c.id
             ORDER BY created_at DESC
             LIMIT 1
           ) AS last_message_preview,
           (
             SELECT COUNT(*) FROM messages
             WHERE conversation_id = c.id
               AND created_at > COALESCE(
                 (SELECT last_read_at FROM conversation_participants WHERE conversation_id = c.id AND user_id = $1), '1970-01-01'
               )
               AND user_id != $1
           ) AS unread_count,
           (
             SELECT ARRAY_AGG(user_id) FROM conversation_participants WHERE conversation_id = c.id
           ) AS members
    FROM conversations c
    JOIN conversation_participants p ON c.id = p.conversation_id
    WHERE p.user_id = $1
  `;

const params: (string | number | null)[] = [userId];

if (cursor && cursor !== "0" && !isNaN(Date.parse(cursor))) {
  query += ` AND c.created_at < $2`;
  params.push(cursor);
}

  query += ` ORDER BY 
    (
      SELECT created_at FROM messages
      WHERE conversation_id = c.id
      ORDER BY created_at DESC
      LIMIT 1
    ) DESC NULLS LAST, c.created_at DESC LIMIT ${limit + 1}`; // Fetch one extra to check for next page

  const { rows } = await sql.query(query, params);

  const chats = rows.slice(0, limit);
  const nextCursor = rows.length > limit ? rows[limit - 1].created_at : null;

  return NextResponse.json({ chats, nextCursor });
}



export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { participants, name }: { participants: string[]; name: string } = await req.json();

  if (!participants.every((id) => isValidUUID(id))) {
  return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
  }

  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    return NextResponse.json({ error: "Invalid participant list" }, { status: 400 });
  }

  const chatId = uuidv4();

  await sql`INSERT INTO conversations (id, name) VALUES (${chatId}, ${name})`;

  for (const participantId of participants) {
      await sql`INSERT INTO conversation_participants (conversation_id, user_id) VALUES (${chatId}, ${participantId})`;
  }

  // Also add current user as participant
if (!participants.includes(session.user.id)) {
  await sql`INSERT INTO conversation_participants (conversation_id, user_id) VALUES (${chatId}, ${session.user.id})`;
}
  return NextResponse.json({ message: "Chat created", id: chatId });
}
