import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

// Called by the admin panel after every save so changes go live on the next page view.
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  // expire: 0 — the next visitor gets fresh content instead of a stale copy
  revalidateTag("content", { expire: 0 });
  revalidatePath("/[locale]", "layout");

  return Response.json({ revalidated: true, now: Date.now() });
}
