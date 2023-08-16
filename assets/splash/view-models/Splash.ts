const { ccclass, property } = cc._decorator;
import axios from "axios";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import * as SessionManager from "../../common/auth/SessionManager";
import { buildProxyUrl } from "../../common/helpers/UrlHelper";
import GameUtils from "../../common/GameUtils";

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    mainSplashNode: cc.Node = null;

    @property(cc.Node)
    micrositeGameNode: cc.Node = null;

    @property(cc.Prefab)
    micrositeGameIframe: cc.Prefab = null;

    protected onLoad(): void {
        this.initUIListeners();
        this.handleSplashScene();
    }

    private initUIListeners() {
        uiManager.emitterListener(InternalEvents.MICROSITE_BACK_TO_LOBBY, this.enableMainSplashScreen.bind(this), this);
    }

    private clearUIListeners() {
        uiManager.removeListenersWithTarget(this);
    }

    protected onDestroy(): void {
        this.clearUIListeners();
    }

    private async handleSplashScene() {
        if (await this.isOpenMicrositeGame()) {
            this.enableMicrositeGameIframe();
        } else {
            this.enableMainSplashScreen();
        }
    }

    private enableMicrositeGameIframe() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("gameId")) {
            const gameId = +urlParams.get("gameId");
            SessionManager.storeMicrositeGameId(gameId);
        }
        const iframe = cc.instantiate(this.micrositeGameIframe);
        this.micrositeGameNode.addChild(iframe);
        this.micrositeGameNode.active = true;
        this.mainSplashNode.active = false;
        setTimeout(() => {
            this.background.active = false;
        }, 100);
    }

    private enableMainSplashScreen() {
        this.background.active = true;
        this.mainSplashNode.active = true;
        this.micrositeGameNode.destroyAllChildren();
        this.micrositeGameNode.active = false;
    }

    private async isOpenMicrositeGame() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("token") && urlParams.has("gameId") && urlParams.get("gameId") !== "0") {
            const gameId = +urlParams.get("gameId");
            if (await this.isMicrositeGame(gameId)) {
                return GameUtils.healthCheckMicrositeGame(gameId);
            }
            return false;
        }
        return !urlParams.has("token") && +SessionManager.getMicrositeGameId() > 0;
    }

    async isMicrositeGame(gameId) {
        const url = buildProxyUrl(`/game/configurations/${gameId}`);
        const configuration = await axios
            .get(url)
            .then((response) => response.data)
            .catch(() => ({}));
        return configuration.isMicrosite;
    }
}
