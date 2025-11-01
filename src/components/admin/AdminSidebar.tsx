import { Film, Grid3x3, LayoutDashboard, Home, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Movies", url: "/admin/movies", icon: Film },
  { title: "Import from TMDB", url: "/admin/import", icon: Download },
  { title: "Categories", url: "/admin/categories", icon: Grid3x3 },
  { title: "Back to Site", url: "/", icon: Home },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="text-blue-900 border-r border-blue-200">
      <SidebarContent className="bg-blue-100">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900/50">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 transition-all ${collapsed ? 'justify-center' : ''} ` +
                        (isActive
                          ? "bg-blue-200 text-blue-900 font-semibold"
                          : "hover:bg-blue-200/50")
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
