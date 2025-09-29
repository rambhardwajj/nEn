import { Home, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  
];

export function AppSidebar() {
  const { state } = useSidebar();

  const handleProfile = async () =>{
    
  }

  return (
    <Sidebar  variant="floating" collapsible="icon">
      <SidebarHeader className="hover:bg-[#f7f1e6]">
        <div className="flex justify-between ">
          <SidebarGroupLabel className="text-xl font-bold text-black ">nEn</SidebarGroupLabel>
          <SidebarTrigger className="ml-[-50px]" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url}>
                      {({ isActive }) => (
                        <>
                          <item.icon className={isActive ? "text-teal-500" : undefined} />
                          <span className={` ${isActive ? "text-teal-500" : ""}`}>{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="absolute bottom-3">
          <div className="flex justify-center  gap-22 items-center">
            {state === "expanded" && (
              <Button variant={"outline"} onClick={handleProfile} className="bg-teal-500 dark:bg-teal-500 text-white">
                <User />
                Profile
              </Button>
            )}
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}