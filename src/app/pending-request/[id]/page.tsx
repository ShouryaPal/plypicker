"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { decodeToken, fetchProductDetails, updateStatus } from "@/lib/server";
import Navbar from "@/components/Navbar";

interface ProductDetails {
  productName: string;
  price: number;
  department: string;
  id: string;
  image: string;
  productDescription: string;
}

const PendingRequestDetail: React.FC<{ params: { id: string } }> = ({
  params,
}) => {
  const router = useRouter();
  const { id } = params;
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
    data: review,
    isLoading,
    isError,
  } = useQuery<ProductDetails>({
    queryKey: ["pendingReview", id],
    queryFn: () => fetchProductDetails(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !review) {
    return <div>Error loading review or review not found</div>;
  }

  const handleApprove = async () => {
    try {
      await updateStatus(id, "approved");
      router.push("/pending-request");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      await updateStatus(id, "rejected");
      router.push("/pending-request");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar role={userData?.user.role} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pending Request Details</h1>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{review.productName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 overflow-hidden rounded-lg">
              <div className="relative w-40 h-40">
                {" "}
                {/* Fixed height */}
                <Image
                  src={review.image}
                  alt={review.productName}
                  layout="fill"
                  objectFit="contain"
                  className="absolute top-0 left-0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Price:</span> $
                  {review.price.toFixed(2)}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Department:</span>{" "}
                  {review.department}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Product ID:</span> {review.id}
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {review.productDescription}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <Button
                onClick={handleApprove}
                className="bg-green-500 hover:bg-green-600"
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600"
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PendingRequestDetail;
