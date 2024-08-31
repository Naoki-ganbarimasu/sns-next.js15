"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "./prisma";

type State = {
  error?: string | undefined;
  success: boolean;
};

export async function addPostAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const { userId } = auth();
    const postText = formData.get("post") as string;
    const postTextSchema = z
      .string()
      .min(1, "1文字以上で投稿位sてください")
      .max(140, "140字以内で投稿してください");

    if (!userId) {
      return { error: "ログインしてください", success: false };
    }
    const validatedPostText = postTextSchema.parse(postText);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId
      }
    });

    revalidatePath("/");
    revalidateTag("post");

    return {
      error: undefined,
      success: true
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((error) => error.message).join(", "),
        success: false
      };
    } else if (error instanceof Error) {
      console.error(error.message);
      return {
        error: error.message,
        success: false
      };
    } else {
      return {
        error: "予期せぬエラーが起きました。",
        success: false
      };
    }
  }
}
