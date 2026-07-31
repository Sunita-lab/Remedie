import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Stethoscope, User, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data);
      toast.success("Welcome back!");

      if (data.role === "admin") navigate("/admin/dashboard");
      else if (data.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { key: "patient", label: "Patient", icon: User },
    { key: "doctor", label: "Doctor", icon: Stethoscope },
    { key: "admin", label: "Administrator", icon: Building2 },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Illustration placeholder */}
      <div className="hidden lg:flex lg:w-2/5 bg-primary/5 flex-col justify-between p-10">
        <div>
          <h2 className="font-[var(--font-logo)] text-2xl font-semibold text-primary">
            Remedie
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Every Patient. Every Journey. Connected.
          </p>
        </div>

        <div className="flex items-center justify-center flex-1">
          <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
            <Stethoscope className="w-24 h-24 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-muted-foreground text-sm italic">
          "Compassion begins with connection."
        </p>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to continue your healthcare journey.
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2">
            {roles.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-medium transition-all ${
                  role === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;