import { Entity } from "@backstage/catalog-model";
import { BlamelessAPI, BlamelessConnectionConfig, AuthResponse, BlamelessIncident } from "./types";

export class BlamelessService implements BlamelessAPI {
    // connection config from env variables
    private readonly authKey: string;  
    private readonly baseurl: string;
    private access_token: string | null;

    public readonly interval: number;
    public readonly kinds: string[];

    connectionConfig: BlamelessConnectionConfig;
    constructor(connectionConfig: BlamelessConnectionConfig) {
        this.connectionConfig = connectionConfig;
        this.authKey = this.connectionConfig.config.getString('blameless.authKey');
        this.interval = this.connectionConfig.config.getNumber('blameless.interval');
        this.baseurl = this.connectionConfig.config.getString('blameless.baseUrl');
        this.kinds = this.connectionConfig.config.getOptionalStringArray('blameless.kinds') || ["Component"];
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
        return await fetch(`${this.baseurl}/api/v2/identity/token`, {
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

    async updateServices(entities: Entity[]): Promise<void> {
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
            body: JSON.stringify(entities),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (response.status === 204) {
                this.connectionConfig.logger.info('Blameless services updated');
            } else {
                this.connectionConfig.logger.error('Failed to update blameless services');
            }
        })
        .catch(error => {
            this.connectionConfig.logger.error(error);
        });
    }

    async getIncidents(): Promise<BlamelessIncident[]> {
        // get incidents from blameless
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
        return await fetch(`${this.baseurl}/api/v1/incidents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(async response => {
            if (response.status === 200) {
                const data = await response.json();
                this.connectionConfig.logger.info('Incidents received');
                // format the date to file BlamelessIncident type
                const incidents: BlamelessIncident[] = [];
                data.forEach((incident: any) => {
                    const formattedIncident = {
                        id: incident._id,
                        title: incident.summary,
                        status: incident.status,
                        severity: incident.severity,
                        incident_type: incident.type,
                        created_at: incident.created.$date,
                        postmortem_url: `${this.baseurl}/retrospective/${incident._id}`
                    };
                    incidents.push(formattedIncident);
                });
                return incidents;
            }
            this.connectionConfig.logger.error('Failed to get incidents');
            return [];
        })
        .catch(error => {
            this.connectionConfig.logger.error(error);
            return [];
        });
    }
}