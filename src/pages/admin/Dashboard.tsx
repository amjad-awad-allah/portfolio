
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Award,
  User,
  LogOut,
  Settings,
  Globe,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const adminModules = [
    { name: "Projects", icon: FolderKanban, color: "text-blue-500", count: "15+", path: "/admin/projects" },
    { name: "Experience", icon: Briefcase, color: "text-green-500", count: "4+", path: "/admin/experience" },
    { name: "Certifications", icon: Award, color: "text-purple-500", count: "10+", path: "/admin/certifications" },
    { name: "Personal Info", icon: User, color: "text-orange-500", count: "Updated", path: "/admin/info" },
    { name: "Analytics", icon: Users, color: "text-red-500", count: "Live", path: "/admin/analytics" },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 dark:bg-gray-950 flex flex-col">
      {/* Sidebar / Header */}
      <header className="bg-background border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-bold text-lg hidden sm:block">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2">
              <Globe className="h-4 w-4" />
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive hover:bg-destructive/10">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Manage your portfolio content and track your professional presence.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminModules.map((module, index) => (
            <motion.div
              key={module.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all cursor-pointer group border border-primary/5"
              onClick={() => navigate(module.path)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-background shadow-sm group-hover:scale-110 transition-transform`}>
                  <module.icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <span className="text-2xl font-bold">{module.count}</span>
              </div>
              <h3 className="font-semibold text-lg">{module.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 group-hover:text-primary transition-colors">
                <Settings className="h-3 w-3" />
                Manage {module.name.toLowerCase()}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="glass-card p-6 rounded-2xl border border-primary/5">
            <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-16 justify-start gap-4 p-4 border-dashed" onClick={() => navigate("/admin/projects?add=true")}>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                Add New Project
              </Button>
              <Button variant="outline" className="h-16 justify-start gap-4 p-4 border-dashed" onClick={() => navigate("/admin/certifications?add=true")}>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                Add Certification
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-primary/5 flex flex-col items-center justify-center text-center opacity-50">
            <div className="bg-secondary p-4 rounded-full mb-4">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">Detailed logs will appear here as you make changes.</p>
          </div>
        </div>

        {/* Version Footer */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 opacity-50">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-xs font-medium">Amjad Portfolio CMS &bull; All rights reserved</p>
            <p className="text-[10px] font-mono">Last Build: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">Pro Edition</span>
            <span className="text-xs font-mono">v1.4.4</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
