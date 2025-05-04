import {organizations} from "@/drizzle/schema/organizations";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const orgs = await db.select().from(organizations);
    return NextResponse.json(orgs);
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return NextResponse.json({error: "Internal Server Error"}, {status: 500});
  }
}
