// src/routes/api/logout.ts
import type { Request, Response } from "@sveltejs/kit";
import { magic } from "./_magic";
import { removeSessionCookie } from "./_utils";

export async function get(req: Request): Promise<Response> {
  const cookie = removeSessionCookie();

  try {
    await magic.users.logoutByIssuer(req.locals.user.issuer);
  } catch (err) {
    console.log("Magic session already expired");
  }

  return {
    status: 200,
    headers: {
      "set-cookie": cookie
    },
    body: {}
  };
}