import Link from "next/link";
import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { ListTodo, UserCircle, Workflow } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type NavbarProps = {
  role?: string;
};

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="w-full px-4 sm:px-8 py-4 flex items-center justify-between border-b-2">
      <Link
        href={`/dashboard?role=${role}`}
        className="font-semibold text-lg sm:text-2xl"
      >
        ProductListing
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
        {role === "team member" ? (
          <Link
            href="/profile/my-submissions"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
          >
            <Workflow className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
        ) : (
          <Link
            href="/pending-request"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
            })}
          >
            <ListTodo className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10">
              <AvatarImage src="/not.png" />
              <AvatarFallback>
                <UserCircle />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => router.push("/profile")}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
