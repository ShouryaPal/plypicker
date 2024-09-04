import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { ListTodo, UserCircle, Workflow } from "lucide-react";
import ProductTable from "./ProductTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";

type Props = {
  role?: string;
};

const Dashboard = ({ role }: Props) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* <nav className="w-full px-8 py-5 flex items-center justify-between border-b-2 ">
        <Link
          href={`/dashboard?role=${role}`}
          className="font-semibold text-2xl"
        >
          ProductListing
        </Link>
        <div className="flex items-center gap-4">
          {role == "team member" ? (
            <Link
              href={"/profile/my-submissions"}
              className={`${buttonVariants({
                variant: "ghost",
              })} border-2 gap-2`}
            >
              <Workflow />
              Actions
            </Link>
          ) : (
            <Link
              href={"/pending-request"}
              className={`${buttonVariants({
                variant: "ghost",
              })} border-2 gap-2`}
            >
              <ListTodo />
              Pending
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src="/not.png" />
                <AvatarFallback>
                  <UserCircle />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push("/profile")}>
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav> */}
      <Navbar role={role} />
      <div className="px-8 py-4 flex flex-col gap-5">
        <h1 className="text-lg font-bold">Welcome Back!, 👋</h1>
        <ProductTable />
      </div>
    </div>
  );
};

export default Dashboard;
