'use client';
import React from "react";
import Link from 'next/link';
import { Input } from "@/components/ui/input"
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

export const InputWithButton: React.FC = () => {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="address" placeholder="2020 W El Camino Ave, Sacramento CA" />
      <Button type="search">Search</Button>
    </div>
  );
};

const Page: React.FC = () => {
  return (
    <div>
      <InputWithButton />
      {/* Other content */}
    </div>
  );
};

export default Page;