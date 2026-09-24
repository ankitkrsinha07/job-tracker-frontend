import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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

function EditApplication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>();

  // Fetch existing application data
  const { data: application, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const response = await api.get(`/applications`);
      const apps = response.data;
      // find the specific application by id
      return apps.find((app: any) => app.id === parseInt(id!));
    },
  });

  // Pre-fill form when data loads
  useEffect(() => {
    if (application) {
      reset({
        company: application.company,
        role: application.role,
        status: application.status,
        appliedDate: application.appliedDate
          ? new Date(application.appliedDate).toISOString().split("T")[0]
          : "",
        salary: application.salary || "",
        jobUrl: application.jobUrl || "",
        notes: application.notes || "",
      });
    }
  }, [application, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      const response = await api.put(`/applications/${id}`, data);
      return response.data;
    },
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
    await updateMutation.mutateAsync(data);
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div
          className="w-10 h-10 border-4 border-blue-600
                      border-t-transparent rounded-full
                      animate-spin"
        ></div>
      </div>
    );

  if (!application)
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500 mb-4">Application not found</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );

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
              Edit Application
            </h1>
            <p className="text-gray-500 text-sm">
              Update {application.company} — {application.role}
            </p>
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2
                            gap-5 mb-5"
            >
              <div>
                <label className={labelClass}>
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("company", {
                    required: "Company name is required",
                  })}
                  type="text"
                  placeholder="Google, Amazon..."
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
                  })}
                  type="text"
                  placeholder="Frontend Developer..."
                  className={inputClass(!!errors.role)}
                />
                {errors.role && (
                  <p className={errorText}>{errors.role.message}</p>
                )}
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2
                            gap-5 mb-5"
            >
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

            <div
              className="grid grid-cols-1 sm:grid-cols-2
                            gap-5 mb-5"
            >
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
                  placeholder="8 LPA..."
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
                  {...register("jobUrl")}
                  type="text"
                  placeholder="https://..."
                  className={inputClass(false)}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClass}>
                Notes
                <span className="text-gray-400 font-normal ml-1">
                  (optional)
                </span>
              </label>
              <textarea
                {...register("notes")}
                placeholder="Interview scheduled, referral from..."
                rows={4}
                className={`${inputClass(false)} resize-none`}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
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
                disabled={isSubmitting || updateMutation.isPending}
                className="flex-1 py-3 bg-blue-600 text-white
                           rounded-xl text-sm font-medium
                           hover:bg-blue-700 transition-colors
                           disabled:bg-gray-400
                           disabled:cursor-not-allowed
                           cursor-pointer border-none
                           shadow-lg shadow-blue-200"
              >
                {isSubmitting || updateMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditApplication;
