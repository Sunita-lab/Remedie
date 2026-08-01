import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Pill, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // { type: 'record' | 'prescription', appointment }

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/doctor");
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const statusColor = {
    pending: "bg-warning/10 text-warning",
    confirmed: "bg-primary/10 text-primary",
    completed: "bg-accent/10 text-accent",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Manage your patient appointments.
      </p>

      <div className="space-y-3">
        {appointments.map((appt) => (
          <div key={appt._id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{appt.patient?.user?.name}</p>
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
                {appt.reason && (
                  <p className="text-sm text-muted-foreground mt-1">Reason: {appt.reason}</p>
                )}
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[appt.status]}`}>
                {appt.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {appt.status === "pending" && (
                <Button size="sm" onClick={() => handleStatusUpdate(appt._id, "confirmed")}>
                  Confirm
                </Button>
              )}
              {appt.status === "confirmed" && (
                <Button size="sm" onClick={() => handleStatusUpdate(appt._id, "completed")}>
                  Mark Completed
                </Button>
              )}
              {appt.status === "completed" && (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setActiveModal({ type: "record", appointment: appt })}
                  >
                    <FileText className="w-4 h-4 mr-1" /> Add Record
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setActiveModal({ type: "prescription", appointment: appt })}
                  >
                    <Pill className="w-4 h-4 mr-1" /> Add Prescription
                  </Button>
                </>
              )}
              {(appt.status === "pending" || appt.status === "confirmed") && (
                <button
                  onClick={() => handleStatusUpdate(appt._id, "cancelled")}
                  className="text-destructive text-sm hover:underline ml-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-muted-foreground text-sm">No appointments yet.</p>
        )}
      </div>

      {activeModal?.type === "record" && (
        <RecordModal appointment={activeModal.appointment} onClose={() => setActiveModal(null)} />
      )}
      {activeModal?.type === "prescription" && (
        <PrescriptionModal appointment={activeModal.appointment} onClose={() => setActiveModal(null)} />
      )}
    </DashboardLayout>
  );
};

// ---------- Medical Record Modal ----------
const RecordModal = ({ appointment, onClose }) => {
  const [form, setForm] = useState({ symptoms: "", diagnosis: "", notes: "", followUpDate: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("patientId", appointment.patient._id);
      formData.append("appointmentId", appointment._id);
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      files.forEach((file) => formData.append("testReports", file));

      await api.post("/medical-records", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Medical record added");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Add Medical Record</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Symptoms"
            value={form.symptoms}
            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          />
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            required
          />
          <textarea
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <input
            type="date"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            value={form.followUpDate}
            onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
          />
          <input
            type="file"
            multiple
            className="w-full text-sm"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Record"}
          </Button>
        </form>
      </div>
    </div>
  );
};

// ---------- Prescription Modal ----------
const PrescriptionModal = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/prescriptions", {
        patientId: appointment.patient._id,
        appointmentId: appointment._id,
        medicines,
        additionalInstructions,
      });
      toast.success("Prescription added");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Add Prescription</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {medicines.map((med, index) => (
            <div key={index} className="border border-border rounded-lg p-3 space-y-2 relative">
              {medicines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="absolute top-2 right-2 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Medicine name"
                value={med.name}
                onChange={(e) => updateMedicine(index, "name", e.target.value)}
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                  required
                />
                <input
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                  required
                />
                <input
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                  required
                />
              </div>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Instructions (optional)"
                value={med.instructions}
                onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicine}
            className="flex items-center gap-1 text-primary text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add another medicine
          </button>

          <textarea
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Additional instructions"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Prescription"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DoctorAppointments;