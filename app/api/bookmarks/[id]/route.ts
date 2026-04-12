import { getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });
  try {
    const { id } = await params;
    const data = await req.json();
    const updatedBookmark = await prisma.bookmark.update({
      where: { id: parseInt(id), userId },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags,
      },
    });
    return Response.json(updatedBookmark, { status: 200 });
  } catch {
    return Response.json(
      { message: "There was a problem updating bookmark" },
      { status: 401 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = getUserId(req);
  if (!userId) return new Response("Unauthorized", { status: 401 });
  try {
    const { id } = await params;
    await prisma.bookmark.delete({ where: { id: parseInt(id), userId } });
    return Response.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch {
    return Response.json(
      { message: "There was a problem deleting bookmark" },
      { status: 401 },
    );
  }
}
