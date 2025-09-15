import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { UserCredentials } from "@repo/db";
import axios from "axios";

export const DashboardTabs = () => {
  const [credentials, setCredentials] = useState<UserCredentials[] | null>();
  const [loading, setLoading] = useState(false);
  const TelegramCred = ({ data }: { data: any }) => (
    <div>
      <p>
        <strong>Base URL:</strong> {data.baseUrl}
      </p>
      <p>
        <strong>Access Token:</strong> {data.accessToken}
      </p>
    </div>
  );

  const OpenAICred = ({ data }: { data: any }) => (
    <div>
      <p>
        <strong>URL:</strong> {data.url}
      </p>
      <p>
        <strong>API Key:</strong> {data.apiKey}
      </p>
      <p>
        <strong>Organization ID:</strong> {data.organizationId}
      </p>
      <p>
        <strong>Allowed Domains:</strong> {data.allowedDomains || "—"}
      </p>
      <p>
        <strong>Allowed HTTP Request Domains:</strong>{" "}
        {data.allowedHttpRequestDomains}
      </p>
    </div>
  );

  const credentialComponents: Record<
    string,
    React.FC<{ data: UserCredentials }>
  > = {
    Telegram: TelegramCred,
    OpenAi: OpenAICred,
  };
  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8888/api/v1/cred/all", {
        withCredentials: true,
      });
      if (!res) {
        alert("cannot fetch credentials");
      } else {
        setCredentials(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching credentials", err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs className="p-5" defaultValue="workflows">
        <div className="w-full">
          <TabsList className="gap-5 bg-neutral-100">
            <TabsTrigger value="workflows">WorkFlows</TabsTrigger>
            <TabsTrigger onClick={fetchCredentials} value="credentials">
              Credentials
            </TabsTrigger>
            <TabsTrigger value="executions">Executions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="workflows">
          <div>Workflows</div>
        </TabsContent>

        <TabsContent value="credentials">
          <div>
            <div className="mb-3">Credentials</div>

            {loading && (
              <div className="flex justify-center items-center py-6">
                <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-blue-600">Loading...</span>
              </div>
            )}

            {!loading &&
              credentials &&
              credentials.map((cred) => {
                const Component = credentialComponents[cred.name];
                return (
                  <div key={cred.id} className="p-3 mb-2 border rounded-lg">
                    <h3 className="font-medium mb-1">{cred.name}</h3>
                    <Component data={cred.data} />
                  </div>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="executions">
          <div>Executions</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
