export interface CredentialsI {
  displayName: string;
  documentationUrl: string;
  iconUrl: string;
  name: string;
  properties: PropertiesI;
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
  options?: string[]
}

