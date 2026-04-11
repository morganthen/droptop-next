import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    //check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return new Response("Invalid email or password", { status: 401 });
    }
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid email or password", { status: 401 });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    //create session and return success response
    return Response.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    return new Response("Error logging in", { status: 500 });
  }
}
