/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import type { UserCredentials, Workflow } from "@repo/db";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Pencil, Save, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const DashboardTabs = () => {
  const [credentials, setCredentials] = useState<UserCredentials[] | null>();
  const [loading, setLoading] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [selectedCred, setSelectedCred] = useState<UserCredentials | null>(
    null
  );
  const [userWorkflows, setUserWorkflows] = useState<Workflow[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const navigate = useNavigate();

  const fetchWorkflows = async () => {
    try {
      setWorkflowLoading(true);
      const res = await axios.post(
        "http://localhost:8888/api/v1/workflow/getAllWorkflows",
        {},
        {
          withCredentials: true,
        }
      );

      setUserWorkflows(res.data.data);
      setWorkflowLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8888/api/v1/cred/all", {
        withCredentials: true,
      });
      setCredentials(res.data.data);
    } catch (err) {
      console.error("Error fetching credentials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
    fetchWorkflows();
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setFormData(selectedCred || {});
  };

  const handleChange = (field: string, value: string, nested = false) => {
    if (nested) {
      setFormData((prev: any) => ({
        ...prev,
        data: { ...prev.data, [field]: value },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      const res = await axios.delete(
        `http://localhost:8888/api/v1/workflow/${workflowId}`,
        {
          withCredentials: true,
        }
      );

      if (res) {
        alert("workflow deleted successfully");
      }
      fetchWorkflows();
    } catch (error) {
      alert("workflow failed to delete");
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (!selectedCred) return;
    try {
      await axios.put(
        `http://localhost:8888/api/v1/cred/update/${selectedCred.id}`,
        formData,
        { withCredentials: true }
      );
      alert("Credential updated successfully!");
      fetchCredentials();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating credential", err);
      alert("Failed to update credential");
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs className="p-5" defaultValue="workflows">
        <div className="w-full">
          <TabsList className="gap-5 bg-neutral-100">
            <TabsTrigger value="workflows">WorkFlows</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            {/* <TabsTrigger value="executions">Executions</TabsTrigger> */}
          </TabsList>
        </div>

        <TabsContent value="workflows">
          <div className="mb-3 text-lg font-semibold">Workflows</div>

          {workflowLoading && (
            <div className="flex justify-center items-center py-6">
              <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-teal-600">Loading...</span>
            </div>
          )}

          {workflowLoading && userWorkflows && userWorkflows.length === 0 && (
            <p className="text-gray-500">No workflows found.</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-2">
            {!workflowLoading &&
              userWorkflows &&
              userWorkflows.map((wf) => (
                <Card
                  key={wf.id}
                  onClick={() => {
                    navigate(`/workflow/${wf.id}`);
                  }}
                  className=" bg-teal-100/20 shadow-sm cursor-pointer py-4 px-0 hover:shadow-md transition rounded-lg gap-2 border border-gray-200"
                >
                  <CardHeader className="flex flex-row items-center justify-between px-3 gap-2">
                    <CardTitle className=" flw text-base">{wf.name}</CardTitle>
                    <Trash
                      width={20}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent card navigation
                        handleDeleteWorkflow(wf.id);
                      }}
                      className="cursor-pointer z-10 text-red-800 transition-transform duration-200 hover:scale-110"
                    />
                  </CardHeader>
                  <CardContent className="text-sm px-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        Created: {new Date(wf.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>
                        Updated: {new Date(wf.updatedAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="credentials">
          <div>
            <div className="mb-3 text-lg font-semibold">Credentials</div>

            {loading && (
              <div className="flex justify-center items-center py-6">
                <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-teal-600">Loading...</span>
              </div>
            )}

            {!loading && credentials && credentials.length === 0 && (
              <p className="text-gray-500">No credentials found.</p>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {!loading &&
                credentials &&
                credentials.map((cred) => (
                  <Dialog
                    key={cred.id}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedCred(null);
                        setIsEditing(false);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Card
                        onClick={() => setSelectedCred(cred)}
                        className="shadow-sm cursor-pointer py-4 px-0 hover:shadow-md transition rounded-lg gap-2 border border-gray-200"
                      >
                        <CardHeader className="flex flex-row justify-between items-center px-3 gap-2">
                          <div className="flex flex-row items-center gap-2">
                            <img src={cred.appIcon} width={30} alt="" />
                            <CardTitle className="text-base">
                              {cred.name}
                            </CardTitle>
                          </div>
                          <Trash
                            className="text-red-800 cursor-pointer transition-transform duration-200 hover:scale-110"
                            width={20}
                            onClick={async (e) => {
                              e.stopPropagation(); // prevent card navigation
                              try {
                                const res = await axios.delete(
                                  `http://localhost:8888/api/v1/cred/${cred.id}`,
                                  { withCredentials: true }
                                );

                                if (res.status === 200) {
                                  setCredentials((prev) =>
                                    prev!.filter((c) => c.id !== cred.id)
                                  );
                                  alert("credentials eleted successfully ")
                                  console.log(
                                    "Credential deleted successfully"
                                  );
                                }
                              } catch (err) {
                                console.error(
                                  "Failed to delete credential",
                                  err
                                );
                              }
                            }}
                          />
                        </CardHeader>
                        <CardContent className="text-sm px-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              Created:{" "}
                              {new Date(cred.createdAt!).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>
                              Updated:{" "}
                              {new Date(cred.updatedAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg bg-white border-teal-200">
                      <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle className="text-teal-700">
                          Credential Details
                        </DialogTitle>
                        {!isEditing && (
                          <Pencil
                            onClick={handleEditToggle}
                            className="h-5 w-5 cursor-pointer text-teal-600"
                          />
                        )}
                      </DialogHeader>

                      {selectedCred && (
                        <div className="space-y-3 mt-4">
                          <div>
                            <label className="text-sm text-teal-700">
                              Name
                            </label>
                            <p>{selectedCred.name}</p>
                          </div>
                          <div>
                            <label className="text-sm text-teal-700">
                              Application Api
                            </label>
                            <p>{selectedCred.apiName}</p>
                          </div>

                          {/* Nested Data */}
                          {selectedCred.data &&
                            Object.entries(selectedCred.data).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <label className="text-sm text-teal-700 truncate capitalize">
                                    {key}
                                  </label>
                                  {isEditing ? (
                                    <Input
                                      value={
                                        formData.data?.[key] || value || ""
                                      }
                                      onChange={(e) =>
                                        handleChange(key, e.target.value, true)
                                      }
                                    />
                                  ) : (
                                    <p className=" max-w-[400px] truncate ">
                                      {String(value)}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                        </div>
                      )}

                      {/* Save Button */}
                      {isEditing && (
                        <div className="flex justify-end mt-4">
                          <Button
                            onClick={handleSave}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </div>
        </TabsContent>

        {/* Executions */}
        <TabsContent value="executions">
          <div>Executions</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
