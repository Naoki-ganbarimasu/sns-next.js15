"use client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FollowIcon, HomeIcon, UserIcon } from "./Icons";

export const TabBar = () => {
  const { user } = useUser();
  if (!user) {
    return;
  }
  const navItems = [
    { icon: HomeIcon, label: "Home", href: "/" },
    { icon: FollowIcon, label: "Follow", href: "/follow" },
    { icon: UserIcon, label: "Profile", href: `/profile/${user.username}` }
  ];

  return (
    <div className="flex justify-center space-x-4 border-t-4">
      <ul className="py-3 flex">
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
    </div>
  );
};
