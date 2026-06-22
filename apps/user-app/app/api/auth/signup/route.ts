import { NextResponse } from "next/server";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Either Email or Phone number must be provided" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { number: phone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "User with this phone number already exists" },
          { status: 400 }
        );
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and initialize balance in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: name || null,
          email: email || null,
          number: phone || null,
          password: hashedPassword,
        },
      });

      // Create default balance for user
      await tx.balance.create({
        data: {
          userId: user.id,
          amount: 0,
          locked: 0,
        },
      });

      return user;
    });

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.number,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
