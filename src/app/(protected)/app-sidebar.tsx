"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarMenu,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Bot, CreditCard, LayoutDashboard, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Q&A", url: "/qa", icon: Bot },
  { title: "Billing", url: "/billing", icon: CreditCard },
];

const projects = [
  { name: "Project 1" },
  { name: "Project 2" },
  { name: "Project 3" },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="rounded-t-md bg-[#E7FBB4] text-[#A294F9]">
        <span className="font-bold">👾 GitGist</span>
      </SidebarHeader>

      <SidebarContent className="rounded-b-md bg-[#FF8383] text-[#E7FBB4]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#E7FBB4]">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          {
                            "!bg-[#A1D6CB] !text-white": pathname === item.url,
                          },
                          "list-none",
                        )}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[#E7FBB4]">
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((projects) => {
                return (
                  <SidebarMenuItem key={projects.name}>
                    <SidebarMenuButton asChild>
                      <div>
                        <div
                          className={cn(
                            "flex size-6 items-center justify-center rounded-sm border bg-white text-sm text-primary",
                            {
                              "bg-[#A19AD3] text-white": true,
                              // "bg-primary text-white":
                              //   project.id === project.id,
                            },
                          )}
                        >
                          {projects.name[0]}
                        </div>
                        <span>{projects.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <div className="h-2"></div>
              <SidebarMenuItem>
                <Link href="/create">
                  <Button
                    size="sm"
                    variant={"outline"}
                    className="w-fit bg-[#A19AD3]"
                  >
                    <PlusIcon />
                    Create Project
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
