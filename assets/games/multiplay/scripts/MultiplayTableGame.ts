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

    @property(cc.Prefab)
    statisticBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainContainer: cc.Node = null;

    @property(cc.Prefab)
    miniNoticePrefab: cc.Prefab = null;

    inGameMenu: MultiplayTableGameMenu;
    userProfile: UserProfile;
    public gameState = GameState.None;
    isWinningNotification = true;

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

    openHistory() {}

    onCloseGame() {}

    openGuide() {}

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

    showHideSubAreas() {
        super.showHideSubAreas();
        const widgetNode = this.collapsedExpandButton.node.getComponent(cc.Widget);
        if (!this.collapsedExpandButton.isChecked) {
            this.mainContainer.x = 0;
            widgetNode.enabled = true;
            widgetNode.isAbsoluteRight = true;
            widgetNode.updateAlignment();
        } else {
            widgetNode.enabled = false;
            widgetNode.updateAlignment();
            this.mainContainer.x = -170;
            this.collapsedExpandButton.node.x = 17;
        }
    }

    //#endregion Methods for room game
}
