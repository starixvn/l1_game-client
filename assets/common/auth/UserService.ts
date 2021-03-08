import axios, { AxiosInstance } from "axios";

import * as configs from "../../configs/Configs";

export interface SSOResponse {
    isAuthenticated: boolean;
    username: string;
    language: string;
    ss: string;
}

export default class UserService {
    private static instance: UserService;
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: configs.userServiceUrl
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }

        return this.instance;
    }

    async sso(token: string) {
        const response = await this.axiosInstance.get<SSOResponse>(token);
        return response.data;
    }

    async reCheckIn(session: string, username: string) {}
}
