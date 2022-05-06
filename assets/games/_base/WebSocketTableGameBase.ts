import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../Application";
import MusicPlayer from "../../common/audio/MusicPlayer";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import { InGameMenuEvents } from "../../common/in-game-menu/InGameMenu";
import { NoticeData } from "../../common/notice/view-models/Notice";
import UmWarning from "../../common/um-warning/UmWarning";
import NoticeUtil from "../../common/utils/NoticeUtil";
import SocketIOController from "../../SocketIOController";
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

    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userBalance: cc.Label = null;

    @property(cc.Sprite)
    userAvatar: cc.Sprite = null;

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
    private miniPanelScale = 1;

    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        this.loadUserData(cc.RedT.user);
        this.players.forEach((player) => (player.node.active = false));
        this.initMusicBackground();
    }

    initMusicBackground() {
        const musicPlayer = MusicPlayer.getInstance();
        if (this.musicBg) {
            musicPlayer.joinRoomMusic = true;
            musicPlayer.decreaseVolumeAndStopBackgroundMusic();
        }
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.inGame = null;
    }

    onEnable(): void {
        super.onEnable();
        cc.RedT.inGame = this;
    }

    setMiniPanelScale(miniPanelScale: number) {
        this.miniPanelScale = miniPanelScale;
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
    }

    closeGame() {
        if (this.loading) {
            this.loading.active = true;
        }
        this.outRoomGame().then(() => {
            cc.director.loadScene("MainGame");
        });
    }

    outRoomGame() {
        return new Promise<void>((resolve) => {
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(() => {
                        this.socketIOController.closeMiniGameSockets();
                        this.stopGame();
                        resolve();
                    })
                )
            );
        });
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.userAvatar.node.parent, false, bet, 1, 80);
    }

    showWinningBet(bet: number) {
        const winningBet = GameUtils.addFlyingText(this.userAvatar.node.parent, true, bet, this.WinningAnimationDuration, 80, 10);
        winningBet.name = "winningBet";
    }

    clearWinningBet() {
        const winningBet = this.userAvatar.node.parent.getChildByName("winningBet");
        if (winningBet) {
            winningBet.destroy();
        }
    }

    clearWinningEffect() {
        const winningEffect = this.userAvatar.node.parent.getChildByName("winningEffect");
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
            this.playerHandler.handle(data);
        }
    }

    protected loadMiniPanel() {
        const miniPanel = cc.instantiate(this.miniPanelPrefab);
        this.currentMiniPanel = miniPanel.getComponent("MiniPanel");
        this.currentMiniPanel.currentGameRoomId = this.gameId;
        this.miniPanelContainer.addChild(miniPanel);

        if (!cc.sys.isMobile) {
            miniPanel.scale = this.miniPanelScale;
        }
    }

    protected loadUserData(user) {
        if (!this.isAlive()) {
            return;
        }

        if (void 0 !== user.name && this.userName) {
            this.userName.string = user.name;
        }

        if (void 0 !== user.red) {
            this.userBalance.string = numberWithCommas(user.red, 2);
        }

        if (void 0 !== user.avatarId) {
            GameUtils.getAvatarSprite(user.avatarId).then((frame) => {
                if (this && this.userAvatar && frame) {
                    this.userAvatar.spriteFrame = frame;
                    this.userAvatar.node.parent.active = true;
                }
            });
        }
    }

    initEventForInGameMenu() {
        const node = super.initEventForInGameMenu();

        node.on(InGameMenuEvents.GO_TO_LOBBY, this.onCloseGameClick, this);

        return node;
    }
}
