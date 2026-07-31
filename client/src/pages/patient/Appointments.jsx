import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Calendar, Clock, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (specialization = "") => {
    try {
      const { data } = await api.get(`/doctors${specialization ? `?specialization=${specialization}` : ""}`);
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to load doctors");
    }
  };

  const fetchMyAppointments = async () => {
    try {
      const { data } = await api.get("/appointments/my");
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(search);
  };

  const openBookingModal = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData({ appointmentDate: "", appointmentTime: "", reason: "" });
  };

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/appointments", {
        doctorId: selectedDoctor._id,
        ...bookingData,
      });
      toast.success("Appointment booked successfully!");
      setSelectedDoctor(null);
      fetchMyAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      fetchMyAppointments();
    } catch (error) {
      toast.error("Failed to cancel");
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
      <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Search for doctors and book your appointment.
      </p>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-foreground">{doc.user?.name}</h3>
            <p className="text-sm text-primary">{doc.specialization}</p>
            <p className="text-sm text-muted-foreground">{doc.qualification}</p>
            <p className="text-sm text-muted-foreground">₹{doc.consultationFee} consultation fee</p>
            <Button size="sm" className="w-full mt-2" onClick={() => openBookingModal(doc)}>
              Book Appointment
            </Button>
          </div>
        ))}
        {doctors.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full">No doctors found.</p>
        )}
      </div>

      {/* My Appointments List */}
      <h2 className="text-xl font-semibold text-foreground mb-4">My Appointments</h2>
      <div className="space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt._id}
            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-foreground">Dr. {appt.doctor?.user?.name}</p>
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
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColor[appt.status]}`}>
                {appt.status}
              </span>
              {(appt.status === "pending" || appt.status === "confirmed") && (
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="text-destructive text-sm hover:underline"
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

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Book with Dr. {selectedDoctor.user?.name}
              </h3>
              <button onClick={() => setSelectedDoctor(null)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Date</Label>
                <Input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="date"
                  value={bookingData.appointmentDate}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time</Label>
                <Input
                  id="appointmentTime"
                  name="appointmentTime"
                  type="time"
                  value={bookingData.appointmentTime}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason (optional)</Label>
                <Input
                  id="reason"
                  name="reason"
                  placeholder="e.g. Regular checkup"
                  value={bookingData.reason}
                  onChange={handleBookingChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Appointments;