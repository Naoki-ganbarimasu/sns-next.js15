"use server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";

export async function addPostAction(formData: FormData) {
    try {
      const {userId} = auth()
      const postText = formData.get("post") as string;
      const postTextSchema = z
      .string()
      .min(1,"1文字以上で投稿位sてください")
      .max(140, "140字以内で投稿してください")
      
      if (!userId) {
        console.error("User not authenticated")
        return;
      }
      const validatedPostText = postTextSchema.parse(postText)
    
      await prisma.post.create({
        data: { 
          content: validatedPostText,
          authorId: userId,
          
        },
      });
      return {
        error:undefined,
            success:true,
          }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return  {
          error:error.errors.map((error) => error.message).join(", "),
          success:false,
        }
        } else if (error instanceof Error) {
          console.error(error instanceof Error);
        } else {
          return {
            error:"予期せぬエラーが起きました。",
            success:false,
          }}
  }}