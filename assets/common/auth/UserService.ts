import UserServiceClient from "sc-user-service-client";

import * as Configs from "../../configs/Configs";
import { buildUrlWithPath } from "../helpers/UrlHelper";

export default class UserService {
    private static readonly instance: UserServiceClient;

    public static getInstance(): UserServiceClient {
        const path = Configs.env === "" ? "/user" : `/${Configs.env}/user`;
        const userServiceUrl = buildUrlWithPath(path);
        return this.instance ?? new UserServiceClient(userServiceUrl);
    }
}
