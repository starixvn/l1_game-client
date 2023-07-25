import * as AuthManager from "../../common/auth/AuthManager";
import * as SessionManager from "../../common/auth/SessionManager";
import BaseMicrositeGameIframe from "../../common/BaseMicrositeGameIframe";
import GameUtils from "../../common/GameUtils";
import { appManager } from "../../managers/AppManager";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import { UrlInfo } from "../../managers/UrlInfo";

const { ccclass } = cc._decorator;

@ccclass
export default class MicrositeGameIframe extends BaseMicrositeGameIframe {
    protected onLoadedWebView() {
        cc.director.emit("event_after_enable_scene");
    }

    protected getMicrositeGameQueryString() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token")) {
            AuthManager.clearQueryStringOnUrl();
            const returnMainLobbyUrl =
                urlParams.has(UrlInfo.Ref) && appManager.checkDirectModeRefData(urlParams.get(UrlInfo.Ref))
                    ? ""
                    : `&rurl=${GameUtils.base64Encode(window.location.href)}`;
            return `?${urlParams.toString()}${returnMainLobbyUrl}`;
        } else {
            return "";
        }
    }

    protected async updateSession(session) {
        AuthManager.updateSession(SessionManager.getSession(), session);
        SessionManager.removeDirectMode();
    }

    protected loadLobbyScene() {
        uiManager.emitter.emit(InternalEvents.MICROSITE_BACK_TO_LOBBY);
    }
}
