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
    outRoomGame,
} from "../../_base/action/GameRoomActions";
import GameBase from "../../_base/GameBase";
import { GameState } from "../../_base/GameState";
import MultiplayGame from "./MultiplayGame";

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

    inGameMenu: InGameMenu;
    userProfile: UserProfile;
    public gameState = GameState.None;

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

    onIngameMenuInitialized(node: cc.Node) {
        const inGameMenu = node.getComponent(InGameMenu);
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
