"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon } from "./Icons";
import { useRef, useState } from "react";
import { addPostAction } from "@/lib/actions";
import SubmitButton from "./SubmitButton";
import { useFormState } from "react-dom";
import { from } from "svix/dist/openapi/rxjsStub";
import { useUser } from "@clerk/nextjs";




export default function PostForm() {
  const { user } = useUser();

  const initialState = {
    error: undefined,
    success: false,
  };
const formRef = useRef<HTMLFormElement>(null);


const [state, formAction] = useFormState(addPostAction, initialState);


if (state.success && formRef.current) {
  formRef.current.reset();
}

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <form
        ref={formRef}
        action={formAction}
        className="flex items-center flex-1"
      >
        <Input
          type="text"
          placeholder="何を投稿する？"
          className="flex-1 rounded-full bg-muted px-4 py-2"
          name="post"
        />
        <SubmitButton />
      </form>
      {state?.error && <p className="text-red-500 mt-1 ml014">{state.error}</p>}
    </div>
  );
}
