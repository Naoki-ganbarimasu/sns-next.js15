// /lib/auth.ts (サーバーサイド専用ファイル)
import { auth } from "@clerk/nextjs/server";

export const getProfile = () => {
  const { userId } = auth();
  return userId;
};
