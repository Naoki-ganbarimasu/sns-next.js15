import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";


export default function PostForm() {
  async function addPostAction(formData: FormData) {
    "use server";
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        } else if (error instanceof Error) {
          console.error(error instanceof Error);
        } else {
          return {
            error:"予期せぬエラーが起きました。",
            success:false,
          }}
  }}
  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form action={addPostAction} className="flex items-center flex-1">
        <Input
          type="text"
          placeholder="What's on your mind?"
          className="flex-1 rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <Button type="submit" variant="ghost" size="icon">
          <SendIcon className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Tweet</span>
        </Button>
      </form>
    </div>
  );
}
