"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart,
  Settings,
  University,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StaffRole } from "@/types";

interface SidebarProps {
  userRole?: StaffRole;
}

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", roles: ["admin", "reviewer", "data_entry"] },
  { href: "/admin/applications", icon: FileText, label: "Applications", roles: ["admin", "reviewer", "data_entry"] },
  { href: "/admin/staff", icon: Users, label: "Staff", roles: ["admin"] },
  { href: "/admin/reports", icon: BarChart, label: "Reports", roles: ["admin"] },
  { href: "/admin/settings", icon: Settings, label: "Settings", roles: ["admin"] },
];

export default function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-card p-4 text-card-foreground md:flex">
      <div className="flex items-center gap-2 px-2 py-4">
        <University className="h-8 w-8 text-accent" />
        <h1 className="text-2xl font-bold font-headline text-primary">AdmitPro</h1>
      </div>
      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) =>
          item.roles.includes(userRole || 'data_entry') ? (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
                {
                  "bg-secondary text-primary font-semibold": pathname === item.href,
                }
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ) : null
        )}
      </nav>
    </aside>
  );
}
