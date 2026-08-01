import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Calendar, Pill } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data } = await api.get("/prescriptions/my");
        setPrescriptions(data);
      } catch (error) {
        toast.error("Failed to load prescriptions");
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Prescriptions</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Medicines prescribed by your doctors.
      </p>

      <div className="space-y-4">
        {prescriptions.map((presc) => (
          <div key={presc._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-foreground">Dr. {presc.doctor?.user?.name}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(presc.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-2">
              {presc.medicines.map((med, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-muted rounded-lg p-3">
                  <Pill className="w-4 h-4 text-secondary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      {med.name} — {med.dosage}
                    </p>
                    <p className="text-muted-foreground">
                      {med.frequency}, {med.duration}
                    </p>
                    {med.instructions && (
                      <p className="text-muted-foreground italic">{med.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {presc.additionalInstructions && (
              <p className="text-sm text-muted-foreground mt-3">
                <span className="font-medium">Note:</span> {presc.additionalInstructions}
              </p>
            )}
          </div>
        ))}
        {prescriptions.length === 0 && (
          <p className="text-muted-foreground text-sm">No prescriptions yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Prescriptions;