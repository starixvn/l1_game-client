import { appContainer, lazyInject } from "../../Application";
import * as baseControl from "../../BaseController";
import AudioManager from "../../common/audio/AudioManager";
import * as authManager from "../../common/auth/AuthManager";
import { getCacheLanguage, getLanguage, setLanguage } from "../../common/auth/SessionManager";
import UserService from "../../common/auth/UserService";
import GameUtils from "../../common/GameUtils";
import logger from "../../common/logger";
import { initialize } from "../../configs/GameConfigurations";
import { getLobbyConfigs } from "../../lobby/main/view-models/LobbyManager";
import LobbyMenuConfig from "../../lobby/main/view-models/LobbyMenuConfig";
import RandomWaitingMessage from "./RandonWaitingMessage";
import SplashConfig from "./SplashConfig";

const splashConfig = appContainer.get(SplashConfig);
const sentryLogger = logger();

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

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    private loadSceneTimeout: any;

    protected onLoad(): void {
        AudioManager.getInstance().init();
        this.initLanguage();
        sentryLogger.start();
        this.loadAssets();

        this.sloganSC1.active = splashConfig.enabledSC1;
        this.sloganSC2.active = !splashConfig.enabledSC1;
    }

    initRedT() {
        cc.RedT = baseControl;
        cc.RedT.init();
        this.initShowHideAppEvent();
    }

    initShowHideAppEvent() {
        const hiddenPropName = ["hidden", "mozHidden", "msHidden", "webkitHidden"].find((key) => typeof document[key] !== "undefined");
        cc.RedT.GAME_IS_SHOWED = !document[hiddenPropName];
        cc.game.on(cc.game.EVENT_HIDE, () => {
            cc.RedT.GAME_IS_SHOWED = false;
        });

        cc.game.on(cc.game.EVENT_SHOW, () => {
            cc.RedT.GAME_IS_SHOWED = true;
            UserService.getBalance();
        });
    }

    initLanguage() {
        let language = getCacheLanguage();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("lang")) {
            language = getLanguage(urlParams.get("lang") ?? "en-US");
        }
        setLanguage(language);
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

    async onLoaded() {
        await initialize();
        this.initRedT();
        await getLobbyConfigs();
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
                this.lobbyMenuConfig.list?.length >= preLoadGameCount
                    ? this.lobbyMenuConfig.list.slice(0, preLoadGameCount)
                    : this.lobbyMenuConfig.list;

            const preLoadGameAwaiters = preLoadGameIds.map((gameId) => GameUtils.loadGameIcon(gameId));

            const preLoadGameBySystemAwaiters = preLoadGameIds
                .filter((gameId) => this.lobbyMenuConfig.customGameIconBySystem.includes(gameId))
                .map((gameId) => GameUtils.loadGameIcon(gameId, splashConfig.customPath));

            await Promise.all(preLoadGameAwaiters.concat(preLoadGameBySystemAwaiters));
        } catch (ex) {
            console.log(ex);
        }
    }

    private async preLoadBanner() {
        try {
            const bannerId = this.lobbyMenuConfig.bannerAds[0];
            const spriteAwaiters = GameUtils.getBanner(this.lobbyMenuConfig, bannerId);
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
