import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const dashboardSearch = () => {
  return (
    <form className="flex-1 sm:flex-initial ">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 py-4 sm:w-[200px] md:w-[200px] lg:w-[260px] focus-visible:ring-transparent border-none focus:outline-none appearance-none"
        />
      </div>
    </form>
  );
};

export default dashboardSearch;
