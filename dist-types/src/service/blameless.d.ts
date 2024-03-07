import { BlamelessAPI, BlamelessConnectionConfig, Service, AuthResponse } from "./types";
export declare class BlamelessService implements BlamelessAPI {
    private readonly authKey;
    private readonly baseurl;
    private access_token;
    readonly interval: number;
    readonly kinds: string[];
    connectionConfig: BlamelessConnectionConfig;
    constructor(connectionConfig: BlamelessConnectionConfig);
    checkTokenExpiry(): Promise<string | null>;
    getNewToken(): Promise<AuthResponse | null>;
    updateServices(services: Service[]): Promise<void>;
}
