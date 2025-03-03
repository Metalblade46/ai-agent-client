import React from "react";
import { Button } from "./ui/button";
import { ArrowLeftIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { UserButton } from "@clerk/nextjs";
import { use } from "react";
import { NavigationContext } from "@/lib/NavigationProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { setIsMobileNavOpen } = use(NavigationContext);
  const pathName = usePathname()
  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </Button>
          <div className="font-semibold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            {pathName.endsWith('dashboard')?'Chat with your own AI Agent': <Link href={'/dashboard'}>
            <div className="flex gap-2 cursor-pointer">
              <ArrowLeftIcon className="h-5 w-5 text-blue-800"/>
              Dashboard
            </div>
            </Link>}
          </div>
        </div>
        <div>
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-2 ring-blue-200/50 ring-offset-2 rounded-full transition-shadow hover:ring-blue-300/50",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
