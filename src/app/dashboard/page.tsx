"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndRole = () => {
      const token = localStorage.getItem("token");
      const roleParam = searchParams.get("role");

      if (!token || !roleParam) {
        router.push("/login");
      } else {
        setRole(roleParam);
      }
      setIsLoading(false);
    };

    checkAuthAndRole();
  }, [searchParams, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return role ? <Dashboard role={role} /> : null;
};

export default Page;
