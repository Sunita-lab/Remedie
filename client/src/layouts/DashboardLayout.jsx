import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  Receipt,
  Users,
  Stethoscope,
  LogOut,
} from "lucide-react";

const menuConfig = {
  patient: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/patient/dashboard" },
    { label: "Appointments", icon: Calendar, path: "/patient/appointments" },
    { label: "Medical Records", icon: FileText, path: "/patient/records" },
    { label: "Prescriptions", icon: Pill, path: "/patient/prescriptions" },
    { label: "Billing", icon: Receipt, path: "/patient/billing" },
  ],
  doctor: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { label: "Appointments", icon: Calendar, path: "/doctor/appointments" },
    { label: "Patients", icon: Users, path: "/doctor/patients" },
  ],
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Doctors", icon: Stethoscope, path: "/admin/doctors" },
    { label: "Patients", icon: Users, path: "/admin/patients" },
    { label: "Appointments", icon: Calendar, path: "/admin/appointments" },
    { label: "Billing", icon: Receipt, path: "/admin/billing" },
  ],
};

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = menuConfig[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="font-[var(--font-logo)] text-xl font-semibold text-primary">
            Remedie
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;