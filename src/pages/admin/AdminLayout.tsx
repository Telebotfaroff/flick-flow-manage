import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useState } from "react";

export default function AdminLayout() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Faroff" && password === "Faroff123@") {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <form onSubmit={handleSubmit} className="p-8 space-y-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-white">Admin Access</h2>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <p className="text-sm text-red-500">Invalid username or password</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white rounded-lg bg-primary hover:bg-primary/90"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen md:grid md:grid-cols-[280px_1fr] w-full bg-gray-900 text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 flex items-center px-4 gap-4 md:hidden">
            <SidebarTrigger />
            <h1 className="text-lg sm:text-xl font-bold">
              Admin Dashboard
            </h1>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
