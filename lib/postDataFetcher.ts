import prisma from "./prisma";

export default async function fetchPosts(userId: string, username: string) {
//プロフィールタイムライン
    if (username) {
        return await prisma.post.findMany({
            where: {
                author: {
                    name: username
                },
            },
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
    


    if (!username && userId) {
      const following = await prisma.follow.findMany({
        where: {
          followerId: userId
        },
        select: {
          followingId: true
        }
      });

      // フォローしているユーザーのIDリストを作成
      const followingIds = following.map((follow) => follow.followingId);

      // フォローしているユーザーの投稿のみを取得
      return await prisma.post.findMany({
        where: {
          authorId: {
            in: followingIds // 自分のIDは含めない
          }
        },
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
          createdAt: "desc" // 投稿を新しい順にソート
        }
      });
    }




//ホームタイムライン
//     if (!username && userId) {
//         const following = await prisma.follow.findMany({
//             where: {
//                 followerId: userId
//             },
//             select: {
//                 followingId: true
//             }
//         });


//         const followingIds = following.map((follow) => follow.followingId);
//         const ids = [userId, ...followingIds];

//         return await prisma.post.findMany({
//             where: {
//                 authorId: {
//                     in: ids,
//                 }
//             },
//             include: {
//                 author: true,
//                 likes: {
//                     select: {
//                         userId: true
//                     }
//                 },
//                 _count: {
//                     select: {
//                         replies: true
//                     }
//                 }
//             },
//             orderBy: {
//                 createdAt: "desc"
//             }
//         });
//     }
}