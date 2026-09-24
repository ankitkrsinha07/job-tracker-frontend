import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<ProfileData> => {
      const response = await api.get("/auth/profile");
      return response.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await api.get("/applications/stats");
      return response.data;
    },
  });

  function handleLogout() {
    logout();
    navigate("/");
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Profile Card */}
        <div
          className="bg-white rounded-2xl border border-gray-200
                        shadow-sm p-8 mb-6"
        >
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br
                            from-blue-500 to-purple-600 flex items-center
                            justify-center text-white font-bold text-3xl"
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.name}
              </h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
              <p className="text-gray-400 text-xs mt-1">
                Member since{" "}
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {statsData?.total || 0}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                Total Applications
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {statsData?.stats?.offer || 0}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                Offers Received
              </p>
            </div>
          </div>

          {/* Account info */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Full Name</span>
                <span className="text-sm font-medium text-gray-900">
                  {profile?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium text-gray-900">
                  {profile?.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">User ID</span>
                <span className="text-sm text-gray-400 font-mono">
                  #{profile?.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-50 text-red-600
                     border border-red-200 rounded-xl text-sm
                     font-medium hover:bg-red-100
                     transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Profile;
