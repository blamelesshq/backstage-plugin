import { BlamelessAPI, BlamelessConnectionConfig, Service, AuthResponse } from "./types";

export class BlamelessService implements BlamelessAPI {
    // connection config from env variables
    private readonly authKey: string;  
    private readonly authUrl: string; 
    public readonly interval: number;
    private readonly baseurl: string;
    private access_token: string | null;

    connectionConfig: BlamelessConnectionConfig;
    constructor(connectionConfig: BlamelessConnectionConfig) {
        this.connectionConfig = connectionConfig;
        this.authKey = this.connectionConfig.config.getString('blameless.auth.key');
        this.authUrl = this.connectionConfig.config.getString('blameless.auth.url');
        this.interval = this.connectionConfig.config.getNumber('blameless.interval');
        this.baseurl = this.connectionConfig.config.getString('blameless.baseUrl');
        this.access_token = null;
    }

    async checkTokenExpiry(): Promise<string | null> {
        // check if token is expired
        this.connectionConfig.logger.info('Checking token expiry');
        if (this.access_token) {
            const token = this.access_token;
            const tokenData = token.split('.')[1];
            const decodedToken = Buffer.from(tokenData, 'base64').toString();
            const tokenObj = JSON.parse(decodedToken);
            const expiry = tokenObj.exp;
            const current = Math.floor(Date.now() / 1000);
            if (expiry < current) {
                this.connectionConfig.logger.info('Token expired!');
                this.access_token = null;
                this.connectionConfig.logger.info('Token expired');
                return null;
            }
            this.connectionConfig.logger.info('Token not expired');
            return token;
        }
        return null;
    }

    async getNewToken(): Promise<AuthResponse | null> {
        // get new token from blameless
        return await fetch(`${this.authUrl}/v2/identity/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.authKey,
            },
        })
        .then(async response => {
            const data: AuthResponse | null = await response.json();
            if (response.status === 200) {
                this.connectionConfig.logger.info('New token received');
                return data;
            }
            this.connectionConfig.logger.error('Failed to get new token error: ', data);
            return null;
        })
        .catch(error => {
            this.connectionConfig.logger.error('Failed to get new token error: ', error);
            return null;
        });
    };

    async updateServices(services: Service[]): Promise<void> {
        // update blameless services
        let token: string;
        const tokenData = await this.checkTokenExpiry();
        if (tokenData) {
            token = tokenData;
        } else{
            const data = await this.getNewToken();
            if (!data) {
                throw new Error('Failed to get new token');
            }
            else {
                token = data.access_token;
                this.access_token = token;
            }
        }
        // update blameless services
        return await fetch(`${this.baseurl}/api/v2/integrations/services/backstage`, {
            method: 'PUT',
            body: JSON.stringify({
                services,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.status === 200) {
                this.connectionConfig.logger.info('Blameless services updated');
            } else {
                this.connectionConfig.logger.error('Failed to update blameless services');
            }
        })
        .catch(error => {
            this.connectionConfig.logger.error(error);
            throw new Error('Failed to update blameless services');
        });
    }
}