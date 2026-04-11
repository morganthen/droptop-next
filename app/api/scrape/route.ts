import ogs from "open-graph-scraper";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
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
