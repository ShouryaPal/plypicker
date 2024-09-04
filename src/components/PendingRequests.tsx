"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { decodeToken, getPendingReviews } from "@/lib/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "./Navbar";

interface ProductDetails {
  productName: string;
  price: number;
  department: string;
  id: string;
}

interface PendingReview {
  _id: string;
  productId: string;
  personId: string;
  status: "pending";
  productDetails: ProductDetails;
  createdAt: string;
  updatedAt: string;
}

const PendingRequests: React.FC = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: () => (token ? decodeToken(token) : Promise.reject("No token")),
    enabled: !!token,
  });

  const { data: pendingReviews, isLoading: isReviewsLoading } = useQuery<
    PendingReview[]
  >({
    queryKey: ["pendingReviews"],
    queryFn: getPendingReviews,
    enabled: !!userData?.user && userData.user.role === "admin",
  });

  useEffect(() => {
    if (!isUserLoading && userData?.user) {
      if (userData.user.role !== "admin") {
        router.push(`/dashboard`);
      }
    }
  }, [userData, isUserLoading, router]);

  if (typeof window === "undefined") {
    return null; // Return null on server-side to avoid hydration mismatch
  }

  if (isUserLoading || isReviewsLoading) {
    return <div>Loading...</div>;
  }

  if (!userData?.user || userData.user.role !== "admin") {
    return null; // This will prevent any flickering before redirect
  }

  const handleView = (reviewId: string) => {
    router.push(`/pending-request/${reviewId}`);
  };

  return (
    <div className="flex flex-col">
      <Navbar role={userData.user.role} />  

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Pending Product Requests</h1>
        {pendingReviews && pendingReviews.length > 0 ? (
          pendingReviews.map((review) => (
            <Card key={review._id} className="mb-4">
              <CardHeader>
                <CardTitle>{review.productDetails.productName}</CardTitle>
                <Badge>Pending</Badge>
              </CardHeader>
              <CardContent>
                <p>Price: ${review.productDetails.price}</p>
                <p>Department: {review.productDetails.department}</p>
                <p>Product ID: {review.productDetails.id}</p>
                <p>Submitted by: {review.personId}</p>
                <p>
                  Submitted on:{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <Button
                    onClick={() => handleView(review._id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No pending reviews at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;
