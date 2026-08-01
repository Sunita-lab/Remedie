import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Users, Clock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments/doctor");
        setAppointments(data);
      } catch (error) {
        toast.error("Failed to load dashboard");
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (a) => new Date(a.appointmentDate).toDateString() === today
  );
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const uniquePatients = new Set(appointments.map((a) => a.patient?._id)).size;

  const summary = [
    { label: "Today's Appointments", value: todaysAppointments.length, icon: Calendar, color: "text-primary bg-primary/10" },
    { label: "Pending Confirmations", value: pendingCount, icon: Clock, color: "text-warning bg-warning/10" },
    { label: "Completed Consultations", value: completedCount, icon: CheckCircle2, color: "text-accent bg-accent/10" },
    { label: "Total Patients Seen", value: uniquePatients, icon: Users, color: "text-secondary bg-secondary/10" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Welcome, Dr. {user?.name} 👨‍⚕️</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Here's your schedule overview.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summary.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {todaysAppointments.map((appt) => (
            <div key={appt._id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">{appt.patient?.user?.name}</p>
                {appt.reason && <p className="text-xs text-muted-foreground">{appt.reason}</p>}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {appt.appointmentTime}
              </p>
            </div>
          ))}
          {todaysAppointments.length === 0 && (
            <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;