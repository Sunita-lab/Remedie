import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Search, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data);
    } catch (error) {
      toast.error("Failed to load patients");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient removed");
      fetchPatients();
    } catch (error) {
      toast.error("Failed to remove patient");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Patients</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        View and manage registered patients.
      </p>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full border border-border rounded-lg pl-9 pr-3 py-2 text-sm bg-card"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Phone</th>
              <th className="text-left px-4 py-3 font-medium">Blood Group</th>
              <th className="text-left px-4 py-3 font-medium">Gender</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p._id} className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{p.user?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.user?.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.user?.phone || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.bloodGroup || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{p.gender || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-destructive hover:underline text-sm inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <p className="text-muted-foreground text-sm p-4">No patients found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPatients;