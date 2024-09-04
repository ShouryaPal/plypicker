import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { decodeToken, getReviewsByPerson } from "@/lib/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "./Navbar";

interface ProductDetails {
  productName: string;
  price: number;
  image: string;
  productDescription: string;
  department: string;
  id: string;
}

interface Review {
  _id: string;
  productId: string;
  personId: string;
  status: "pending" | "approved" | "rejected";
  productDetails: ProductDetails;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReviewsData {
  approved: Review[];
  rejected: Review[];
  pending: Review[];
}

const ReviewDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: () => (token ? decodeToken(token) : Promise.reject("No token")),
    enabled: !!token,
  });

  const { data: reviews, isLoading: isReviewsLoading } = useQuery<ReviewsData>({
    queryKey: ["reviews", userData?.user?.id],
    queryFn: () => getReviewsByPerson(userData?.user?.id as string),
    enabled: !!userData?.user?.id,
  });

  if (isUserLoading || isReviewsLoading) {
    return <div>Loading...</div>;
  }

  const renderReviewCard = (review: Review) => (
    <Card key={review._id} className="mb-4 space-y-6">
      <CardHeader className="space-y-4">
        <CardTitle>{review.productDetails.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Price: ${review.productDetails.price}</p>
        <p>Department: {review.productDetails.department}</p>
        <p>Product ID: {review.productDetails.id}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col">
      <Navbar role={userData?.user.role} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Review Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending ({reviews?.pending.length || 0})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({reviews?.approved.length || 0})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({reviews?.rejected.length || 0})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            {reviews?.pending.map(renderReviewCard)}
          </TabsContent>
          <TabsContent value="approved">
            {reviews?.approved.map(renderReviewCard)}
          </TabsContent>
          <TabsContent value="rejected">
            {reviews?.rejected.map(renderReviewCard)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewDashboard;
