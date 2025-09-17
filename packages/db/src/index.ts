
import { PrismaClient } from "@prisma/client";
export  type{ CredentialsI,PropertiesI, CredentialSubmitPayload , UserCredentials,IEdge,INode, Measured,NodeData,Position,Workflow } from "./types"

export const prisma = new PrismaClient();

async function connectPrismaClient() {
    try {
        await prisma.$connect()
    } catch (error) {
        console.log("PRISMA CLIENT COULD NOT CONNECT", error)
    }
}

connectPrismaClient();