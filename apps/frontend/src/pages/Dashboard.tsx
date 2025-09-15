import { Button } from "@/components/ui/button";
import {
  Dialog,
  // DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import type { CredentialsI } from "@repo/db";

// import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState } from "react";
import { CredentialDialogContent } from "@/components/CredentialDialogContent";
import { DashboardTabs } from "@/components/DashboardTabs";
import { Link } from "react-router-dom";

const Home = () => {
  const [credApis, setCredApis] = useState<CredentialsI[]>([]);
  const [credName, setCredName] = useState<string>("");
  const [currCredApi, setCredCurrApi] = useState<CredentialsI | null>(null);

  console.log(credApis, credName, currCredApi);

  return (
    <div className=" min-h-screen w-full ">
      <div>
        <div className="w-full flex items-center justify-between px-3 mt-1 border-b ">
          <div>Your WorkFlows...</div>
          <div className="flex gap-1">
            <Link to={"/workflow"}>
              <Button className='className="px-1 py-1 my-2 mx-2 md:cursor-pointer border-2 border-b-3 border-neutral-800 hover:bg-teal-50 bg-white text-black hover:text-black transition-colors items-center flex rounded-md'>
                Create Workflow
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={async () => {
                    const res = await axios.get(
                      "http://localhost:8888/api/v1/cred/get-all",
                      {
                        withCredentials: true,
                      }
                    );
                    setCredApis(res.data.data);
                  }}
                  className="px-2 py-1 my-2 mx-2 md:cursor-pointer border-2 border-b-3 border-neutral-800 hover:bg-teal-50 bg-white text-black hover:text-black transition-colors items-center flex rounded-md"
                >
                  Add Credentials
                </Button>
              </DialogTrigger>

              <CredentialDialogContent
                credApis={credApis}
                credName={credName}
                currCredApi={currCredApi}
                setCredName={setCredName}
                setCredCurrApi={setCredCurrApi}
              />
            </Dialog>
          </div>
        </div>
      </div>
      <div>
        <DashboardTabs />
      </div>
    </div>
  );
};

export default Home;
