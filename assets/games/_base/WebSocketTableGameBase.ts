import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../Application";
import MusicPlayer from "../../common/audio/MusicPlayer";
import * as sessionManager from "../../common/auth/SessionManager";
import GameUtils from "../../common/GameUtils";
import { InGameMenuEvents } from "../../common/in-game-menu/InGameMenu";
import { NoticeData } from "../../common/notice/view-models/Notice";
import UmWarning from "../../common/um-warning/UmWarning";
import NoticeUtil from "../../common/utils/NoticeUtil";
import SocketIOController from "../../SocketIOController";
import {
    closeGame,
    initMusicBackground,
    loadMiniPanel,
    loadUserData,
    onUserProfileInitialized,
    outRoomGame,
} from "./action/GameRoomActions";
import GameBase from "./GameBase";
import { GameBasePlayerHandler } from "./handlers/GameBasePlayerHandler";
import RoomPlayer from "./view-models/RoomPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WebSocketTableGameBase extends GameBase {
    @property({ type: UmWarning, visible: false, override: true })
    umNotice: UmWarning = null;

    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node })
    otherPlayers: cc.Node = null;

    @property(cc.Prefab)
    miniPanelPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniPanelContainer: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.Prefab)
    winningPlayerEffectPrefab: cc.Prefab = null;

    @property(cc.AudioSource)
    musicBg: cc.AudioSource = null;

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    protected get WinningAnimationDuration() {
        return 3;
    }

    playerHandler: GameBasePlayerHandler;

    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        cc.RedT && (cc.RedT.inGame = this);
        loadMiniPanel(this)();
        this.loadUserData(cc.RedT?.user);
        this.players.forEach((player) => (player.node.active = false));
        initMusicBackground(this)();
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.inGame = null;
    }

    initHandlers() {
        super.initHandlers();

        this.playerHandler = new GameBasePlayerHandler(this);
    }

    onDisconnected() {
        this.closeGame();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);

        const gameData = data[this.gameName];
        if (gameData) {
            this.onDataGameRoom(gameData);
            const apiErrorGameData = gameData.apiError;
            if (apiErrorGameData) {
                if (this.updateUserStakeLevel(apiErrorGameData)) {
                    this.showMiniWarningLimitBetChanged();
                }
            }
        }
    }

    onUserProfileInitialized(node: cc.Node) {
        onUserProfileInitialized(this)(node);
    }

    showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        const message = NoticeUtil.getMessageByLocale(data.um_message);

        const text = message ? message : i18n.t("messages.disabledGame");
        const noticeData = { text: text, button: { text: "OK" } } as NoticeData;
        noticeData.button = { text: "OK" };
        this.showNotice(
            noticeData,
            () => {
                this.onCloseGameClick();
            },
            () => {
                this.onCloseGameClick();
            }
        );
    }

    showNotice(noticeData: NoticeData, onClickOk: () => void, onClose: () => void) {
        this.currentMiniPanel.showNotice(noticeData, onClickOk, onClose);
    }

    onCloseGameClick() {
        if (this.musicBg) {
            MusicPlayer.getInstance().handleIncreaseVolume();
        }
        this.closeGame();
        sessionManager.removeInRoomGameId();
    }

    closeGame() {
        closeGame(this)();
    }

    outRoomGame() {
        return outRoomGame(this)();
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.userProfile.node, false, bet, 1, 80);
    }

    showWinningBet(bet: number) {
        const winningBet = GameUtils.addFlyingText(this.userProfile.node, true, bet, this.WinningAnimationDuration, 80, 10);
        winningBet.name = "winningBet";
    }

    clearWinningBet() {
        const winningBet = this.userProfile.node.getChildByName("winningBet");
        if (winningBet) {
            winningBet.destroy();
        }
    }

    clearWinningEffect() {
        const winningEffect = this.userProfile.node.getChildByName("winningEffect");
        if (winningEffect) {
            winningEffect.destroy();
        }
    }

    protected onGameHide() {
        super.onGameHide();
        this.closeGame();
    }

    protected onDataGameRoomGeneral(data: any) {
        if (data.user) {
            this.loadUserData(data.user);
            cc.RedT.userData(data.user);
        }

        if (data.kickedOut || data.apiError) {
            this.unlockBet();
            this.showProcessingWarning(false);
        }

        if (data.apiError) {
            if (this.updateUserStakeLevel(data.apiError)) {
                this.showMiniWarningLimitBetChanged();
            }
        }

        if (data.userStakeLevel) {
            if (
                data.userStakeLevel.minBet !== cc.RedT.userStakeLevel.minBet ||
                data.userStakeLevel.maxBet !== cc.RedT.userStakeLevel.maxBet
            ) {
                if (this.updateUserStakeLevel(data.userStakeLevel)) {
                    this.showMiniWarningLimitBetChanged();
                }
            }
        }
    }

    protected onDataGameRoom(data: any) {
        super.onData(data);

        if (this.players && this.players.length > 0) {
            this.playerHandler && this.playerHandler.handle(data);
        }
    }

    protected loadUserData(user) {
        loadUserData(this)(user);
    }

    initEventForInGameMenu() {
        const node = super.initEventForInGameMenu();

        node.on(InGameMenuEvents.GO_TO_LOBBY, this.onCloseGameClick, this);

        return node;
    }
}
