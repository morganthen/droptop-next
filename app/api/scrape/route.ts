import ogs from "open-graph-scraper";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    try {
      const check = await fetch(url, { method: "HEAD" });
      if (!check.ok) {
        return Response.json(
          { message: "URL is not reachable" },
          { status: 422 },
        );
      }
    } catch {
      return Response.json({ error: "Failed to reach URL" }, { status: 422 });
    }
    const { error, result } = await ogs({ url });

    if (error) {
      return Response.json(
        { message: "Something went wrong scraping metadata" },
        { status: 500 },
      );
    }

    return Response.json({ result }, { status: 200 });
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
}
