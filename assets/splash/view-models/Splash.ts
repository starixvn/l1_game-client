import { appContainer } from "../../Application";
import AudioManager from "../../common/audio/AudioManager";
import * as authManager from "../../common/auth/AuthManager";
import { getCacheLanguage, getLanguage, setLanguage } from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import logger from "../../common/logger";
import { initialize } from "../../configs/GameConfigurations";
import LobbyMenuConfig from "../../lobby/main/view-models/LobbyMenuConfig";
import RandomWaitingMessage from "./RandonWaitingMessage";
import SplashConfig from "./SplashConfig";

const splashConfig = appContainer.get(SplashConfig);
const sentryLogger = logger();
const lobbyMenuConfig = appContainer.get(LobbyMenuConfig);

const { ccclass, property } = cc._decorator;

@ccclass
export default class Splash extends cc.Component {
    @property(RandomWaitingMessage)
    messageComp: RandomWaitingMessage = null;

    @property(cc.Asset)
    manifestUrl: cc.Asset = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Node)
    sloganSC1: cc.Node = null;

    @property(cc.Node)
    sloganSC2: cc.Node = null;

    private loadSceneTimeout: any;

    protected onLoad(): void {
        AudioManager.getInstance().init();
        this.initLanguage();
        this.initOneSign();
        sentryLogger.start();
        this.loadAssets();

        this.sloganSC1.active = splashConfig.enabledSC1;
        this.sloganSC2.active = !splashConfig.enabledSC1;
    }

    initLanguage() {
        let language = getCacheLanguage();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lang")) {
            language = getLanguage(urlParams.get("lang") ?? "en-US");
        }
        setLanguage(language);
    }

    initOneSign() {
        if (this.checkPlugin()) {
            sdkbox.PluginOneSignal.init();
            sdkbox.PluginOneSignal.setListener({
                onSendTag: function (t, e, i) {},
                onGetTags: function (t) {},
                onIdsAvailable: function (t, e) {},
                onPostNotification: function (t, e) {},
                onNotification: function (t, e, i) {}
            });
        }
    }

    checkPlugin() {
        return "undefined" == typeof sdkbox
            ? (console.log("sdkbox is undefined"), !1)
            : void 0 !== sdkbox.PluginOneSignal || (console.log("sdkbox.PluginFacebook is undefined"), !1);
    }

    loadAssets() {
        this.updateProgress(0.038);
        this.progressBar.node.getChildByName("progress-bar").getComponent(cc.Sprite).enabled = false;
        if (cc.sys.isBrowser && authManager) {
            authManager.checkSSO(this.messageComp, () => {
                this.loadScene();
                if (window.reCheckInId) {
                    clearInterval(window.reCheckInId);
                }
                window.reCheckInId = setInterval(() => {
                    authManager.reCheckIn();
                }, 60 * 1000);
            });
        } else {
            this.loadScene();
        }
    }

    loadScene() {
        this.loadSceneTimeout = setTimeout(
            function () {
                cc.director.preloadScene("MainGame", this.onProgress.bind(this), this.onLoaded.bind(this));
            }.bind(this),
            100
        );
    }

    onProgress(completedCount, totalCount) {
        this.progressBar.node.getChildByName("progress-bar").getComponent(cc.Sprite).enabled = true;
        const percent = completedCount / totalCount;
        this.updateProgress(percent);
    }

    async onLoaded() {
        await initialize();
        await this.preLoadBanner();
        await this.preLoadGameIcons();

        cc.resources.loadDir("lobby/games/skeleton-icon", () => {
            cc.director.loadScene("MainGame");
        });
    }

    private async preLoadGameIcons() {
        try {
            const preLoadGameCount = 10;
            const preLoadGameIds =
                lobbyMenuConfig.list?.length >= preLoadGameCount ? lobbyMenuConfig.list.slice(0, preLoadGameCount) : lobbyMenuConfig.list;

            const preLoadGameAwaiters = preLoadGameIds.map((gameId) => GameUtils.loadGameIcon(gameId));

            const preLoadGameBySystemAwaiters = preLoadGameIds
                .filter((gameId) => lobbyMenuConfig.customGameIconBySystem.includes(gameId))
                .map((gameId) => GameUtils.loadGameIcon(gameId, splashConfig.customPath));

            await Promise.all(preLoadGameAwaiters.concat(preLoadGameBySystemAwaiters));
        } catch (ex) {
            console.log(ex);
        }
    }

    private async preLoadBanner() {
        try {
            const bannerId = lobbyMenuConfig.bannerAds[0];
            const spriteAwaiters = GameUtils.getBanner(lobbyMenuConfig, bannerId);
            const bannerContainerAwaiters = new Promise((resolve) => {
                cc.resources.load("lobby/banner/bannerContainer", resolve);
            });
            await Promise.all([spriteAwaiters, bannerContainerAwaiters]);
        } catch (ex) {
            console.log(ex);
        }
    }

    updateProgress(progress) {
        if (this) {
            this.updateProgressBar(progress);
        }
    }

    updateProgressBar(progress) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
    }

    protected onDestroy(): void {
        clearTimeout(this.loadSceneTimeout);
    }
}
