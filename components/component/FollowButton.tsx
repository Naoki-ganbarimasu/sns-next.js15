import { followAction } from "@/lib/actions";
import { Button } from "../ui/button";

interface FollowButtonProps {
  isFollowing: boolean;
  isCurrentUser: boolean;
  userId: string;
}

const FollowButton = ({
  isCurrentUser,
  isFollowing,
  userId
}: FollowButtonProps) => {
  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集";
    }
    if (isFollowing) {
      return "フォロー中";
    }
    return "フォローする";
  };

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "secondary";
    }
    if (isFollowing) {
      return "outline";
    }
    return "default";
  };

  return isCurrentUser ? (
    <Button variant={getButtonVariant()} className="w-full">
      {getButtonContent()}
    </Button>
  ) : (
    <form action={followAction.bind(null, userId)}>
      <div>
        <Button variant={getButtonVariant()} className="w-full">
          {getButtonContent()}
        </Button>
      </div>
    </form>
  );
};

export default FollowButton;
