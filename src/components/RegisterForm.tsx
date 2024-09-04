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
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";

import { decodeToken, registerUser } from "@/lib/server";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  isAdmin: z.boolean().default(false),
});

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      isAdmin: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        try {
          const response = await registerUser({
            email: values.email,
            password: values.password,
            isAdmin: values.isAdmin,
          });
          console.log("Registration response:", response);

          if (response.token) {
            localStorage.setItem("token", response.token);

            // Decode the token
            const decodedToken = decodeToken(response.token);
            console.log("Decoded token:", decodedToken);

            if (decodedToken && decodedToken.user && decodedToken.user.role) {
              const { role } = decodedToken.user;
              router.push(`/dashboard?role=${role}`);
            } else {
              throw new Error("Invalid token or role not found in token");
            }
          } else {
            throw new Error("Registration successful, but no token received");
          }
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        }
      },
      {
        loading: "Registering...",
        success: "Registration successful!",
        error: (err) =>
          `Registration failed: ${
            err instanceof Error ? err.message : "An unknown error occurred"
          }`,
      }
    );
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
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
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Admin</FormLabel>
                    <FormDescription>
                      Check this box if you are an admin.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p>Don&apos;t have an account?</p>
        <Link href={"/login"} className={buttonVariants({ variant: "link" })}>
          Login
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
