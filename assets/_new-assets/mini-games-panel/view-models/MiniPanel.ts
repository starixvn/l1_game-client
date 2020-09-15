import Loading from "../../common/loading/view-models/Loading";
import Notice, { NoticeData } from "../../common/notice/view-models/Notice";
import ChanLe from "../../games/chan-le/view-models/ChanLe";
import KenoProViet from "../../games/mini-keno/view-models/KenoProViet";
import MiniSedie from "../../games/mini-sedie/viewModels/MiniSedie";
import RongHo from "../../games/rong-ho/view-models/RongHo";
import * as authManager from "./../../common/auth/AuthManager";
import * as configs from "./../../Configs";
import MiniPanelDataHandlers from "./MiniPanelDataHandlers";
import MiniPanelMiniGameInitializers from "./MiniPanelMiniGameInitializers";
import MiniPanelSocketIOGameInitializers from "./MiniPanelSocketIOGameInitializers";
import GameIconLayout from "./GameIconLayout";
import SnappedScrollView from "../../common/bet-chips/view-models/SnappedScrollView";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniPanel extends cc.Component {
    @property(cc.BitmapFont)
    fontCong: cc.BitmapFont = null;

    @property(cc.BitmapFont)
    fontTru: cc.BitmapFont = null;

    @property(cc.Node)
    miniGames: cc.Node = null;

    @property(cc.Node)
    miniMenu: cc.Node = null;

    @property(cc.Node)
    dialog: cc.Node = null;

    @property(cc.Node)
    lightBackground: cc.Node = null;

    @property(cc.Sprite)
    lightSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    lightOnSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    lightOffSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Node)
    effectNode: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    loadingPrefab: cc.Prefab = null;

    @property(cc.Sprite)
    sound: cc.Sprite = null;

    @property(cc.SpriteFrame)
    soundOn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    soundOff: cc.SpriteFrame = null;

    @property(GameIconLayout)
    gameIconLayout: GameIconLayout = null;

    @property(cc.Node)
    leftButton: cc.Node = null;

    @property(cc.Node)
    rightButton: cc.Node = null;

    @property(SnappedScrollView)
    scrollView: SnappedScrollView = null;

    public taiXiu: any;
    public bauCua: any;
    public taiXiuTurbo: any;
    public chanLe: ChanLe;
    public chanLeTurbo: ChanLe;
    public rongHo: RongHo;
    public miniSedie: MiniSedie;
    public kenoProViet: KenoProViet;
    public popupMiniGame: any;
    public loading: Loading;
    public dataHandlers: MiniPanelDataHandlers;
    public currentGameRoomId: number;
    private isLightOn: boolean;
    private gameMiniInitializers: MiniPanelMiniGameInitializers;
    private socketIOGameInitializers: MiniPanelSocketIOGameInitializers;

    onLoad() {
        if (!cc.sys.isMobile) {
            this.miniMenu.scale = 0.67;
        }

        if (void 0 === cc.RedT.util.fontCong) {
            cc.RedT.util.fontCong = this.fontCong;
            cc.RedT.util.fontTru = this.fontTru;
        }

        const loadingNode = cc.instantiate(this.loadingPrefab);
        this.loading = loadingNode.getComponent('Loading') as Loading;
        loadingNode.active = false;
        this.node.addChild(loadingNode);

        this.popupMiniGame = this.miniMenu.getComponent('popupMinigame');
        this.initSound();
        this.dataHandlers = new MiniPanelDataHandlers(this);
        this.gameMiniInitializers = new MiniPanelMiniGameInitializers(this);
        this.socketIOGameInitializers = new MiniPanelSocketIOGameInitializers(this);
        this.gameIconLayout.miniPanel = this;
        this.scrollView.onScrollEnded = () => {
            const min = this.scrollView.getMinDisplayIndex();
            this.updateArrowVisibility(min);
        }
    }

    onDestroy() {
        this.taiXiu && this.taiXiu.destroy();
        this.taiXiu = null;
        this.taiXiuTurbo && this.taiXiuTurbo.destroy();
        this.taiXiuTurbo = null;
        this.chanLe && this.chanLe.destroy();
        this.chanLe = null;
        this.chanLeTurbo && this.chanLeTurbo.destroy();
        this.chanLeTurbo = null;
        this.bauCua && this.bauCua.destroy();
        this.bauCua = null;
        this.miniSedie && this.miniSedie.destroy();
        this.miniSedie = null;
        this.kenoProViet && this.kenoProViet.destroy();
        this.kenoProViet = null;
    }

    onGeneralData(data: any) {
        if (!this.dataHandlers) {
            this.dataHandlers = new MiniPanelDataHandlers(this);
        }

        this.dataHandlers.handleData(data);
    }

    onSignIn() {
        this.bauCua && this.bauCua.node && this.bauCua.onSignIn();
        this.taiXiu && this.taiXiu.node && this.taiXiu.onSignIn();
        this.taiXiuTurbo && this.taiXiuTurbo.node && this.taiXiuTurbo.onSignIn();
        this.chanLe && this.chanLe.node && this.chanLe.onSignIn();
        this.chanLeTurbo && this.chanLeTurbo.node && this.chanLeTurbo.onSignIn();
        this.rongHo && this.rongHo.node && this.rongHo.onSignIn();
        this.miniSedie && this.miniSedie.node && this.miniSedie.onSignIn();
        this.kenoProViet && this.kenoProViet.node && this.kenoProViet.onSignIn();
    }

    onForceReload(showNotice = true) {
        const forceReload = () => {
            window.location.reload(true);
        };

        if (showNotice) {
            const noticeData = <NoticeData>{
                text: 'Vui lòng tải lại trang để cập nhật phiên bản mới.',
                isInfo: true,
            };
            this.showNotice(noticeData, forceReload, forceReload);
        } else {
            forceReload();
        }
    }

    forceKickedOut() {
        cc.RedT.forceKickedOut();
        authManager.signOut();
    }

    changeLight() {
        this.isLightOn = !this.isLightOn;

        if (this.isLightOn) {
            this.lightBackground.active = false;
            this.lightSprite.spriteFrame = this.lightOffSpriteFrame;
        } else {
            this.lightBackground.active = true;
            this.lightSprite.spriteFrame = this.lightOnSpriteFrame;
        }
    }

    playClick() {
        cc.RedT.audio.playClick();
    }

    playUnClick() {
        cc.RedT.audio.playUnClick();
    }

    openGame(e, id) {
        this.gameMiniInitializers.openGame(id);
    }

    openGameRoom(e, id) {
        cc.RedT.audio.playClick();
        this.popupMiniGame.hideListGame();

        if (this.currentGameRoomId == id) {
            return;
        }

        if (!cc.RedT.isConnected) {
            const gameName = configs.gameNames[id];
            this.onConnectSocketFailed(gameName);
            return;
        }

        if (cc.RedT.IS_LOGIN) {
            const regName = configs.gameRoomRegNames[id];
            this.loading.node.active = true;
            cc.RedT.inGame.outRoomGame().then(() => {
                authManager.removeInRoomGameId();
                cc.RedT.send({ g: { reg: regName } });
            });
        } else {
            this.forceKickedOut();
        }

    }

    openNewGameSocket(event, gameId) {
        this.socketIOGameInitializers.openGame(gameId);
    }

    loadGameRoom(name) {
        this.loading.setDefaultPercent();

        cc.director.preloadScene(
            name,
            (completedCount, total, item) => {
                this.loading && this.loading.onProgress(completedCount, total, item);
            },
            (error, assets) => {
                if (error) {
                    this.loading.node.active = false;
                    cc.RedT.MiniPanel.onForceReload();
                } else {
                    cc.director.loadScene(name);
                }
            }
        );
    }

    showErrorNotice(error) {
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent('Notice');
        var message = '';

        if (error.gameTypeId) {
            message += `Game ${configs.gameNames[error.gameTypeId]} (#${error.gameRoundId})\r\n`;
        }

        message += `${error.message}.`;

        if (error.isPlaceBetFailed) {
            message += ' Đặt cược thất bại!';
        }

        notice.init({ text: message });
        this.node.addChild(noticePrefab);
    }

    showNotice(noticeData: NoticeData, handleClickButton = null, handleClose = null) {
        var noticePrefab = cc.instantiate(this.noticePrefab);
        var notice = noticePrefab.getComponent('Notice') as Notice;

        noticeData.button = { text: 'OK' };
        notice.init(noticeData);

        if (handleClickButton) {
            notice.handleClickButton = handleClickButton;
        }

        if (handleClose) {
            notice.handleClose = handleClose;
        }

        this.node.addChild(noticePrefab);
    }

    onClickSoundGame() {
        cc.RedT.audio.playClick();
        cc.RedT.isSoundGame() ? this.setSoundGameOff() : this.setSoundGameOn();
    }

    onConnectSocketFailed(gameName) {
        this.showNotice(<NoticeData>{ text: `${gameName}\nMất kết nối hoặc kết nối không ổn định. Vui lòng kiểm tra và thử lại.` });
        this.loading.node.active = false;
    }

    private initSound() {
        cc.RedT.isSoundGame() ? this.setSoundGameOn() : this.setSoundGameOff();
    }

    private setSoundGameOn() {
        this.sound.spriteFrame = this.soundOn;
        cc.RedT.setSoundGame(true);
    }

    private setSoundGameOff() {
        this.sound.spriteFrame = this.soundOff;
        cc.RedT.setSoundGame(false);
    }

    public openResultPage(redirectUrl) {
        cc.RedT.resultPage = window.open(redirectUrl, "", "width=700,height=500");
        cc.RedT.resultPage.focus();

        window.onbeforeunload = function () {
            cc.RedT.resultPage.close();
        };
    }

    public onGameResultClick() {
        cc.RedT.send({ gameResult: { language: "vi-VN" } });
    }

    public onPrevious() {
        cc.RedT.audio.playClick();
        const index = this.scrollView.getMinDisplayIndex() - 1;
        this.scrollView.scrollTo(index < 0 ? 0 : index);
        this.updateArrowVisibility(index);
    }

    public onNext() {
        cc.RedT.audio.playClick();
        const index = this.scrollView.getMinDisplayIndex() + 1;
        this.scrollView.scrollTo(index);
        this.updateArrowVisibility(index);
    }

    private updateArrowVisibility(index: number) {
        this.leftButton.active = index > 0;
        this.rightButton.active = index < this.gameIconLayout.columnCount - 6;
    }
}
