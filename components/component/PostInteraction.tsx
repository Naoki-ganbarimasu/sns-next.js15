"use client";
import { startTransition } from "react";
import { likeAction } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { useOptimistic } from "react";
import { Button } from "../ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";

interface LikeState {
  likeCount: number;
  isLiked: boolean;
}

type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
};

const PostInteraction = ({
  postId,
  initialLikes,
  commentNumber
}: PostInteractionProps) => {
  const { user } = useUser();
  const userId = user?.id;

  const initialState: LikeState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false
  };

  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(
    initialState,
    (currentState) => ({
      likeCount: currentState.isLiked
        ? currentState.likeCount - 1
        : currentState.likeCount + 1,
      isLiked: !currentState.isLiked
    })
  );

  const handleLikeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(() => {
      addOptimisticLike();
    });

    try {
      await likeAction(postId);
    } catch (error) {
      console.error("Error in liking the post:", error);
    }
  };

  return (
    <main className="flex items-center">
      <form onSubmit={handleLikeSubmit}>
        <Button variant="ghost" size="icon" type="submit">
          <HeartIcon
            className={`h-5 w-5 ${
              optimisticLike.isLiked ? "bg-red-500 text-red-500" : "bg-white"
            }`}
          />
        </Button>
      </form>
      <span>{optimisticLike.likeCount}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span>{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </main>
  );
};

export default PostInteraction;