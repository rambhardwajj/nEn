import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AddTrigger() {

  return (
    <div className="bg-teal-50 border border-dashed py-4  border-teal-400 rounded-xl shadow-md flex flex-col items-center justify-center gap-3 w-[120px]">
      <Sheet>
        <SheetTrigger asChild>
          <button className=" cursor-pointer px-2 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium transition-all duration-200 shadow">
            Trigger
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Available Triggers</SheetTitle>
            <SheetDescription>Select the preferred trigger</SheetDescription>
          </SheetHeader>
         <div>

         </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
