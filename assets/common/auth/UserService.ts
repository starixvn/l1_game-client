import axios from "axios";

import UserServiceClient from "sc-user-service-client";
import * as sessionManager from "../../common/auth/SessionManager";
import * as Configs from "../../configs/Configs";
import { buildUrlWithPath } from "../helpers/UrlHelper";
import { updateUserBalance } from "./AuthManager";

export default class UserService {
    private static readonly instance: UserServiceClient;

    public static getInstance(): UserServiceClient {
        const path = Configs.env === "" ? "/user" : `/${Configs.env}/user`;
        const userServiceUrl = buildUrlWithPath(path);
        return this.instance ?? new UserServiceClient(userServiceUrl);
    }

    public static getGameResult(gameId: number = undefined) {
        let request = this.createRequestOptions();
        request["language"] = sessionManager.getLocale();
        if (gameId) {
            request["gameId"] = gameId;
        }

        axios.post(`${this.createUserServiceUrl()}/game-result/access-url`, request).then((response) => {
            cc.RedT.MiniPanel.redirectToResultPage(response.data.gameResult.redirectUrl);
        });
    }

    public static getBalance() {
        let request = this.createRequestOptions();
        axios.post(`${this.createUserServiceUrl()}/auth/balance`, request).then((response) => {
            updateUserBalance(response.data);
        });
    }

    private static createUserServiceUrl(): string {
        const path = Configs.env === "" ? "/user" : `/${Configs.env}/user`;
        return buildUrlWithPath(path);
    }

    private static createRequestOptions(): object {
        return {
            session: window.authData.ss,
            username: window.authData.username,
            browserUserAgent: window.navigator.userAgent
        };
    }
}
