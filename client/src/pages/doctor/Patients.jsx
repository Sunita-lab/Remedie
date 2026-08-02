import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { User, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get("/appointments/doctor");

        // Extract unique patients from appointments
        const uniquePatientsMap = new Map();
        data.forEach((appt) => {
          if (appt.patient?._id && !uniquePatientsMap.has(appt.patient._id)) {
            uniquePatientsMap.set(appt.patient._id, appt.patient);
          }
        });
        setPatients(Array.from(uniquePatientsMap.values()));
      } catch (error) {
        toast.error("Failed to load patients");
      }
    };
    fetchPatients();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">My Patients</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Patients you have consulted with.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <div key={patient._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-foreground">{patient.user?.name}</p>
                {patient.gender && (
                  <p className="text-xs text-muted-foreground capitalize">{patient.gender}</p>
                )}
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {patient.user?.email}
              </p>
              {patient.user?.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {patient.user.phone}
                </p>
              )}
              {patient.bloodGroup && (
                <p className="mt-2">
                  <span className="font-medium text-foreground">Blood Group:</span> {patient.bloodGroup}
                </p>
              )}
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full">
            No patients yet. They'll appear here once you have appointments.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatients;