import { NextResponse } from "next/server";
import prisma from "@repo/db/client";

export async function POST(request: Request) {
  try {
    const { target } = await request.json();

    if (!target) {
      return NextResponse.json(
        { error: "Phone number or email is required" },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Store in database
    await prisma.otp.create({
      data: {
        target,
        code,
        expiresAt,
      },
    });

    // Output to console for server-side verification
    console.log(`\n--- [OTP SERVICE] OTP for ${target} is: ${code} ---\n`);

    // In development mode, we also return the OTP in response so that the UI can display it
    // for easier manual verification without looking at the terminal.
    return NextResponse.json({
      message: "OTP sent successfully. Check console log.",
      otp: code, // returned for verification ease
    });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to generate OTP" },
      { status: 500 }
    );
  }
}
