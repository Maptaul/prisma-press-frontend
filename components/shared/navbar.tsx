"use client";

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { logout } from "@/service/logout";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

// Nav links kept in an array for easy maintenance
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Premium", href: "/premium" },
];

// User dropdown options kept in an array as well
const userMenuItems = [
  {
    label: "Dashboard",
    action: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Profile", action: "profile", href: "/profile", icon: User },
  { label: "Billing", action: "billing", href: "/billing", icon: CreditCard },
  {
    label: "Settings",
    action: "settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const router = useRouter();

  const getDashboardPath = () => {
    if (user.data?.profile?.role === "AUTHOR") {
      return "/author-dashboard";
    }

    if (user.data?.profile?.role === "ADMIN") {
      return "/admin-dashboard";
    }

    return "/dashboard";
  };

  const handleUserMenuAction = async (action: string) => {
    if (action === "dashboard") {
      router.push(getDashboardPath());
      return;
    }
    if (action === "logout") {
      await logout();
      toast.success("You have been logged out successfully.");
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            NextjsPress
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* User dropdown */}
          {user.success ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {user.data?.profile?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium leading-none">
                      {user.data?.profile?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.data?.profile?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isDashboardAction = item.action === "dashboard";

                    return (
                      <DropdownMenuItem
                        key={item.action}
                        asChild={!isDashboardAction}
                      >
                        {isDashboardAction ? (
                          <button
                            type="button"
                            onClick={() => handleUserMenuAction(item.action)}
                            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none"
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                          </button>
                        ) : (
                          <Link href={item.href} className="cursor-pointer">
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    handleUserMenuAction("logout");
                  }}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer" variant="default" size="sm">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 md:hidden">
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="cursor-pointer">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
