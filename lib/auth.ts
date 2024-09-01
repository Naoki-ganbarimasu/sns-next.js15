// /lib/auth.ts (サーバーサイド専用ファイル)
import { auth } from "@clerk/nextjs/server";

export const getUser = () => {
  const { userId } = auth();
  return userId;
};
