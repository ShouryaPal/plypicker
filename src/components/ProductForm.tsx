import React from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Product = {
  productName: string;
  productDescription: string;
  price: string | number;
};

type ProductFormProps = {
  localProduct: Product;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export default function ProductForm({
  localProduct,
  handleInputChange,
}: ProductFormProps) {
  return (
    <div className="space-y-2">
      <Input
        type="text"
        name="productName"
        value={localProduct.productName}
        onChange={handleInputChange}
        className="p-2"
      />
      <Textarea
        name="productDescription"
        value={localProduct.productDescription}
        onChange={handleInputChange}
        className="p-2"
      />
      <Input
        type="text"
        name="price"
        value={localProduct.price}
        onChange={handleInputChange}
        className="p-2"
      />
    </div>
  );
}
