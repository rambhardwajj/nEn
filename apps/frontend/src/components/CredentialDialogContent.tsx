import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { CredentialsI, CredentialSubmitPayload } from "@repo/db";
import axios from "axios";
import { useEffect, useState } from "react";

type CredentialDialogContentProps = {
  credApis: CredentialsI[];
  credName: string;
  currCredApi: CredentialsI | null;
  setCredName: (val: string) => void;
  setCredCurrApi: (val: CredentialsI) => void;
};

export function CredentialDialogContent({
  credApis,
  credName,
  currCredApi,
  setCredName,
  setCredCurrApi,
}: CredentialDialogContentProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currCredApi) {
      const initialValues: Record<string, string> = {};
      currCredApi.properties.forEach((prop) => {
        initialValues[prop.name] = prop.default ?? ""; 
      });
      setFormValues(initialValues);
    }
  }, [currCredApi]);
  
  const handleChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!currCredApi) return;

    const payload: CredentialSubmitPayload = {
      name: currCredApi.displayName,
      apiName: currCredApi.name,
      appIcon: currCredApi.iconUrl,
      data: formValues,
    };

    console.log("Submitting payload:", payload);

    try {
      const res = await axios.post(
        "http://localhost:8888/api/v1/cred/create",
        payload,
        { withCredentials: true }
      );
      console.log("saved", res.data);
    } catch (error) {
      console.error("Error saving credential:", error);
    }
  };

  return (
    <DialogContent className="w-[40%]">
      <DialogHeader>
        <DialogTitle>Add new Credentials</DialogTitle>
        <DialogDescription>
          <Select
            onValueChange={(value) => {
              const selected = credApis.find((c) => c.name === value);
              if (selected) {
                setCredName(value);
                setCredCurrApi(selected);
                setFormValues({}); // reset form when new app selected
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Credentials" />
            </SelectTrigger>
            <SelectContent>
              {credApis.map((cred) => (
                <SelectItem key={cred.name} value={cred.name}>
                  {cred.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="cursor-pointer bg-teal-500 "
              type="button"
              onClick={() => {
                const res = credApis.filter(
                  (credApi) => credApi.name === credName
                );
                setCredCurrApi(res[0]);
              }}
            >
              Continue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col">
              <div className="flex justify-between border-b">
                <div className="flex gap-2 my-3">
                  <div>
                    <img src={currCredApi?.iconUrl} alt="" width={30} />
                  </div>
                  <div>
                    <DialogTitle>{currCredApi?.displayName}</DialogTitle>
                    <DialogDescription className="">
                      {currCredApi?.name}
                    </DialogDescription>
                  </div>
                </div>
                <div>
                  <Button className="mr-10 bg-teal-500" onClick={handleSave}>
                    Save
                  </Button>
                </div>
              </div>

              <div className="w-full flex">
                <div className="w-[20%] py-2 text-xs flex flex-col items-center">
                  <div className="bg-neutral-200 rounded-sm px-2 py-2">
                    Connections
                  </div>
                </div>
                <div className="w-[80%] py-2 ml-1 flex flex-col justify-between items-center text-xs">
                  <div className="bg-teal-100 py-2 px-2 w-full border-l-4 rounded-sm">
                    <div>
                      Need Help? See{" "}
                      <a
                        className="text-blue-600 font-bold"
                        target="_blank"
                        href={currCredApi?.documentationUrl}
                      >
                        Docs
                      </a>
                    </div>
                  </div>
                  <div className="py-2 px-2 w-full rounded-sm">
                    {currCredApi?.properties.map((curr) => (
                      <div key={curr.name} className="my-1">
                        <div>{curr.displayName}</div>
                        {curr.type === "string" ? (
                          <input
                            type="text"
                            placeholder={curr?.placeholder}
                            defaultValue={curr?.default}
                            onChange={(e) =>
                              handleChange(curr.name, e.target.value)
                            }
                            className="bg-neutral-100 px-4 py-1 my-1 w-full border-1 rounded-xs border-neutral-200"
                          />
                        ) : curr.type === "options" ? (
                          <select
                            defaultValue={curr?.default}
                            onChange={(e) =>
                              handleChange(curr.name, e.target.value)
                            }
                            className="bg-neutral-100 px-4 py-1 w-full border rounded border-neutral-200"
                          >
                            {curr.options?.map((opt) => (
                              <option
                                className="bg-neutral-50 py-2"
                                key={opt.value}
                                value={opt.value}
                                title={opt.description}
                              >
                                {opt.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogFooter>
    </DialogContent>
  );
}
