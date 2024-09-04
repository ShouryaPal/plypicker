import axios from "axios";
import { jwtDecode } from "jwt-decode";

type Product = {
  id: string;
  productName: string;
  price: number | string;
  image: string;
  productDescription: string;
  department: string;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data; // This should contain { token: "token_value" }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  isAdmin: boolean;
}) => {
  try {
    const role = userData.isAdmin ? "admin" : "team-member";
    const response = await api.post("/auth/register", {
      email: userData.email,
      password: userData.password,
      role: role,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    if (axios.isAxiosError(error) && error.response) {
      // Log more detailed error information
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

export const decodeToken = (token: string) => {
  try {
    const decoded = jwtDecode(token) as {
      user: {
        id: string;
        role: string;
        email: string;
      };
      exp: number;
      iat: number;
    };
    console.log("Decoded token:", decoded); // Add this line for debugging
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const fetchProducts = async () => {
  try {
    const result = await api.get("/products");
    return result.data;
  } catch (err) {
    console.log("Error occur in fetching products");
    return null;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const result = await api.get(`/products/${id}`);
    return result.data[0];
  } catch (err) {
    console.log("Error occur in fetching");
    return null;
  }
};

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  updateData: Partial<Product>
) => {
  try {
    const response = await api.put(`/products/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

export const reviewProduct = async (
  personId: string,
  productId: string,
  product: Product
) => {
  try {
    const response = await api.post("/", {
      productId,
      personId,
      productDetails: {
        productName: product.productName,
        price: Number(product.price),
        image: product.image,
        productDescription: product.productDescription,
        department: product.department,
        id: product.id,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting product review:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }
    throw error;
  }
};

// To get reviews by person, grouped by status
export const getReviewsByPerson = async (personId: string) => {
  try {
    const response = await api.get(`/person/${personId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews by person:", error);
    throw error;
  }
};

// To get all pending reviews
export const getPendingReviews = async () => {
  try {
    const response = await api.get("/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }
};

export const fetchProductDetails = async (id: string) => {
  try {
    const response = await api.get(`/product-details/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

export const updateStatus = async (id: string, status: string) => {
  try {
    const response = await api.put(`/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }
};

export const profileStats = async (id: string) => {
  try {
    const response = await api.get(`/user-stats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    throw error;
  }
};
