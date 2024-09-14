"use client";
// components/LeftSidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BookmarkIcon,
  CompassIcon,
  FollowIcon,
  HeartIcon,
  HomeIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon
} from "./Icons";

export default function LeftSidebar({ username }: { username: string }) {
  const { user } = useUser();
  if (!user) {
    return;
  }
  console.log(user);

  const navItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: FollowIcon, label: "Follow", href: "/follow" },
    { icon: CompassIcon, label: "Explore", href: "/explore" },
    { icon: BookmarkIcon, label: "Bookmarks", href: "/bookmarks" },
    { icon: UserIcon, label: "Profile", href: `/profile/${user.username}` },
    { icon: MessageCircleIcon, label: "Messages", href: "/messages" },
    { icon: HeartIcon, label: "Likes", href: "/likes" }
  ];
  return (
    <main className="hidden md:block bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <Link href={`/profile/${user.username}`}>
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={user.imageUrl || "/placeholder-user.jpg"}
              alt="Acme Inc Profile"
            />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{user.username}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
        </div>
      </Link>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link href={href} className="block">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-muted dark:hover:bg-gray-700 transition-colors">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/settings" className="block">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
