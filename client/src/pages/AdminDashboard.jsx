import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Users, Stethoscope, Calendar, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";
import api from "@/api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendRes, perfRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/appointments-trend"),
          api.get("/dashboard/doctor-performance"),
        ]);
        setStats(statsRes.data);
        setTrend(trendRes.data.map((t) => ({ date: t._id.slice(5), count: t.count })));
        setPerformance(perfRes.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      }
    };
    fetchData();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Doctors", value: stats.totalDoctors, icon: Stethoscope, color: "text-primary bg-primary/10" },
        { label: "Total Patients", value: stats.totalPatients, icon: Users, color: "text-secondary bg-secondary/10" },
        { label: "Today's Appointments", value: stats.todaysAppointments, icon: Calendar, color: "text-accent bg-accent/10" },
        { label: "Total Revenue", value: `₹${stats.totalRevenue}`, icon: IndianRupee, color: "text-primary bg-primary/10" },
        { label: "Pending Appointments", value: stats.pendingAppointments, icon: Clock, color: "text-warning bg-warning/10" },
        { label: "Available Doctors", value: stats.availableDoctors, icon: CheckCircle2, color: "text-accent bg-accent/10" },
      ]
    : [];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Real-time overview of hospital operations.
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Appointments — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Top Doctors by Consultations</h2>
          <div className="space-y-3">
            {performance.map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{doc.consultations}</span>
              </div>
            ))}
            {performance.length === 0 && (
              <p className="text-sm text-muted-foreground">No completed consultations yet.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;