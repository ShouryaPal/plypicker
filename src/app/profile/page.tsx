"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { decodeToken, profileStats } from "@/lib/server";
import Navbar from "@/components/Navbar";

const ProfilePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => (token ? decodeToken(token) : Promise.reject("No token")),
    enabled: !!token,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery({
    queryKey: ["userStats", userData?.user?.id],
    queryFn: () => profileStats(userData?.user?.id as string),
    enabled: !!userData?.user?.id,
  });

  if (typeof window === "undefined") {
    return null; // Return null on server-side to prevent hydration mismatch
  }

  if (!token) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isUserLoading || isStatsLoading) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  if (isUserError || isStatsError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading profile data
      </div>
    );
  }

  if (!userData || !statsData) {
    return <div className="text-center py-10">No user data available</div>;
  }

  return (
    <div className="flex flex-col">
      <Navbar role={userData.user.role} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <p>
              <strong>Email:</strong> {userData.user.email}
            </p>
            <p>
              <strong>Role:</strong> {userData.user.role}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Requests"
                value={statsData.stats.totalRequests}
              />
              <StatCard
                title="Approved Requests"
                value={statsData.stats.approvedRequests}
              />
              <StatCard
                title="Rejected Requests"
                value={statsData.stats.rejectedRequests}
              />
              <StatCard
                title="Pending Requests"
                value={statsData.stats.pendingRequests}
              />
            </div>
          </div>
          {userData.user.role === "admin" && (
            <p className="mt-4 text-sm text-gray-600">
              Note: These statistics represent overall system activity.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default ProfilePage;
