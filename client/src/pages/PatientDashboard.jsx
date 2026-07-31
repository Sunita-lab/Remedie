import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-foreground">
        Welcome back, {user?.name} 👋
      </h1>
      <p className="text-muted-foreground mt-1">
        Here's an overview of your healthcare journey.
      </p>
    </DashboardLayout>
  );
};

export default PatientDashboard;