"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SearchParamsWrapper = ({
  setRole,
}: {
  setRole: (role: string | null) => void;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    setRole(roleParam);
  }, [searchParams, setRole]);

  return null;
};

export default SearchParamsWrapper;
