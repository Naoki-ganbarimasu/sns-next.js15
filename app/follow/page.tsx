import FollowMainContent from "@/components/component/FollowMainContent";
import LeftSidebar from "@/components/component/LeftSidebar";
import RightSidebar from "@/components/component/RightSidebar";

export default function Home({ username }: { username: string }) {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[240px_1fr_240px] gap-6 p-6 overflow-hidden">
      <LeftSidebar username={username} />
      <FollowMainContent username={username} />
      <RightSidebar />
    </div>
  );
}
