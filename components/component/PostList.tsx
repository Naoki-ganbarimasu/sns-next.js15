// components/PostList.tsx
import fetchPosts from "@/lib/postDataFetcher";
import { auth } from "@clerk/nextjs/server";
import Post from "./Post";

export default async function PostList({ username }: { username?: string }) {
  const { userId } = auth();
  console.log(username);

  if (!userId) {
    return;
  }

  const posts = await fetchPosts(userId, username);

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
