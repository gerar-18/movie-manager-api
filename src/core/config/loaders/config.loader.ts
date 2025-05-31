import { ConfigLoaderType } from "../types/config-loader.type";

export const configLoader = (): ConfigLoaderType => ({
    server: {
        environment: process.env.NODE_ENV,
        port: parseInt(process.env.PORT, 10),
    },
});
