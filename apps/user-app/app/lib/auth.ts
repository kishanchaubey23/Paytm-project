import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone or Email", type: "text", placeholder: "user@example.com / 1234567890" },
            password: { label: "Password", type: "password" },
            otp: { label: "OTP", type: "text" },
            loginType: { label: "Login Type", type: "text" }
          },
          async authorize(credentials: any) {
            if (!credentials || !credentials.phone) {
              return null;
            }

            const identifier = credentials.phone;

            // OTP validation flow
            if (credentials.loginType === "otp") {
              if (!credentials.otp) return null;

              // Check if correct, unexpired OTP exists
              const validOtp = await db.otp.findFirst({
                where: {
                  target: identifier,
                  code: credentials.otp,
                  expiresAt: {
                    gt: new Date()
                  }
                },
                orderBy: {
                  createdAt: 'desc'
                }
              });

              if (!validOtp) {
                return null;
              }

              // Delete the verified OTP code to prevent reuse
              await db.otp.delete({
                where: { id: validOtp.id }
              });

              // Check if user already exists
              let user = await db.user.findFirst({
                where: {
                  OR: [
                    { email: identifier },
                    { number: identifier }
                  ]
                }
              });

              // If user does not exist, perform automatic signup!
              if (!user) {
                const isEmail = identifier.includes('@');
                try {
                  user = await db.user.create({
                    data: {
                      email: isEmail ? identifier : null,
                      number: !isEmail ? identifier : null,
                      name: isEmail ? identifier.split('@')[0] : `user_${identifier}`,
                      password: "", // passwordless user has empty password initially
                      Balance: {
                        create: {
                          amount: 0,
                          locked: 0
                        }
                      }
                    }
                  });
                } catch (e) {
                  console.error("Automatic signup failed during OTP login:", e);
                  return null;
                }
              }

              return {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                number: user.number
              };
            }

            // Password validation flow
            const existingUser = await db.user.findFirst({
                where: {
                    OR: [
                      { email: identifier },
                      { number: identifier }
                    ]
                }
            });

            if (existingUser && existingUser.password) {
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.email,
                        number: existingUser.number
                    }
                }
            }

            return null;
          },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.number = user.number;
                token.email = user.email;
            }
            return token;
        },
        async session({ token, session }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.number = token.number;
                session.user.email = token.email;
            }
            return session;
        }
    }
  }
  