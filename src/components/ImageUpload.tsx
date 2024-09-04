/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadImage } from "@/lib/server";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

type CustomCrop = Crop & {
  aspect?: number;
};

type ImageUploadProps = {
  localProductImage: string;
  setLocalProductImage: (url: string) => void;
};

export default function ImageUpload({
  localProductImage,
  setLocalProductImage,
}: ImageUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CustomCrop>({
    unit: "%",
    width: 30,
    aspect: 1,
    x: 0,
    y: 0,
    height: 30,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (crop: PixelCrop) => {
    setCompletedCrop(crop);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "croppedImage.png", {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    });
  };

  const handleCropAndUpload = async () => {
    if (imageRef.current && completedCrop) {
      const toastId = toast.loading("Uploading image...");
      try {
        const croppedImageFile = await getCroppedImg(
          imageRef.current,
          completedCrop
        );
        const localCroppedImageURL = URL.createObjectURL(croppedImageFile);
        setCroppedImage(localCroppedImageURL);

        const imageUrl = await uploadImage(croppedImageFile);
        setLocalProductImage(imageUrl);

        toast.success("Image uploaded successfully!", { id: toastId });
        setIsDialogOpen(false);
      } catch (error) {
        toast.error("Error uploading image", { id: toastId });
        console.error("Error cropping and uploading image:", error);
      }
    }
  };

  return (
    <div className="flex flex-col border-2 rounded-md items-center justify-center">
      {croppedImage ? (
        <img src={croppedImage} alt="Cropped" width={150} height={150} />
      ) : localProductImage ? (
        <Image
          key={localProductImage} // Key to force re-render on image change
          src={localProductImage}
          alt="Product Image"
          width={150}
          height={150}
        />
      ) : (
        <span>Product image</span>
      )}
      <Button
        onClick={() => document.getElementById("imageUpload")?.click()}
        className="mt-2"
      >
        Select New Image
      </Button>
      <Input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
            >
              <img src={selectedImage} alt="Selected" ref={imageRef} />
            </ReactCrop>
          )}
          <Button onClick={handleCropAndUpload}>Crop and Upload</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
