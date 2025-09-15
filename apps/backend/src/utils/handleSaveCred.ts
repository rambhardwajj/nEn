import { CustomError } from "./CustomError";
import type{UserCredentials} from "@repo/db"

export const returnSaveCred = (userId: string, data: any) => {
  if (!userId || !data)
    throw new CustomError(
      404,
      "UserId or Data details not found for creating Credentilas "
    );

    if( data.name === "Telegram"){
      const res = {
        name: data.name,
        userId: userId,
        
      }

    }

};
