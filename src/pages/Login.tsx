import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await api.post("/auth/login", data);
      const { token, user } = response.data;
      login(token, user);
      navigate("/dashboard");
    } catch (err: any) {
      setError("root", {
        message: err.response?.data?.error || err.message,
      });
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-base outline-none
    transition-all ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`;

  const labelClass = "block text-sm font-bold text-gray-700 mb-1";
  const errorText = "text-red-500 text-xs mt-1";

  return (
    <div
      className="min-h-screen flex items-center
                    justify-center bg-gray-50"
    >
      <div
        className="w-full max-w-md bg-white rounded-xl
                      shadow-md p-10"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
        <p className="text-gray-500 mb-6">Welcome back to Job Tracker</p>

        {errors.root && (
          <div
            className="bg-red-50 text-red-500 px-4 py-3
                          rounded-lg mb-4 text-sm"
          >
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="ankit@gmail.com"
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className={errorText}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              type="password"
              placeholder="Enter your password"
              className={inputClass(!!errors.password)}
            />
            {errors.password && (
              <p className={errorText}>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white
                       rounded-lg text-base font-medium
                       hover:bg-blue-700 transition-colors
                       disabled:bg-gray-400
                       disabled:cursor-not-allowed
                       cursor-pointer border-none mt-2"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
