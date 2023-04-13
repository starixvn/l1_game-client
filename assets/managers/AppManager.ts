import AudioManager from "../common/audio/AudioManager";
import * as authManager from "../common/auth/AuthManager";
import * as sessionManager from "../common/auth/SessionManager";
import NotificationService from "../common/auth/NotificationService";
import { getCacheLanguage, getLanguage, getSession, setLanguage } from "../common/auth/SessionManager";
import UserService from "../common/auth/UserService";
import GameUtils from "../common/GameUtils";
import logger from "../common/logger";
import NameGenerator from "../common/name-generator/NameGenerator";
import { userManager } from "../common/user/UserManager";
import { initialize as initGameConfiguration } from "../configs/GameConfigurations";
import { getLobbyConfigs } from "../lobby/main/view-models/LobbyManager";
import PromotionNotificationsHandler from "../lobby/promotions/PromotionNotificationsHandler";
import { Promotions } from "../lobby/promotions/Promotions";
import { uiManager } from "./GameUIManager";
import { InternalEvents } from "./InternalEvents";
import { UrlInfo } from "./UrlInfo";
import { StorageManager } from "./StorageManager";
const sentryLogger = logger();
class AppManager {
    GAME_IS_SHOWED = true;
    font = {
        increaseMoney: null,
        decreaseMoney: null
    };
    popupMiniGamesLastPosition = cc.v3();
    miniPanel: any;
    currentScene: any;
    resultPage: any;

    urlInfo = {};
    authorized = false;

    _directMode = false;

    private init() {
        sentryLogger.start();
        this.initLanguage();
    }

    private async authorizedInit() {
        AudioManager.getInstance().init();
        this.initShowHideAppEvent();

        await NotificationService.getInstance().connect();
        this.initPromotions();
    }

    initPromotions() {
        Promotions.getInstance().addDataObserver();
        PromotionNotificationsHandler.getInstance().addDataObserver();
        NotificationService.getInstance().emitEvent("promotionNotifications", {});
    }

    get isDirectMode() {
        return this._directMode;
    }

    get directGameId() {
        return this.urlInfo[UrlInfo.DirectGameId] || 0;
    }

    backToOperatorLobby() {
        const url = appManager.urlInfo[UrlInfo.ReturnUrl];
        if (url) {
            window.location.replace(GameUtils.base64Decode(url));
        }
    }

    checkRefData(refData) {
        const directRef = [
            //
            "d_direct",
            "m_direct",
            "d_operator_opendirectly",
            "m_operator_opendirectly"
        ];
        return directRef.some((data) => data === refData);
    }

    forceKickedOut() {
        NotificationService.getInstance().forceKickedOut();
        authManager.signOut();
    }

    async ssoAndAuthorize() {
        this.init();
        await initGameConfiguration();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has(UrlInfo.Ref) && urlParams.has("gameId") && urlParams.get("gameId") !== "0") {
            const gameId = urlParams.get("gameId");
            const refData = urlParams.get(UrlInfo.Ref);
            if (this.checkRefData(refData) && !GameUtils.isMiniGame(gameId)) {
                this.urlInfo[UrlInfo.Ref] = refData;
                this.urlInfo[UrlInfo.DirectGameId] = gameId;
                if (urlParams.has("rurl") && urlParams.get("rurl") !== "") {
                    this.urlInfo[UrlInfo.ReturnUrl] = urlParams.get("rurl");
                }
                this._directMode = true;
            }
        }

        await this.requestSSO();
        await getLobbyConfigs();
        if (window.authData && this.isDirectMode) {
            sessionManager.removeInRoomGameId();
            this.saveDirectModeInfo();
        }
        this.loadDirectModeInfo();
        this.authorized = await this.authorizeByUserService();
        await this.authorizedInit();
    }

    private saveDirectModeInfo() {
        const ss = window.authData.ss;
        const data = {
            ss,
            ref: this.urlInfo[UrlInfo.Ref],
            returnUrl: this.urlInfo[UrlInfo.ReturnUrl],
            directGameId: this.urlInfo[UrlInfo.DirectGameId]
        };
        StorageManager.set("direct_mode", data);
    }

    private loadDirectModeInfo() {
        const data = StorageManager.get("direct_mode");
        if (data) {
            if (window.authData.ss === data.ss) {
                this.urlInfo[UrlInfo.Ref] = data[UrlInfo.Ref];
                this.urlInfo[UrlInfo.ReturnUrl] = data[UrlInfo.ReturnUrl];
                this.urlInfo[UrlInfo.DirectGameId] = data[UrlInfo.DirectGameId];
                this._directMode = true;
            }
        }
    }

    private async autoGenerateName() {
        const name = NameGenerator.generateName();
        const { ss, username } = window.authData;
        const response = await UserService.getInstance().auth.signName(ss, username, name);
        return this.handleAuthorizedResponse(response);
    }

    private async handleAuthorizedResponse(response) {
        if (!response.authorized && this.isDirectMode) {
            return this.autoGenerateName();
        }

        response.user && userManager.updateUser(response.user);
        return response.authorized;
    }

    private async authorizeByUserService() {
        try {
            const { ss, username } = window.authData;
            const response: any = await UserService.getInstance().auth.authorize(ss, username);
            if (authManager.checkUM(response)) {
                return false;
            }

            if (response.isSuccessful !== undefined && !response.isSuccessful) {
                uiManager.emitter.emit(InternalEvents.SIGN_OUT);
                return false;
            }

            return await this.handleAuthorizedResponse(response);
        } catch (error) {
            sentryLogger.logError(error);
            const session = getSession();
            const isSessionExpired = authManager.verifySession(session);

            return !isSessionExpired;
        }
    }

    private requestSSO() {
        return new Promise<void>((resolve) => {
            if (cc.sys.isBrowser && authManager) {
                authManager.checkSSO(() => {
                    if (window.reCheckInId) {
                        clearInterval(window.reCheckInId);
                    }
                    window.reCheckInId = setInterval(() => {
                        authManager.reCheckIn();
                    }, 60 * 1000);

                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    private initLanguage() {
        let language = getCacheLanguage();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lang")) {
            language = getLanguage(urlParams.get("lang") ?? "en-US");
        }
        setLanguage(language);
    }

    private initShowHideAppEvent() {
        const hiddenPropName = ["hidden", "mozHidden", "msHidden", "webkitHidden"].find((key) => typeof document[key] !== "undefined");
        this.GAME_IS_SHOWED = !document[hiddenPropName];
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.GAME_IS_SHOWED = false;
        });

        cc.game.on(cc.game.EVENT_SHOW, () => {
            this.GAME_IS_SHOWED = true;
            UserService.getBalance();
        });
    }
}

export const appManager = new AppManager();
