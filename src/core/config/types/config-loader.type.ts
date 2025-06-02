import { DatabaseConfigType } from "./database-config.type";
import { JwtConfigType } from "./jwt-config.type";
import { ServerConfigType } from "./server-config.type";

export type ConfigLoaderType = {
    server: ServerConfigType;
    database: DatabaseConfigType;
    jwt: JwtConfigType;
};
