import crypto from "crypto";
import { UserRole } from "@/lib/validations/auth";

type SessionPayload = {
  userId: number;
  role: UserRole;
  exp: number;
};

function base64UrlEncode(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
  const padded = input.padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function signPayload(encodedPayload: string, secret: string) {
  return base64UrlEncode(crypto.createHmac("sha256", secret).update(encodedPayload).digest());
}

export function createSessionToken(payload: SessionPayload, secret: string) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const [encodedPayload, encodedSignature] = token.split(".");
  if (!encodedPayload || !encodedSignature) {
    return null;
  }

  const expected = signPayload(encodedPayload, secret);
  if (encodedSignature.length !== expected.length) {
    return null;
  }
  if (
    !crypto.timingSafeEqual(
      Buffer.from(encodedSignature, "utf8"),
      Buffer.from(expected, "utf8")
    )
  ) {
    return null;
  }

  try {
    const raw = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
    if (!Number.isInteger(raw.userId) || raw.userId <= 0) {
      return null;
    }
    if (!["CLIENT", "VENDOR", "ADMIN"].includes(raw.role)) {
      return null;
    }
    if (!Number.isInteger(raw.exp) || raw.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}
