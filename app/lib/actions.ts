import { sql } from "@vercel/postgres";

export async function checkChatAccess(userId: string, chatId: string) {
  const { rows } = await sql.query(
    `SELECT * FROM conversations c
    JOIN conversation_participants p ON c.id = p.conversation_id
    WHERE c.id = $1 AND p.user_id = $2`,
    [chatId, userId]
  );

  return rows.length > 0;
}