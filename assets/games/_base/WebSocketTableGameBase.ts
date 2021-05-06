import { lazyInject } from "../../Application";
import HandleUserStakeLevel from "../../common/bet-chips/view-models/HandleUserStakeLevel";
import GameUtils from "../../common/GameUtils";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import Notice, { NoticeData } from "../../common/notice/view-models/Notice";
import UmWarning from "../../common/um-warning/UmWarning";
import MiniPanel from "../../mini-games-panel/view-models/MiniPanel";
import SocketIOController from "../../SocketIOController";
import GameBase from "./GameBase";
import { GameBasePlayerHandler } from "./handlers/GameBasePlayerHandler";
import { GameConfigBase } from "./view-models/GameConfigBase";
import RoomPlayer from "./view-models/RoomPlayer";
import NoticeUtil from "../../common/utils/NoticeUtil";
const i18n = require("LanguageData");

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

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    protected get WinningAnimationDuration() {
        return 3;
    }

    playerHandler: GameBasePlayerHandler;
    private miniPanelScale: number;

    protected _gameId: number;

    public get gameId(): number {
        return this._gameId;
    }

    constructor() {
        super();
    }

    onLoad() {
        super.onLoad();
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        this.loadUserData(cc.RedT.user);
        this.players.forEach((player) => (player.node.active = false));
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.inGame = null;
    }

    init(gameName: string, gameConfigs: GameConfigBase, miniPanel: MiniPanel = null, miniPanelScale = 1, gameId = 0) {
        super.init(gameName, gameConfigs, miniPanel);
        this.miniPanelScale = miniPanelScale;
        this._gameId = gameId;
    }

    initHandlers() {
        super.initHandlers();

        this.playerHandler = new GameBasePlayerHandler(this);
    }

    start() {
        cc.RedT.send({ scene: this.gameName, g: { [this.gameName]: { ingame: true } } });
    }

    onDisconnected() {
        this.closeGame();
    }

    onData(data: any) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);

        const gameData = data[this.gameName];

        let apiErrorGameData;

        if (gameData) {
            this.onDataGameRoom(gameData);
            if (gameData.apiError) {
                apiErrorGameData = gameData.apiError;
            }
        }

        if (data.apiError) {
            this.updateUserStakeLevel(data.apiError);
        }
        if (apiErrorGameData) {
            this.updateUserStakeLevel(apiErrorGameData);
        }
    }

    updateUserStakeLevel(data): boolean {
        let updated = false;
        if (data.maxBet && data.maxBet > 0) {
            cc.RedT.userStakeLevelData(data);
            if (this.betChips) {
                const comp = this.betChips.getComponent(HandleUserStakeLevel);
                if (comp) {
                    updated = true;
                    comp.handle();
                }
            }
        }
        return updated;
    }

    showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        const message = NoticeUtil.getMessageByLocale(data.um_message);

        const text = message ? message : i18n.t("messages.disabledGame");
        const noticeData = { text: text, button: { text: "OK" } } as NoticeData;
        const notice = this.showNotice(noticeData);

        notice.handleClickButton = () => {
            this.onCloseGameClick();
        };
        notice.handleClose = () => {
            this.onCloseGameClick();
        };
    }

    onCloseGameClick() {
        this.closeGame();
    }

    showNotice(data: NoticeData): Notice {
        const noticePrefab = cc.instantiate(this.noticePrefab);
        const notice = noticePrefab.getComponent("Notice") as Notice;
        data.button = { text: "OK" };
        notice.init(data);
        this.miniPanelContainer.addChild(noticePrefab);

        return notice;
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
            this.sendData({ outgame: true });
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
            this.updateUserStakeLevel(data.apiError);
        }
        if (data.userStakeLevel) {
            if (
                data.userStakeLevel.minBet !== cc.RedT.userStakeLevel.minBet ||
                data.userStakeLevel.maxBet !== cc.RedT.userStakeLevel.maxBet
            ) {
                if (this.updateUserStakeLevel(data.userStakeLevel)) {
                    this.showMiniWarning(i18n.t("messages.limitBetChanged"));
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
        if (!this.node || !this.node.isValid) {
            return;
        }

        if (void 0 !== user.name && this.userName) {
            this.userName.string = user.name;
        }

        if (void 0 !== user.red) {
            this.userBalance.string = numberWithCommas(user.red);
        }

        if (void 0 !== user.avatarId) {
            cc.loader.loadRes("profile-picture", cc.SpriteAtlas, (err, atlas) => {
                if (this && this.userAvatar) {
                    const avatarId = cc.RedT.user.avatarId;
                    const frame = atlas.getSpriteFrame(avatarId === 0 ? 1 : avatarId);
                    this.userAvatar.spriteFrame = frame;
                    this.userAvatar.node.parent.active = true;
                }
            });
        }
    }
}
