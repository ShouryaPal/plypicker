"use client";

import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SearchParamsWrapper = dynamic(() => import("@/app/SearchParamsWrapper"), {
  ssr: false,
});

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading search params...</div>}>
      <SearchParamsWrapper setRole={setRole} />
      {role ? <Dashboard role={role} /> : null}
    </Suspense>
  );
};

export default Page;
