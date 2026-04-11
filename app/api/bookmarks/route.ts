import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
    });
    return Response.json(bookmarks, { status: 200 });
  } catch {
    return Response.json({ message: "Unauthorized" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });
  try {
    const { title, description, imageUrl, url, tags, user } = await req.json();
    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        description,
        imageUrl,
        url,
        tags,
        user,
        userId,
      },
    });
    return Response.json(bookmark, { status: 200 });
  } catch {
    return Response.json(
      { message: "Error creating bookmarks" },
      { status: 500 },
    );
  }
}
