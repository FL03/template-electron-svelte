// src/lib/auth.ts
import { Magic } from "magic-sdk";
import { writable } from "svelte/store";
import { goto } from "$app/navigation";

export const store = writable(null);

let magic;

function createMagic() {
  magic = magic || new Magic(import.meta.env.VITE_MAGIC_PUBLIC_KEY as string);
  return magic;
}

// src/lib/auth.ts
export async function login(email: string): Promise<void> {
  const magic = createMagic();

  const didToken = await magic.auth.loginWithMagicLink({ email });

  // Validate the did token on the server
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${didToken}`
    }
  });

  if (res.ok) {
    const data = await res.json();
    store.set(data.user);
  }
}

// src/lib/auth.ts
export async function logout(): Promise<void> {
  await fetch("/api/logout");
  store.set(null);
  goto("/auth");
}
