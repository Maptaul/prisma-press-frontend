import { ISidebarItem } from "@/lib/types";
import { LayoutDashboard, UserRoundIcon } from "lucide-react";
import { ADMIN_SIDEBAR_ITEMS } from "./adminSidebarItem";
import { AUTHOR_SIDEBAR_ITEMS } from "./authorSidebarItems";

const USER_SIDEBAR_ITEMS: ISidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Posts",
    href: "/dashboard/my-posts",
    icon: UserRoundIcon,
  },
];

export const sidebarMenuItems = {
  USER: USER_SIDEBAR_ITEMS,
  AUTHOR: AUTHOR_SIDEBAR_ITEMS,
  ADMIN: ADMIN_SIDEBAR_ITEMS,
};
