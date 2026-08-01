import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Calendar, FileText, Pill, Receipt, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axios";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [apptRes, recRes, prescRes, billRes] = await Promise.all([
          api.get("/appointments/my"),
          api.get("/medical-records/my"),
          api.get("/prescriptions/my"),
          api.get("/bills/my"),
        ]);
        setAppointments(apptRes.data);
        setRecords(recRes.data);
        setPrescriptions(prescRes.data);
        setBills(billRes.data);
      } catch (error) {
        toast.error("Failed to load dashboard");
      }
    };
    fetchAll();
  }, []);

  const upcoming = appointments
    .filter((a) => ["pending", "confirmed"].includes(a.status))
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const unpaidBills = bills.filter((b) => b.paymentStatus === "unpaid");

  const summary = [
    { label: "Upcoming Appointments", value: upcoming.length, icon: Calendar, color: "text-primary bg-primary/10", link: "/patient/appointments" },
    { label: "Medical Records", value: records.length, icon: FileText, color: "text-secondary bg-secondary/10", link: "/patient/records" },
    { label: "Active Prescriptions", value: prescriptions.length, icon: Pill, color: "text-accent bg-accent/10", link: "/patient/prescriptions" },
    { label: "Unpaid Bills", value: unpaidBills.length, icon: Receipt, color: "text-warning bg-warning/10", link: "/patient/billing" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name} 👋</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Here's an overview of your healthcare journey.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {summary.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-semibold text-foreground mb-4">Upcoming Appointments</h2>
        <div className="space-y-3">
          {upcoming.slice(0, 4).map((appt) => (
            <div key={appt._id} className="flex items-center justify-between border-b border-border last:border-0 pb-3 last:pb-0">
              <div>
                <p className="text-sm font-medium text-foreground">Dr. {appt.doctor?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{appt.doctor?.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" /> {new Date(appt.appointmentDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                  <Clock className="w-3 h-3" /> {appt.appointmentTime}
                </p>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;