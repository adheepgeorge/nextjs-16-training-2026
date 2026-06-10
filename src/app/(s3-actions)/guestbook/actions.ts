"use server";

import { revalidatePath } from "next/cache";
import { addGuestbookEntry } from "@/lib/data";

export async function signGuestbook(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !message) return;

  addGuestbookEntry(name, message);

  revalidatePath("/guestbook");
}
