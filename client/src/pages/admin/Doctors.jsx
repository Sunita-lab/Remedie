import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, X, Pencil, Trash2, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors");
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      toast.success("Doctor removed");
      fetchDoctors();
    } catch (error) {
      toast.error("Failed to remove doctor");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
          <p className="text-muted-foreground mt-1">Manage doctor profiles and availability.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  doc.isAvailable ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                }`}
              >
                {doc.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{doc.user?.name}</h3>
            <p className="text-sm text-primary">{doc.specialization}</p>
            <p className="text-sm text-muted-foreground">{doc.qualification}</p>
            <p className="text-sm text-muted-foreground">{doc.experience} yrs experience</p>
            <p className="text-sm text-muted-foreground">₹{doc.consultationFee} fee</p>

            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" variant="secondary" onClick={() => setEditingDoctor(doc)}>
                <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(doc._id)}>
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
              </Button>
            </div>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full">No doctors added yet.</p>
        )}
      </div>

      {showAddModal && (
        <DoctorFormModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchDoctors();
          }}
        />
      )}

      {editingDoctor && (
        <DoctorFormModal
          doctor={editingDoctor}
          onClose={() => setEditingDoctor(null)}
          onSuccess={() => {
            setEditingDoctor(null);
            fetchDoctors();
          }}
        />
      )}
    </DashboardLayout>
  );
};

const DoctorFormModal = ({ doctor, onClose, onSuccess }) => {
  const isEdit = Boolean(doctor);
  const [form, setForm] = useState({
    fullName: doctor?.user?.name || "",
    email: doctor?.user?.email || "",
    password: "",
    phone: doctor?.user?.phone || "",
    specialization: doctor?.specialization || "",
    qualification: doctor?.qualification || "",
    experience: doctor?.experience || "",
    consultationFee: doctor?.consultationFee || "",
    availableDays: doctor?.availableDays?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        experience: Number(form.experience),
        consultationFee: Number(form.consultationFee),
        availableDays: form.availableDays.split(",").map((d) => d.trim()).filter(Boolean),
      };

      if (isEdit) {
        await api.put(`/doctors/${doctor._id}`, payload);
        toast.success("Doctor updated");
      } else {
        await api.post("/doctors", payload);
        toast.success("Doctor added");
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isEdit && (
            <>
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </>
          )}
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="Experience (yrs)"
              name="experience"
              type="number"
              value={form.experience}
              onChange={handleChange}
              required
            />
            <input
              className="border border-border rounded-lg px-3 py-2 text-sm"
              placeholder="Fee (₹)"
              name="consultationFee"
              type="number"
              value={form.consultationFee}
              onChange={handleChange}
              required
            />
          </div>
          <input
            className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            placeholder="Available Days (e.g. Monday, Wednesday)"
            name="availableDays"
            value={form.availableDays}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Doctor" : "Add Doctor"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminDoctors;