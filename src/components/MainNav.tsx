"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ThemeSwitcher";
import {
  LogOut,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  User,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/profile", label: "Profile", icon: User },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 pl-5 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-xl font-bold"
            >
              <FolderKanban className="h-6 w-6" />
              <span>ProjectApp</span>
            </Link>
            <div className="hidden space-x-1 md:flex">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="flex items-center space-x-2 hover:bg-accent"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
