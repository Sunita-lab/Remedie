import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = async () => {
    try {
      const { data } = await api.get("/bills/my");
      setBills(data);
    } catch (error) {
      toast.error("Failed to load bills");
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePay = async (id) => {
    setPayingId(id);
    try {
      await api.put(`/bills/${id}/pay`, { paymentMethod: "upi" });
      toast.success("Payment successful!");
      fetchBills();
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Billing</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Your invoices and payment history.
      </p>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div key={bill._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(bill.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                  bill.paymentStatus === "paid"
                    ? "bg-accent/10 text-accent"
                    : "bg-warning/10 text-warning"
                }`}
              >
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

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Total: ₹{bill.totalAmount}
              </p>
              {bill.paymentStatus === "unpaid" && (
                <Button size="sm" onClick={() => handlePay(bill._id)} disabled={payingId === bill._id}>
                  {payingId === bill._id ? "Processing..." : "Pay Now"}
                </Button>
              )}
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <p className="text-muted-foreground text-sm">No bills yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Billing;