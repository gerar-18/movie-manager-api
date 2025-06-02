import { ConfigLoaderType } from "../types/config-loader.type";

export const configLoader = (): ConfigLoaderType => ({
    server: {
        environment: process.env.NODE_ENV,
        port: parseInt(process.env.PORT, 10),
    },
    database: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: process.env.DB_SYNCHRONIZE === "true",
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
});
