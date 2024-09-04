"use client";

import React, { useState, useEffect } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  decodeToken,
  fetchProductById,
  reviewProduct,
  updateProduct,
} from "@/lib/server";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import ProductForm from "@/components/ProductForm";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";

type Product = {
  _id: string;
  productName: string;
  price: string | number;
  image: string;
  productDescription: string;
  department: string;
  id: string;
  __v: number;
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [localProduct, setLocalProduct] = useState<Product | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
    data: product,
    isLoading,
    isError,
  } = useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => {
      if (typeof id !== "string") {
        throw new Error("Invalid ID");
      }
      return fetchProductById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      setLocalProduct(product);
    }
  }, [product]);

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      redirect("/login");
    }
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (localProduct) {
      setLocalProduct({
        ...localProduct,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setLocalProduct((prevProduct) =>
      prevProduct ? { ...prevProduct, image: imageUrl } : null
    );
  };

  const handleSubmitForApproval = async () => {
    if (localProduct && userData?.user.id) {
      const toastId = toast.loading("Submitting for approval...");
      try {
        await reviewProduct(userData.user.id, localProduct._id, localProduct);
        toast.success("Submitted for approval successfully!", { id: toastId });
        router.push(`/dashboard?role=${userData?.user.role}`);
      } catch (error) {
        toast.error("Error submitting for approval", { id: toastId });
        console.error("Error submitting for approval:", error);
      }
    }
  };

  const handleSave = async () => {
    if (localProduct && typeof id === "string") {
      const toastId = toast.loading("Saving product...");
      try {
        const updatedProduct = await updateProduct(id, localProduct);
        toast.success("Product saved successfully!", { id: toastId });
        console.log("Updated product:", updatedProduct);
        router.push(`/dashboard?role=${userData?.user.role}`);
      } catch (error) {
        toast.error("Error saving product", { id: toastId });
        console.error("Error saving product:", error);
      }
    }
  };

  if (isLoading || isUserLoading) return <div>Loading...</div>;
  if (isError || isUserError || !localProduct)
    return <div>Error loading product or user data.</div>;

  return (
    <div className="flex flex-col">
      <Navbar role={userData?.user.role} />
      <div className="w-full max-h-screen px-10 py-10">
        <div className="grid grid-cols-2 gap-4">
          <ImageUpload
            localProductImage={localProduct.image}
            setLocalProductImage={handleImageUpdate}
          />
          <ProductForm
            localProduct={localProduct}
            handleInputChange={handleInputChange}
          />
        </div>
        {userData?.user.role === "admin" ? (
          <Button onClick={handleSave} className="w-full mt-4">
            Save
          </Button>
        ) : (
          <Button onClick={handleSubmitForApproval} className="w-full mt-4">
            Submit for Approval
          </Button>
        )}
      </div>
    </div>
  );
}
