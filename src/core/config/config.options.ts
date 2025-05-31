import { ConfigModuleOptions } from "@nestjs/config";
import { configSchema } from "./config.schema";
import { configLoader } from "./loaders/config.loader";

export const configModuleOptions: ConfigModuleOptions = {
    envFilePath: ".env",
    isGlobal: true,
    validationOptions: {
        allowUnknown: true,
        abortEarly: false,
    },
    validationSchema: configSchema,
    load: [configLoader],
    cache: true,
};
