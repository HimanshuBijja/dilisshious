import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db/mongoose";
import QuizResult from "@/lib/db/models/quiz-result";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  await connectDB();
  const result = await QuizResult.findOne({ userId }).lean();

  return NextResponse.json({ result: result || null });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id?: string }).id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const body = await req.json();
  const { answers, recommendedBundle } = body;

  if (!answers || !recommendedBundle) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await connectDB();
  const result = await QuizResult.findOneAndUpdate(
    { userId },
    { userId, answers, recommendedBundle },
    { upsert: true, new: true }
  );

  return NextResponse.json({ result });
}
