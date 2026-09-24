import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axiosInstance";

interface ApplicationFormData {
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  salary: string;
  jobUrl: string;
  notes: string;
}

async function createApplication(data: ApplicationFormData) {
  const response = await api.post("/applications", data);
  return response.data;
}

function AddApplication() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    defaultValues: {
      company: "",
      role: "",
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      salary: "",
      jobUrl: "",
      notes: "",
    },
  });

  const addMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate("/");
    },
    onError: (err: any) => {
      setError("root", {
        message: err.response?.data?.error || err.message,
      });
    },
  });

  async function onSubmit(data: ApplicationFormData) {
    await addMutation.mutateAsync(data);
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-xl text-sm outline-none
    transition-all ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    }`;

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const errorText = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="w-9 h-9 rounded-xl border border-gray-200
                       bg-white flex items-center justify-center
                       text-gray-500 hover:text-gray-900
                       hover:border-gray-300 transition-colors
                       no-underline text-lg"
          >
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add Application
            </h1>
            <p className="text-gray-500 text-sm">Track a new job application</p>
          </div>
        </div>

        {/* Form Card */}
        <div
          className="bg-white rounded-2xl border border-gray-200
                        shadow-sm p-8"
        >
          {errors.root && (
            <div
              className="bg-red-50 border border-red-200
                            text-red-600 px-4 py-3 rounded-xl
                            mb-6 text-sm"
            >
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company and Role — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("company", {
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters",
                    },
                  })}
                  type="text"
                  placeholder="Google, Amazon, Swiggy..."
                  className={inputClass(!!errors.company)}
                />
                {errors.company && (
                  <p className={errorText}>{errors.company.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  Role <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("role", {
                    required: "Role is required",
                    minLength: {
                      value: 2,
                      message: "Must be at least 2 characters",
                    },
                  })}
                  type="text"
                  placeholder="Frontend Developer, SDE..."
                  className={inputClass(!!errors.role)}
                />
                {errors.role && (
                  <p className={errorText}>{errors.role.message}</p>
                )}
              </div>
            </div>

            {/* Status and Date — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>Status</label>
                <select {...register("status")} className={inputClass(false)}>
                  <option value="applied">📤 Applied</option>
                  <option value="interview">🎯 Interview</option>
                  <option value="rejected">❌ Rejected</option>
                  <option value="offer">🎉 Offer</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Date Applied</label>
                <input
                  {...register("appliedDate")}
                  type="date"
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* Salary and Job URL — side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClass}>
                  Expected Salary
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  {...register("salary")}
                  type="text"
                  placeholder="8 LPA, ₹50,000/month..."
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Job URL
                  <span className="text-gray-400 font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  {...register("jobUrl", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must start with http:// or https://",
                    },
                  })}
                  type="text"
                  placeholder="https://careers.google.com/..."
                  className={inputClass(!!errors.jobUrl)}
                />
                {errors.jobUrl && (
                  <p className={errorText}>{errors.jobUrl.message}</p>
                )}
              </div>
            </div>

            {/* Notes — full width */}
            <div className="mb-8">
              <label className={labelClass}>
                Notes
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                {...register("notes")}
                placeholder="Applied via LinkedIn. Referral from Rahul. Interview scheduled for..."
                rows={4}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  navigate("/");
                }}
                className="flex-1 py-3 border border-gray-200
                           text-gray-600 rounded-xl text-sm
                           font-medium hover:bg-gray-50
                           transition-colors cursor-pointer
                           bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || addMutation.isPending}
                className="flex-1 py-3 bg-blue-600 text-white
                           rounded-xl text-sm font-medium
                           hover:bg-blue-700 transition-colors
                           disabled:bg-gray-400
                           disabled:cursor-not-allowed
                           cursor-pointer border-none
                           shadow-lg shadow-blue-200"
              >
                {isSubmitting || addMutation.isPending
                  ? "Adding..."
                  : "Add Application"}
              </button>
            </div>
          </form>
        </div>

        {/* Tip */}
        <p className="text-center text-gray-400 text-xs mt-6">
          💡 Tip — Add the job URL so you can quickly revisit the posting later
        </p>
      </div>
    </div>
  );
}

export default AddApplication;
