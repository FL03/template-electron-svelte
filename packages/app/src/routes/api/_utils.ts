import {serialize} from "cookie";
import dotenv from "dotenv";
import Iron from "@hapi/iron";

dotenv.config();

const ENCRYPTION_SECRET = process.env["ENCRYPTION_SECRET"];
const SESSION_LENGTH_MS = 604800000;
export const SESSION_NAME = "session";

async function encrypt(data): Promise<string> {
    return data && Iron.seal(data, ENCRYPTION_SECRET, Iron.defaults);
}

async function decrypt<T>(data: string): Promise<T> {
    return data && Iron.unseal(data, ENCRYPTION_SECRET, Iron.defaults);
}

export async function createSessionCookie(data: any): Promise<string> {
    const encrypted_data = await encrypt(data);

    return serialize(SESSION_NAME, encrypted_data, {
        maxAge: SESSION_LENGTH_MS / 1000,
        expires: new Date(Date.now() + SESSION_LENGTH_MS),
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production",
        path: "/",
        sameSite: "lax"
    });
}

export async function getSession<T>(cookie: string): Promise<T> {
    return await decrypt(cookie);
}

export function removeSessionCookie(): string {
    return serialize(SESSION_NAME, "", {
        maxAge: -1,
        path: "/"
    });
}