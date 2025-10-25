"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  BellPlus,
  ClipboardClock,
} from "lucide-react";
import useSidebar from "@/hooks/useSidebar";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Create Subscription",
    href: "/dashboard/create-subscription",
    icon: <BellPlus size={20} />,
  },
  {
    name: "Subscriptions",
    href: "/dashboard/all-subscriptions",
    icon: <ClipboardClock size={20} />,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`
          bg-zinc-900 text-white
          transition-all duration-300
          ${
            isOpen
              ? "fixed inset-y-0 left-0 w-64 z-40"
              : "hidden md:block md:w-64"
          }
        `}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">SubsTracker</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-2 rounded-md hover:bg-neutral-600 transition-colors ${
                  activeSidebar === item.href &&
                  "scale-[.98] bg-[#0f3158] fill-blue-200 hover:!bg-[#0f3158d6]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}

            <hr className="my-3 border-neutral-600" />

            <span
              className="flex cursor-pointer items-center space-x-3 p-2 rounded-md hover:bg-neutral-600 transition-colors"
              onClick={() => setIsOpen(false)} // close sidebar on mobile click
            >
              <LogOut size={20} />
              <span>LogOut</span>
            </span>
          </nav>
        </div>
      </aside>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between border-b border-neutral-700 p-6 bg-neutral-800 text-white">
          <button onClick={toggleSidebar} className="cursor-pointer">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold">SubsTracker</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto md:p-10 p-4 bg-neutral-800 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
