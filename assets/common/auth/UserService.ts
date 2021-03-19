import axios, { AxiosInstance } from "axios";

import * as configs from "../../configs/Configs";

export interface SSOResponse {
    isAuthenticated: boolean;
    username: string;
    language: string;
    ss: string;
}

export interface ReCheckInResponse {
    isSuccessful: boolean;
    message: string;
    balance: number;
    isDisableAccount: boolean;
    apiError: APIError;
}

export interface APIError {
    errorCode: number | string;
    errorMessage: string;
}

export interface AuthorizeResponse {
    authorized: boolean;
    user: any;
}

export interface SignNameResponse {
    isSuccessful: boolean;
    message: string;
    user: any;
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
        const response = await this.axiosInstance.get<SSOResponse>(`/auth/sso?token=${token}`);
        return response.data;
    }

    async reCheckIn(session: string, username: string) {
        const request = {
            session,
            username,
            browserUserAgent: navigator.userAgent
        };
        const response = await this.axiosInstance.post<ReCheckInResponse>("/auth/reCheckIn", request);
        return response.data;
    }

    async authorize(session: string, username: string) {
        const request = {
            session,
            username,
            browserUserAgent: navigator.userAgent
        };
        const response = await this.axiosInstance.post<AuthorizeResponse>("/auth/authorize", request);
        return response.data;
    }

    async signName(session: string, username: string, nickname: string) {
        const request = {
            session,
            username,
            nickname,
            browserUserAgent: navigator.userAgent
        };
        const response = await this.axiosInstance.post<SignNameResponse>("/auth/signName", request);
        return response.data;
    }
}
