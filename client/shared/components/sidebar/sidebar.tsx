"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";
import { BellPlus, CalendarPlus, LogOut } from "lucide-react";
import useSidebar from "@/hooks/useSidebar";
import Home from "@/assets/icons/home";

const SidebarBarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<Home fill={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          <div className="mt-2 block">
            <SidebarMenu title="Subscriptions">
              <SidebarItem
                title="Create Subscription"
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor("/dashboard/create-subscription")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-subscription"}
                href="/dashboard/create-subscription"
              />

              <SidebarItem
                title="All Subscriptions"
                icon={
                  <BellPlus
                    size={24}
                    color={getIconColor("/dashboard/all-subscriptions")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-subscriptions"}
                href="/dashboard/all-subscriptions"
              />
            </SidebarMenu>
          </div>

          <SidebarMenu title="Account">
            <SidebarItem
              title="Logout"
              icon={
                <LogOut
                  size={24}
                  color={getIconColor("/dashboard/create-product")}
                />
              }
              isActive={activeSidebar === "/logout"}
              href="/"
            />
          </SidebarMenu>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarBarWrapper;
