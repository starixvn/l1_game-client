import NotificationService from "../../common/auth/NotificationService";
import * as AuthManager from "../../common/auth/AuthManager";
import * as SessionManager from "../../common/auth/SessionManager";
import { appManager } from "../../managers/AppManager";
import BaseMicrositeGame from "../../common/BaseMicrositeGame";
import AudioManager from "../../common/audio/AudioManager";
import GameUtils from "../../common/GameUtils";
import { StorageManager } from "../../managers/StorageManager";

const { ccclass } = cc._decorator;

@ccclass
export default class MicrositeGame extends BaseMicrositeGame {
    protected stopMainAction() {
        super.stopMainAction();
        NotificationService.getInstance().forceKickedOut();
        AuthManager.removeRecheckInInterval();
    }

    protected getMicrositeGameQueryString() {
        const auData = SessionManager.getSession();
        if (!auData.ss) {
            return "";
        }

        const directMode = SessionManager.getDirectMode();
        const audio = AudioManager.getInstance();
        const params = {
            ss: auData.ss,
            uname: auData.username,
            lang: auData.language,
            appType: auData.system,
            ref: directMode?.ref,
            rurl: appManager.checkDirectModeRefData(directMode?.ref) ? directMode?.returnUrl : GameUtils.base64Encode(window.location.href),
            purl: GameUtils.base64Encode(window.location.href),
            musicEnable: audio.musicEnabled,
            sfxEnable: audio.sfxEnabled,
            promotion: StorageManager.get("boosted-odds")
        };

        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => params[key] !== undefined && searchParams.append(key, params[key]));
        const encodedQueryString = GameUtils.base64Encode(searchParams.toString());
        return `?params=${encodedQueryString}`;
    }

    protected async updateSession(data) {
        const session = AuthManager.updateSession(SessionManager.getSession(), data);
        AuthManager.setAuthorizeInfo(session);
        AuthManager.setRecheckInInterval();
        appManager.authorized = await appManager.authorizeByUserService();
    }

    protected loadLobbyScene() {
        cc.director.loadScene("Lobby", () => {
            NotificationService.getInstance()
                .forceConnect()
                .then(() => {
                    appManager.initPromotions();
                });
        });
    }
}
