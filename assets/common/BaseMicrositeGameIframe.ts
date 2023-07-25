import { buildMicrositeGameUrl } from "./helpers/UrlHelper";
import { StorageManager } from "../managers/StorageManager";
import AudioManager from "./audio/AudioManager";
import GameUtils from "./GameUtils";
import * as SessionManager from "./auth/SessionManager";
import CustomWebView from "./CustomWebView";

const { ccclass, property } = cc._decorator;

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
};

const WebviewEventType = {
    LOADING: "loading",
    LOADED: "loaded"
};

@ccclass
export default class BaseMicrositeGameIframe extends cc.Component {
    @property(CustomWebView)
    webview: CustomWebView = null;

    private readonly MusicStorageKey = "SOUND_BACKGROUND";
    private readonly SFXStorageKey = "SOUND_GAME";
    private micrositeUrl = "";
    private isLoadingLobby = false;

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
        this.webview?.node.on(WebviewEventType.LOADED, this.onLoadedWebView.bind(this), this);
    }

    protected onDestroy(): void {
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

    protected onLoadedWebView() {
        //
    }

    protected async handleEvent({ data }: { data: MicrositeGameParams }) {
        if (data.sessionTimeout) {
            this.handleSignOut();
            return;
        }
        if (data.backLobby && !this.isLoadingLobby) {
            this.isLoadingLobby = true;
            await this.handleBackToLobby(data);
            return;
        }
        this.handleChangeAudio(data);
        data.copyToClipboard && this.handleCopyToClipboard(data.copyToClipboard);
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

    private async handleCopyToClipboard(text: string) {
        const copySuccessfully = await GameUtils.copyText(text);
        this.webview?._impl._iframe.contentWindow.postMessage({ copySuccessfully }, this.micrositeUrl);
    }
}
