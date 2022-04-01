import { appContainer } from "../../Application";
import { getCacheLanguage, getLanguage, setLanguage } from "../../common/auth/SessionManager";
import logger from "../../common/logger";
import * as authManager from "./../../common/auth/AuthManager";
import SplashConfig from "./SplashConfig";
import RandonWaitingMessage from "./RandonWaitingMessage";
import MusicPlayer from "../../common/audio/MusicPlayer";

const splashConfig = appContainer.get(SplashConfig);
const sentryLogger = logger();

cc.Class({
    extends: cc.Component,
    properties: {
        messageComp: RandonWaitingMessage,
        manifestUrl: {
            default: null,
            type: cc.Asset
        },
        progressBar: cc.ProgressBar,
        progressLabel: cc.Label,
        sloganSC1: cc.Node,
        sloganSC2: cc.Node,
        _am: null,
        _updating: !1,
        _canRetry: !1,
        _storagePath: ""
    },
    onLoad: function () {
        this.isLoadScene = !1;
        this.isLoadConfig = !1;
        this.initLanguage();
        this.initOneSign();
        sentryLogger.start();
        this.loadAssets();

        this.sloganSC1.active = splashConfig.enabledSC1;
        this.sloganSC2.active = !splashConfig.enabledSC1;
    },
    initLanguage() {
        let language = getCacheLanguage();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lang")) {
            language = getLanguage(urlParams.get("lang") ?? "en-US");
        }
        setLanguage(language);
    },
    initOneSign: function () {
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
    },
    checkPlugin: function () {
        return "undefined" == typeof sdkbox
            ? (console.log("sdkbox is undefined"), !1)
            : void 0 !== sdkbox.PluginOneSignal || (console.log("sdkbox.PluginFacebook is undefined"), !1);
    },
    loadAssets: function () {
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
    },
    loadScene: function () {
        this.loadSceneTimeout = setTimeout(
            function () {
                cc.director.preloadScene("MainGame", this.onProgress.bind(this), this.onLoaded.bind(this));
            }.bind(this),
            100
        );
    },
    onProgress: function (completedCount, totalCount) {
        const percent = completedCount / totalCount;
        this.updateProgress(percent);
    },
    onLoaded: function (err, asset) {
        cc.resources.loadDir("lobby/games", (e, r, u) => {
            cc.resources.loadDir("minipanel/games", (error, resource, urls) => {
                cc.director.loadScene("MainGame");
            });
        });
    },
    onFakeGameLoaded: function (err, asset) {
        cc.director.loadScene("FakeGame");
    },
    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    },
    updateProgress: function (progress) {
        if (this) {
            this.updateProgressBar(progress);
            this.updateProgessLabel(progress);
        }
    },
    updateProgressBar: function (progress) {
        if (this.progressBar) {
            this.progressBar.progress = progress;
        }
    },
    updateProgessLabel: function (progress) {
        if (this.progressLabel) {
            this.progressLabel.string = `${Math.round(progress * 100)}%`;
        }
    }
});
