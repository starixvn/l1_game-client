import AudioManager from "../../../common/audio/AudioManager";
import MusicPlayer from "../../../common/audio/MusicPlayer";
import * as sessionManager from "../../../common/auth/SessionManager";
import InGameMenu, { InGameMenuEvents } from "../../../common/in-game-menu/InGameMenu";
import MultiplayGameStatisticBoard from "../../../common/statistic-board/MultiplayGameStatisticBoard";
import UserProfile from "../../../common/user-profile/UserProfile";
import {
    closeGame,
    initMusicBackground,
    loadMiniPanel,
    loadUserData,
    onUserProfileInitialized,
    outRoomGame
} from "../../_base/action/GameRoomActions";
import GameBase from "../../_base/GameBase";
import { GameState } from "../../_base/GameState";
import MultiplayGame from "./MultiplayGame";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import MultiplayTableGameMenu from "./MultiplayTableGameMenu";
import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayTableGame extends MultiplayGame {
    @property(cc.Node)
    loading: cc.Node = null;

    @property(cc.Prefab)
    miniPanelPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniPanelContainer: cc.Node = null;

    @property(cc.AudioSource)
    musicBg: cc.AudioSource = null;

    @property(cc.Node)
    mainContainer: cc.Node = null;

    @property(cc.Prefab)
    miniNoticePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    statisticBoardPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    inGameMenu: MultiplayTableGameMenu;
    userProfile: UserProfile;
    public gameState = GameState.None;
    isWinningNotification = true;
    subContainerWidth: number;
    subContainerWidget: cc.Widget;
    mainGameWidget: cc.Widget;

    assignPropertiesForSingle(single: GameBase, isMain: boolean) {
        super.assignPropertiesForSingle(single, isMain);
        single.userProfile = this.userProfile;
    }

    initBetChipByLoader(node: cc.Node) {
        super.initBetChipByLoader(node);
        Object.values(this.games).forEach((game: GameBase) => (game.betChips = this.betChips));
    }

    onLoad() {
        loadMiniPanel(this)();
        super.onLoad();

        //for room game
        cc.RedT && (cc.RedT.inGame = this);
        this.loadUserData(cc.RedT?.user);
        initMusicBackground(this)();
        this.subContainerWidth = this.subGamesArea[0].width;
        this.subContainerWidget = this.subGamesArea[0].getComponent(cc.Widget);
        this.mainGameWidget = this.mainContainer.getComponent(cc.Widget);
    }

    onDestroy() {
        super.onDestroy();
        cc.RedT.inGame = null;
    }

    onEnable() {
        super.onEnable();

        const gameSetting = GameUtils.getSpecificGameSetting(this.gameId);
        this.isWinningNotification = gameSetting.showWinningNotification ?? true;
        this.inGameMenu.winningNotifiationComp.setSwapStatus(this.isWinningNotification);
    }

    onIngameMenuInitialized(node: cc.Node) {
        const inGameMenu = node.getComponent(MultiplayTableGameMenu);
        if (inGameMenu) {
            this.inGameMenu = inGameMenu;
            this.initEventForInGameMenu();
        }
    }

    initEventForInGameMenu(): cc.Node {
        const node = this.inGameMenu.node;

        node.on(InGameMenuEvents.OPEN_HISTORY, this.openHistory, this);
        node.on(InGameMenuEvents.OPEN_GUIDE, this.openGuide, this);
        node.on(InGameMenuEvents.CLOSE_GAME, this.onCloseGame, this);
        node.on(InGameMenuEvents.GO_TO_LOBBY, this.onCloseGameClick, this);
        node.on(InGameMenuEvents.OPEN_STATISTIC, this.onScoreBoardClick, this);
        node.on(InGameMenuEvents.CHANGE_WINNING_NOTIFICATION, this.onWinningNotificationClick, this);
        return node;
    }

    openHistory() {
        AudioManager.getInstance().playClick();
    }

    onCloseGame() {}

    openGuide() {
        AudioManager.getInstance().playClick();
    }

    onScoreBoardClick() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.statisticBoardPrefab);
        this.currentMiniPanel.addDialog(node);

        const scoreBoard = node.getComponent(MultiplayGameStatisticBoard);
        scoreBoard.init(this.games);
        scoreBoard.openGameCallback = (gameId) => {
            this.switchGameToMain(gameId);
        };
    }

    onWinningNotificationClick() {
        this.isWinningNotification = !this.isWinningNotification;
        this.inGameMenu.winningNotifiationComp.setSwapStatus(this.isWinningNotification);
        this.isWinningNotification
            ? this.showMiniWarning(i18n.t("messages.winningNotificationOn"))
            : this.showMiniWarning(i18n.t("messages.winningNotificationOff"));

        const gameSetting = GameUtils.getSpecificGameSetting(this.gameId);
        gameSetting.showWinningNotification = this.isWinningNotification;
        GameUtils.setSpecificGameSetting(this.gameId, gameSetting);
    }

    showMiniWarning(data): cc.Node {
        if (!this.node.activeInHierarchy) {
            return null;
        }
        const notice = cc.instantiate(this.miniNoticePrefab);
        const noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = data;
        this.mainContainer.addChild(notice);
        return notice;
    }

    //#region Methods for room game
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

    stopGame() {
        Object.values(this.games).forEach((game: GameBase) => {
            game.stopGame();
        });
    }

    outRoomGame() {
        return outRoomGame(this)();
    }

    onUserProfileInitialized(node: cc.Node) {
        onUserProfileInitialized(this)(node);
        Object.values(this.games).forEach((game: GameBase) => (game.userProfile = this.userProfile));
    }

    loadUserData(user) {
        loadUserData(this)(user);
    }

    handleSubGamesArea() {
        super.handleSubGamesArea();
        const icon = this.collapsedExpandButton.node.getChildByName("icon-arrow");
        icon.scaleX = this.collapsedExpandButton.isChecked ? 1 : -1;
    }

    showSubGamesWithAnimation(isAnimated = true) {
        if (isAnimated) {
            cc.tween(this.subContainerWidget)
                .to(
                    0.2,
                    { right: 0 },
                    {
                        easing: "sineOut",
                        onUpdate: (target) => {
                            this.onUpdatSubContainerWidgetWidget(target);
                        }
                    }
                )
                .start();
        } else {
            this.subContainerWidget.right = 0;
            this.subContainerWidget.updateAlignment();

            // align main game
            this.mainGameWidget.right = this.subContainerWidth;
            this.mainGameWidget.updateAlignment();
        }
    }

    hideSubGamesWithAnimation(isAnimated = true) {
        if (isAnimated) {
            cc.tween(this.subContainerWidget)
                .to(
                    0.2,
                    { right: -this.subContainerWidth },
                    {
                        easing: "sineIn",
                        onUpdate: (target) => {
                            // align main game
                            this.onUpdatSubContainerWidgetWidget(target);
                        }
                    }
                )

                .start();
        } else {
            this.subContainerWidget.right = -this.subContainerWidth;
            this.subContainerWidget.updateAlignment();

            // align main game
            this.mainGameWidget.right = 0;
            this.mainGameWidget.updateAlignment();
        }
    }

    onUpdatSubContainerWidgetWidget(target) {
        this.subContainerWidget.updateAlignment();
        this.mainGameWidget.right = target.right + this.subContainerWidth;
        this.mainGameWidget.updateAlignment();
    }

    //#endregion Methods for room game
}
