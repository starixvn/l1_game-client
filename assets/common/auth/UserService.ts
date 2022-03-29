import axios from "axios";

import UserServiceClient from "sc-user-service-client";
import * as sessionManager from "../../common/auth/SessionManager";
import * as Configs from "../../configs/Configs";
import { buildUrlWithPath } from "../helpers/UrlHelper";
import { updateUserBalance } from "./AuthManager";

export default class UserService {
    private static readonly instance: UserServiceClient;

    public static getInstance(): UserServiceClient {
        return this.instance ?? new UserServiceClient(this.getUserServiceUrl());
    }

    public static getGameResult(gameId: number = undefined) {
        let request = this.getRequestOptions();
        request["language"] = sessionManager.getLocale();
        if (gameId) {
            request["gameId"] = gameId;
        }

        axios.post(`${this.getUserServiceUrl()}/game-result/access-url`, request).then((response) => {
            cc.RedT.MiniPanel.redirectToResultPage(response.data.gameResult.redirectUrl);
        });
    }

    public static getBalance() {
        let request = this.getRequestOptions();
        axios.post(`${this.getUserServiceUrl()}/auth/balance`, request).then((response) => {
            updateUserBalance(response.data);
        });
    }

    private static getUserServiceUrl(): string {
        const path = Configs.env === "" ? "/user" : `/${Configs.env}/user`;
        return buildUrlWithPath(path);
    }

    private static getRequestOptions(): object {
        return {
            session: window.authData.ss,
            username: window.authData.username,
            browserUserAgent: window.navigator.userAgent
        };
    }
}
