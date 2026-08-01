import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Calendar, FileText, Download } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await api.get("/medical-records/my");
        setRecords(data);
      } catch (error) {
        toast.error("Failed to load medical records");
      }
    };
    fetchRecords();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">Medical Records</h1>
      <p className="text-muted-foreground mt-1 mb-6">
        Your complete diagnosis and treatment history.
      </p>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record._id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-foreground">Dr. {record.doctor?.user?.name}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
              {record.symptoms && (
                <div>
                  <p className="text-muted-foreground">Symptoms</p>
                  <p className="text-foreground">{record.symptoms}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Diagnosis</p>
                <p className="text-foreground font-medium">{record.diagnosis}</p>
              </div>
            </div>

            {record.notes && (
              <div className="text-sm mb-3">
                <p className="text-muted-foreground">Notes</p>
                <p className="text-foreground">{record.notes}</p>
              </div>
            )}

            {record.followUpDate && (
              <p className="text-sm text-warning mb-3">
                Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
              </p>
            )}

            {record.testReports?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {record.testReports.map((report, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5000${report.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs bg-muted px-3 py-1.5 rounded-lg text-primary hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {report.fileName}
                    <Download className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {records.length === 0 && (
          <p className="text-muted-foreground text-sm">No medical records yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MedicalRecords;