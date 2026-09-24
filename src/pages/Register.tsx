import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  const password = watch("password");

  async function onSubmit(data: RegisterFormData) {
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/login");
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Register</h1>
        <p className="text-gray-500 mb-6">
          Start tracking your job applications
        </p>

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
            <label className={labelClass}>Full Name</label>
            <input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              type="text"
              placeholder="Ankit Kumar"
              className={inputClass(!!errors.name)}
            />
            {errors.name && <p className={errorText}>{errors.name.message}</p>}
          </div>

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
              placeholder="Minimum 6 characters"
              className={inputClass(!!errors.password)}
            />
            {errors.password && (
              <p className={errorText}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type="password"
              placeholder="Repeat your password"
              className={inputClass(!!errors.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p className={errorText}>{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-green-600 text-white
                       rounded-lg text-base font-medium
                       hover:bg-green-700 transition-colors
                       disabled:bg-gray-400
                       disabled:cursor-not-allowed
                       cursor-pointer border-none mt-2"
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
