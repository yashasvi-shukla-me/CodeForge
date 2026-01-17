import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Shield, Calendar } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-base-content/70">Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center mt-16 px-4">
      <div className="w-full max-w-3xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-6">
            {/* Header */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-base-300">
                <img
                  src={
                    authUser.image ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  }
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold">{authUser.name}</h2>
                <p className="text-base-content/70">{authUser.email}</p>
              </div>
            </div>

            <div className="divider" />

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-medium">{authUser.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">{authUser.role}</span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">
                  Joined {new Date(authUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="divider" />

            {/* Actions */}
            <div className="flex gap-4">
              <button className="btn btn-primary">Edit Profile</button>
              <button className="btn btn-outline btn-error">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
