import { appContainer } from "../../Application";
import { getCacheLanguage, getLanguage, setLanguage } from "../../common/auth/SessionManager";
import logger from "../../common/logger";
import * as authManager from "../../common/auth/AuthManager";
import RandomWaitingMessage from "./RandonWaitingMessage";
import SplashConfig from "./SplashConfig";

const splashConfig = appContainer.get(SplashConfig);
const sentryLogger = logger();

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        reCheckInId: any;
    }
}

@ccclass
export default class Splash extends cc.Component {
    @property(RandomWaitingMessage)
    messageComp: RandomWaitingMessage;

    @property(cc.Asset)
    manifestUrl: cc.Asset = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Node)
    sloganSC1: cc.Node;

    @property(cc.Node)
    sloganSC2: cc.Node;

    private loadSceneTimeout: any;

    protected onLoad(): void {
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
        this.updateProgress(0);
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
        const percent = completedCount / totalCount;
        this.updateProgress(percent);
    }

    onLoaded() {
        cc.resources.loadDir("lobby/games/skeleton-icon", () => {
            cc.director.loadScene("MainGame");
        });
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
