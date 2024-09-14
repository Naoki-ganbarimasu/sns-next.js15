import FollowMainContent from "@/components/component/FollowMainContent";
import LeftSidebar from "@/components/component/LeftSidebar";
import RightSidebar from "@/components/component/RightSidebar";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
    const { userId } = auth();
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[240px_1fr_240px] gap-6 p-6 overflow-hidden">
      <LeftSidebar />
      <FollowMainContent />
      <RightSidebar />
    </div>
  );
}
