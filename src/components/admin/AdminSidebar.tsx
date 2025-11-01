import { Film, Grid3x3, LayoutDashboard, Home, Download, PlusSquare } from "lucide-react";
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
  { title: "Add Movie", url: "/admin/add-movie", icon: PlusSquare },
  { title: "Import from TMDB", url: "/admin/import", icon: Download },
  { title: "Categories", url: "/admin/categories", icon: Grid3x3 },
  { title: "Back to Site", url: "/", icon: Home },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 text-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-xl font-bold p-3">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 transition-all text-2xl border border-gray-700 bg-gray-900/50 ${collapsed ? 'justify-center' : ''} ` +
                        (isActive
                          ? "bg-primary/20 text-white font-semibold"
                          : "text-white hover:bg-primary/10")
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
