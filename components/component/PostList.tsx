// components/PostList.tsx
import  fetchPosts from "@/lib/postDataFetcher";
import { auth } from "@clerk/nextjs/server";
import Post from "./Post";

export default async function PostList() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const posts = await fetchPosts(userId);

  return (
    <div className="space-y-4">
      {posts.length ? (
        posts.map((post) => (<Post key={post.id} post={post} />)
        )) : (
          <>
            <p className="text-muted-foreground">ポストが見つかりません。</p>
            </>
       )
      }
    </div>
  );
}
