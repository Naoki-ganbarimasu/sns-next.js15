"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import prisma from "./prisma";

type PostActionState = {
  error?: string | undefined;
  success: boolean;
};

const postTextSchema = z
  .string()
  .min(1, "1文字以上で投稿してください")
  .max(140, "140字以内で投稿してください");

export async function addPostAction(
  prevState: PostActionState,
  formData: FormData
): Promise<PostActionState> {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "ログインしてください", success: false };
    }

    const postText = formData.get("post") as string;
    const validatedPostText = postTextSchema.parse(postText);

    // Simulate delay (probably for user experience purposes)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    await prisma.post.create({
      data: {
        content: validatedPostText,
        authorId: userId
      }
    });

    revalidatePath("/");
    revalidateTag("post");

    return {
      error: undefined,
      success: true
    };
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(", "),
        success: false
      };
    }
    return {
      error:
        error instanceof Error ? error.message : "予期せぬエラーが起きました。",
      success: false
    };
  }
}

export async function likeAction(postId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("ログインしてください");
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId
        }
      });
    }

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    throw new Error("サーバーエラーが発生しました。再試行してください。");
  }
}

export const followAction = async (userId: string) => {
  const { userId: currentUserId } = auth();
  if (!currentUserId) {
    throw new Error("ログインしてください");
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId
      }
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: userId
          }
        }
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId
        }
      });
    }

    revalidatePath(`profile/${userId}`);
  } catch (error) {
    console.error(error);
    throw new Error("サーバーエラーが発生しました。再試行してください。");
  }
};

// "use server";
// import { auth } from "@clerk/nextjs/server";
// import { revalidatePath, revalidateTag } from "next/cache";
// import { z } from "zod";
// import prisma from "./prisma";

// type State = {
//   error?: string | undefined;
//   success: boolean;
// };

// export async function addPostAction(
//   prevState: State,
//   formData: FormData
// ): Promise<State> {
//   try {
//     const { userId } = auth();
//     const postText = formData.get("post") as string;
//     const postTextSchema = z
//       .string()
//       .min(1, "1文字以上で投稿してください")
//       .max(140, "140字以内で投稿してください");

//     if (!userId) {
//       return { error: "ログインしてください", success: false };
//     }
//     const validatedPostText = postTextSchema.parse(postText);

//     await new Promise((resolve) => setTimeout(resolve, 3000));

//     await prisma.post.create({
//       data: {
//         content: validatedPostText,
//         authorId: userId
//       }
//     });

//     revalidatePath("/");
//     revalidateTag("post");

//     return {
//       error: undefined,
//       success: true
//     };
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return {
//         error: error.errors.map((error) => error.message).join(", "),
//         success: false
//       };
//     } else if (error instanceof Error) {
//       console.error(error.message);
//       return {
//         error: error.message,
//         success: false
//       };
//     } else {
//       return {
//         error: "予期せぬエラーが起きました。",
//         success: false
//       };
//     }
//   }
// }

// export async function likeAction(postId: string) {
//   const { userId } = auth();
//   if (!userId) {
//     throw new Error("ログインしてください");
//   }

//   try {
//     const existingLike = await prisma.like.findFirst({
//       where: {
//         postId,
//         userId
//       }
//     });

//     console.log(existingLike);
//     if (existingLike) {
//       await prisma.like.delete({
//         where: {
//           id: existingLike.id
//         }
//       });

//       revalidatePath("/");
//     } else {
//       await prisma.like.create({
//         data: {
//           postId,
//           userId
//         }
//       });
//     }
//     revalidatePath("/");
//   } catch (error) {
//     console.error(error);
//     throw new Error("サーバーエラーが発生しました。再試行してください。");
//   }
// }

// export const followAction = async (userId: string) => {
//   const { userId: currentUserId } = auth();
//   if (!currentUserId) {
//     throw new Error("ログインしてください");
//   }

//   try {
//     const existingFollow = await prisma.follow.findFirst({
//       where: {
//           followerId: currentUserId,
//           followingId: userId,
//       }
//     });

//     if (existingFollow) {
//       await prisma.follow.delete({
//         where: {
//           followerId_followingId: {
//             followerId: currentUserId,
//             followingId: userId
//           }
//         }
//       });
//     } else {
//       await prisma.follow.create({
//         data: {
//           followerId: currentUserId,
//           followingId: userId,
//         }
//       });
//     }

//     revalidatePath(`profile/${userId}`);
//   } catch (error) {
//     console.error(error);
//     throw new Error("サーバーエラーが発生しました。再試行してください。");
//   }
// };
