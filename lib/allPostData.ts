import prisma from "./prisma";

//allPostData.ts
export default async function fetchAllPosts() {
    //プロフィールタイムライン
        return await prisma.post.findMany({
            include: {
                author: true,
                likes: {
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
        });
    }

