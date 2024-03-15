"use server";

import type {JWTPayload} from "jose";

import {SignJWT, jwtVerify} from "jose";
import {cookies} from "next/headers";

export async function GenerateToken(data: JWTPayload) {
  const secret = new TextEncoder().encode("secret");
  const alg = "HS256";

  const token = await new SignJWT(data)
    .setProtectedHeader({alg})
    .setIssuer("secret")
    .setIssuedAt()
    .setExpirationTime("3600000000m") // Expire en 5 minutos
    .sign(secret);

  const cookieOptions = {
    maxAge: 3600000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
  };

  return {token, cookieOptions};
}

export async function CreateCookie(data: JWTPayload) {
  const {token, cookieOptions} = await GenerateToken(data);

  cookies().set("cookie-prueba", token, cookieOptions);
}

export async function getSession(cookie: {name: string; value: string}) {
  const cookieValue = !!cookie.value;

  if (!cookieValue) return undefined;

  const {payload} = await jwtVerify(cookie.value, new TextEncoder().encode("secret"));

  return payload;
}
