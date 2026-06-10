"use server";

import { revalidatePath } from "next/cache";
import { addTodo, toggleTodo } from "@/lib/data";

export type AddTodoState = { error?: string };

export async function addTodoAction(
  _prevState: AddTodoState,
  formData: FormData,
): Promise<AddTodoState> {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) return { error: "Todo can't be empty." };
  if (text.length > 60) return { error: "Keep it under 60 characters." };

  addTodo(text);

  revalidatePath("/todos");
  return {};
}

export async function toggleTodoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  toggleTodo(id);
  revalidatePath("/todos");
}
