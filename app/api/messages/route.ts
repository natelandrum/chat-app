import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { auth } from '@/auth';

// POST: Store a new message
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { conversation_id, content } = await req.json();
  const sender_id = session.user.id;

  if (!conversation_id || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const created_at = new Date().toISOString();

  try {
    const { rows } = await sql`
      INSERT INTO messages (conversation_id, sender_id, content, created_at)
      VALUES (${conversation_id}, ${sender_id}, ${content}, ${created_at})
      RETURNING *
    `;
    return NextResponse.json({status: 200, message: rows[0]});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// GET: Retrieve messages for a conversation with pagination
export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversation_id = searchParams.get('conversation_id');
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const cursor = searchParams.get('cursor');

  if (!conversation_id) {
    return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 });
  }

  try {
    let query = `
      SELECT id, sender_id, content, created_at
      FROM messages
      WHERE conversation_id = $1
    `;
    const params: (string | number)[] = [conversation_id];

    if (cursor) {
      query += ` AND created_at < $2`;
      params.push(cursor);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit + 1);

    const { rows } = await sql.query(query, params);

    const messages = rows.slice(0, limit);
    const nextCursor = rows.length > limit ? rows[limit - 1].created_at : null;

    return NextResponse.json({ messages, nextCursor });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// PUT - Edit a message
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId, newContent } = await req.json();

  if (!messageId || typeof newContent !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const {
      rows: [message],
    } = await sql`
      SELECT sender_id FROM messages WHERE id = ${messageId}
    `;

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.sender_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await sql`
      UPDATE messages
      SET content = ${newContent}
      WHERE id = ${messageId}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Edit message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Remove a message
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messageId } = await req.json();

  if (!messageId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const {
      rows: [message],
    } = await sql`
      SELECT sender_id FROM messages WHERE id = ${messageId}
    `;

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.sender_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await sql`
      DELETE FROM messages WHERE id = ${messageId}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
