import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CredentialsI } from "@repo/db";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState } from "react";

const Home = () => {
  const [credApis, setCredApis] = useState<CredentialsI[]>([]);
  const [credName, setCredName] = useState<string>("");
  const [currCredApi, setCredCurrApi] = useState<CredentialsI | null>(null);

  console.log(credApis, credName, currCredApi)
  
  return (
    <div className=" min-h-screen w-full ">
      <div>
        <div className="w-full flex items-center justify-between px-3 mt-1 border-b ">
          <div>Your WorkFlows...</div>
          <div className="flex gap-1">
            <Button className='className="px-1 py-1 my-2 mx-2 md:cursor-pointer border-2 border-b-3 border-neutral-800 hover:bg-[#f7f1e6] bg-white text-black hover:text-black transition-colors items-center flex rounded-md'>
              Create Workflow
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={async () => {
                    const res = await axios.get(
                      "http://localhost:8888/api/v1/cred/get-all"
                    );
                    setCredApis(res.data.data);
                  }}
                  className="px-1 py-1 my-2 mx-2 md:cursor-pointer border-2 border-b-3 border-neutral-800 hover:bg-[#f7f1e6] bg-white text-black hover:text-black transition-colors items-center flex rounded-md"
                >
                  Add Credentials
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[40%]">
                <DialogHeader>
                  <DialogTitle>Add new Credentials</DialogTitle>
                  <DialogDescription>
                    <Select
                      onValueChange={(value) => {
                        console.log("Selected credential:", value);
                        setCredName(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Credentials" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telegramApi">Telegram Api</SelectItem>
                        {/* <SelectItem value="whatsapp">WhatsAppApi</SelectItem>
                        <SelectItem value="gmail">GmailApi</SelectItem> */}
                        <SelectItem value="openAiApi">OpenAi</SelectItem>
                      </SelectContent>
                    </Select>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    className="cursor-pointer "
                    type="submit"
                    onClick={() => {
                      const res = credApis.filter(
                        (credApi) => credApi.name === credName
                      );
                      console.log(res)
                      setCredCurrApi(res[0])
                    }}
                  >
                    Continue{" "}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="flex w-full  flex-col gap-6">
            <Tabs className="p-5 " defaultValue="workflows">
              <div className=" w-full">
                <TabsList className=" gap-5 bg-neutral-100  ">
                  <TabsTrigger className=" " value="workflows">
                    WorkFlows
                  </TabsTrigger>
                  <TabsTrigger className=" " value="credentials">
                    Credentials
                  </TabsTrigger>
                  <TabsTrigger className="" value="executions">
                    Executions
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="workflows">
                <div></div>
              </TabsContent>
              <TabsContent value="credentials">
                <div></div>
              </TabsContent>
              <TabsContent value="executions">
                <div></div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
