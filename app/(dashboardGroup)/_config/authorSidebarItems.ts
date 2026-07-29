import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, UserRoundIcon } from "lucide-react";

export const AUTHOR_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Author Dashboard",
    href: "/author-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Posts",
    href: "/author-dashboard/my-posts",
    icon: UserRoundIcon,
  },
];
