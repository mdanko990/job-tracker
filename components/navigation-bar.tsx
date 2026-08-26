"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { SignOutButton } from "./auth-buttons";

interface NavigationBarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function NavigationBar({ user }: NavigationBarProps) {
  const pathname = usePathname();
  const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Applications", href: "/applications" },
  ];

  return (
    <nav className="self-end">
      <NavigationMenu>
        <NavigationMenuList>
          <>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;

              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    active={isActive}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      // 1. Reset all background states to transparent
                      "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                      // 2. Hover state: solid underline
                      "hover:underline hover:decoration-solid hover:text-primary hover:bg-transparent",
                      // 3. Active state: dashed underline
                      isActive &&
                        "underline decoration-dashed font-medium text-primary hover:bg-unset",
                    )}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user?.image ?? undefined}
                    alt={user?.name ?? "User avatar"}
                  />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px]">
                  <li>
                    <NavigationMenuLink>
                      <SignOutButton />
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
