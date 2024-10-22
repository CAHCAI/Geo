import React from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <div className="bg-white min-h-screen">
      <nav className="bg-gray-800 drop-shadow-lg p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-3xl font-bold">Geo</div>
          <div className="flex space-x-4">
            <Button className="bg-gray-600">
              <a href="/" className="text-white">
                Home
              </a>
            </Button>
            <Button className="bg-gray-600">
              <Link href="/hpsa-search" className="text-white">
                HPSA Search
              </Link>
            </Button>
            <Button className="bg-gray-600">
              <a href="/licensed-healthcare" className="text-white">
                Licensed Healthcare Facilities
              </a>
            </Button>
            <Button className="bg-gray-600">
              <a href="/api-reference" className="text-white">
                API Reference
              </a>
            </Button>
            <Sheet>
              <SheetTrigger className="bg-gray-600 h-9 rounded-md px-3">
                <AlignJustify className="text-white"></AlignJustify>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Login</SheetTitle>
                  <SheetDescription>add login here</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}
