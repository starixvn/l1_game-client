import { StorageManager } from "../managers/StorageManager";
import AudioManager from "./audio/AudioManager";
import GameUtils from "./GameUtils";
import * as SessionManager from "./auth/SessionManager";
import CustomWebView from "./CustomWebView";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import { initialize as initGameConfiguration } from "../configs/GameConfigurations";
import { lazyInject } from "../Application";
import { appManager } from "../managers/AppManager";
import SocketIOController from "../SocketIOController";
import JoinGameHelper from "./JoinGameHelper";
import { buildMicrositeGameUrl } from "./helpers/UrlHelper";

const { ccclass, property } = cc._decorator;

declare global {
    interface Window {
        microsite: any;
    }
}

export type MicrositeGameParams = {
    backLobby?: boolean;
    ss?: string;
    time?: number;
    username?: string;
    isAuthenticated?: boolean;
    memberName?: string;
    language?: string;
    musicEnable?: boolean;
    sfxEnable?: boolean;
    sessionTimeout?: boolean;
    copyToClipboard?: string;
    hasSSO?: boolean;
    getGameName?: number;
    replaceUrl?: string;
    gameId?: number;
    promotion?: string;
};

const WebviewEventType = {
    LOADING: "loading"
};

@ccclass
export default class BaseMicrositeGameIframe extends cc.Component {
    @property(CustomWebView)
    webview: CustomWebView = null;

    private readonly MusicStorageKey = "SOUND_BACKGROUND";
    private readonly SFXStorageKey = "SOUND_GAME";
    private micrositeUrl = "";
    private isLoadingLobby = false;

    @lazyInject(SocketIOController)
    private readonly socketIOControler: SocketIOController;

    protected onLoad(): void {
        this.stopMainAction();
        this.loadMicrositeGame();
        window.addEventListener("message", this.handleEvent.bind(this));
        this.webview?.node.on(
            WebviewEventType.LOADING,
            () => {
                this.webview._impl._iframe.id = "microsite";
            },
            this
        );
    }

    protected onDestroy(): void {
        window.microsite = {};
        window.removeEventListener("message", this.handleEvent.bind(this));
    }

    protected stopMainAction() {
        const audio = AudioManager.getInstance();
        audio.stopMusic();
        audio.stopAllSFX();
    }

    protected loadMicrositeGame() {
        this.micrositeUrl = buildMicrositeGameUrl(SessionManager.getMicrositeGameId());
        const queryString = this.getMicrositeGameQueryString();
        this.webview && (this.webview.url = `${this.micrositeUrl}/${queryString}`);
    }

    protected async handleEvent({ data }: { data: MicrositeGameParams }) {
        if (data.replaceUrl) {
            window.location.replace(data.replaceUrl);
        }
        if (data.hasSSO) {
            window.microsite = { hasSSO: true };
            return;
        }
        if (data.sessionTimeout) {
            this.handleSignOut();
            return;
        }

        if (data.gameId > 0) {
            StorageManager.set("boosted-odds", data.promotion);
            this.onClickJoinGame(data.gameId);
            return;
        }

        if (data.backLobby && !this.isLoadingLobby) {
            this.isLoadingLobby = true;
            await this.handleBackToLobby(data);
            return;
        }
        if (data.getGameName) {
            this.getGameName(data.getGameName, data.language);
            return;
        }
        if (data.copyToClipboard) {
            this.handleCopyToClipboard(data.copyToClipboard);
            return;
        }
        this.handleChangeAudio(data);
    }

    protected getMicrositeGameQueryString() {
        return "";
    }

    protected async handleBackToLobby(data: MicrositeGameParams) {
        SessionManager.removeMicrositeGameId();
        await this.updateSession(data);
        AudioManager.getInstance().initDefaultStorage();
        this.loadLobbyScene();
    }

    protected async updateSession(session: MicrositeGameParams) {
        //
    }

    protected loadLobbyScene() {
        //
    }

    private handleChangeAudio(data: MicrositeGameParams) {
        data.musicEnable !== undefined && StorageManager.set(this.MusicStorageKey, data.musicEnable);
        data.sfxEnable !== undefined && StorageManager.set(this.SFXStorageKey, data.sfxEnable);
    }

    private handleSignOut() {
        SessionManager.removeMicrositeGameId();
        SessionManager.removeSession();
    }

    private postMessageToMicrosite(data: any) {
        this.webview?._impl._iframe.contentWindow.postMessage(data, this.micrositeUrl);
    }

    private async handleCopyToClipboard(text: string) {
        const copySuccessfully = await GameUtils.copyText(text);
        this.postMessageToMicrosite({ copySuccessfully });
    }

    private async getGameName(gameId: number, language = "en") {
        window.gameConfigurations === undefined && (await initGameConfiguration());
        i18n.init(language);
        const gameName = await GameUtils.getDisplayGameName(gameId);
        this.postMessageToMicrosite({ gameName });
    }

    protected async onClickJoinGame(gameId: number) {
        const joinGameHelper = new JoinGameHelper();
        if (!GameUtils.isMiniGame(gameId.toString())) {
            await joinGameHelper.joinGameIsNotMiniGame(gameId, this.socketIOControler);
        } else {
            cc.director.loadScene("Lobby", () => {
                GameUtils.openGame(joinGameHelper.getGameId(gameId), appManager.miniPanel);
            });
        }
    }
}
