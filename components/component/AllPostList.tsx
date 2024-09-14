// components/PostList.tsx
import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import fetchAllPosts from "@/lib/allPostData";

export default async function AllPostList() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const posts = await fetchAllPosts();

  if (!posts || posts.length === 0) {
    return <p className="text-muted-foreground">ポストが見つかりません。</p>;
  }

  return (
    <div className="space-y-4">
      {posts.length ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <>
          <p className="text-muted-foreground">ポストが見つかりません。</p>
        </>
      )}
    </div>
  );
}
