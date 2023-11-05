"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createEvent(prevState: any, formData: FormData) {
  const schema = z.object({
    todo: z.string().min(1),
  });
  const data = schema.parse({
    todo: formData.get("todo"),
  });

  // Send to API

  // revalidatePath("/"); // Update cached path
  // revalidateTag('posts') // Update cached posts
  // redirect(`/post/${id}`) // Navigate to new route
}
