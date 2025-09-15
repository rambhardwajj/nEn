export interface CredentialsI {
  displayName: string;
  documentationUrl: string;
  iconUrl: string;
  name: string;
  properties: PropertiesI[];
  supportedNodes: string[];
}

export interface PropertiesI {
  default?: string;
  required: boolean;
  description: string;
  displayName: string;
  name: string;
  placeholder?: string;
  type?: string;
  options?: any[]
}

export type CredentialSubmitPayload = {
  name: string;       
  apiName: string;     
  data: Record<string, any>; 
};

export type UserCredentials = {
  id : string;
  name: string;
  type: string;
  userId :string;
  createdAt?: Date;
  updatedAt?: Date;
  data : any 
}