import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { target, code, password } = await request.json();

    if (!target || !code || !password) {
      return NextResponse.json(
        { error: "Target, verification code, and new password are all required" },
        { status: 400 }
      );
    }

    // Check if user exists by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: target },
          { number: target }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email or phone number" },
        { status: 404 }
      );
    }

    // Verify latest unexpired OTP code
    const validOtp = await prisma.otp.findFirst({
      where: {
        target,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!validOtp) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      });

      // Delete the verified OTP code to prevent reuse
      await tx.otp.delete({
        where: { id: validOtp.id },
      });
    });

    return NextResponse.json({
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
