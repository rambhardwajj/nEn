import Navbar from "@/components/Navbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home = () => {
  return (
    <div className=" min-h-screen w-full ">
      <div>
        <Navbar />
      </div>
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
              <div>fdsha</div>
            </TabsContent>
            <TabsContent value="credentials">
              <div>dsfa</div>
            </TabsContent>
            <TabsContent value="executions">
              <div>fsda</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Home;
