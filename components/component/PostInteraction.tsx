import { Button } from "../ui/button";
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons";

type PostInteractionProps = {
    postId: string;
    initialLikes: string[];
    commentNumber: number;
    };

const PostInteraction = ({postId, initialLikes, commentNumber}: PostInteractionProps) => {
  return (
    <main className="flex items-center">
      <Button variant="ghost" size="icon">
        <HeartIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span>{initialLikes.length}</span>
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
