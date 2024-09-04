"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { loginUser, decodeToken } from "@/lib/server";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        try {
          const response = await loginUser(values);
          console.log("Login response:", response);

          if (response.token) {
            localStorage.setItem("token", response.token);

            const decodedToken = decodeToken(response.token);
            console.log("Decoded token:", decodedToken);

            if (decodedToken && decodedToken.user && decodedToken.user.role) {
              const { role } = decodedToken.user;

              router.push(`/dashboard?role=${role}`);
            } else {
              throw new Error("Invalid token or role not found in token");
            }
          } else {
            throw new Error("Login successful, but no token received");
          }
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      {
        loading: "Logging in...",
        success: "Login successful!",
        error: (err) =>
          `Login failed: ${
            err instanceof Error ? err.message : "An unknown error occurred"
          }`,
      }
    );
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p>Don&apos;t have an account?</p>
        <Link
          href={"/register"}
          className={buttonVariants({ variant: "link" })}
        >
          Register
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
