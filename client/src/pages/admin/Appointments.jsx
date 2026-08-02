import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments");
        setAppointments(data);
      } catch (error) {
        toast.error("Failed to load appointments");
      }
    };
    fetchAppointments();
  }, []);

  const statusColor = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-primary/10 text-primary",
    completed: "bg-accent/10 text-accent",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">All Appointments</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Overview of all appointments across the hospital.
      </p>

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div key={appt._id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-medium text-foreground">{appt.patient?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  with Dr. {appt.doctor?.user?.name}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {appt.appointmentTime}
                  </span>
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[appt.status]}`}>
                {appt.status}
              </span>
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-muted-foreground text-sm">No appointments yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAppointments;