import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Receipt, Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const AdminBilling = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchBills = async () => {
    try {
      const { data } = await api.get("/bills");
      setBills(data);
    } catch (error) {
      toast.error("Failed to load bills");
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients");
      setPatients(data);
    } catch (error) {
      toast.error("Failed to load patients");
    }
  };

  useEffect(() => {
    fetchBills();
    fetchPatients();
  }, []);

  const statusColor = {
    paid: "bg-accent/10 text-accent",
    unpaid: "bg-warning/10 text-warning",
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground mt-1">Generate and track patient invoices.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Create Bill
        </Button>
      </div>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{bill.patient?.user?.name}</p>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(bill.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[bill.paymentStatus]}`}>
                {bill.paymentStatus}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {bill.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.description}</span>
                  <span>₹{item.amount}</span>
                </div>
              ))}
            </div>

            <p className="font-semibold text-foreground flex items-center gap-2 pt-3 border-t border-border">
              <Receipt className="w-4 h-4" />
              Total: ₹{bill.totalAmount}
            </p>
          </div>
        ))}
        {bills.length === 0 && (
          <p className="text-muted-foreground text-sm">No bills generated yet.</p>
        )}
      </div>

      {showModal && (
        <CreateBillModal
          patients={patients}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchBills();
          }}
        />
      )}
    </DashboardLayout>
  );
};

const CreateBillModal = ({ patients, onClose, onSuccess }) => {
  const [patientId, setPatientId] = useState("");
  const [items, setItems] = useState([{ description: "", category: "consultation", amount: "" }]);
  const [loading, setLoading] = useState(false);

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", category: "other", amount: "" }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId) {
      toast.error("Please select a patient");
      return;
    }
    setLoading(true);
    try {
      await api.post("/bills", { patientId, items });
      toast.success("Bill created successfully");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Create Bill</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Patient</label>
            <select
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.user?.name} ({p.user?.email})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Bill Items</label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="Description (e.g. Consultation Fee)"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  required
                />
                <select
                  className="border border-border rounded-lg px-2 py-2 text-sm bg-card"
                  value={item.category}
                  onChange={(e) => updateItem(index, "category", e.target.value)}
                >
                  <option value="consultation">Consultation</option>
                  <option value="medicine">Medicine</option>
                  <option value="test">Test</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="number"
                  className="w-24 border border-border rounded-lg px-3 py-2 text-sm"
                  placeholder="₹"
                  value={item.amount}
                  onChange={(e) => updateItem(index, "amount", e.target.value)}
                  required
                />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-primary text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add item
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <p className="font-semibold text-foreground">Total: ₹{total}</p>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Bill"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBilling;