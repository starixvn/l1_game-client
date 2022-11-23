import GameIdSprite from "../../../common/GameIdSprite";
import { InGameMenuEvents } from "../../../common/in-game-menu/InGameMenu";
import UmWarning from "../../../common/um-warning/UmWarning";
import {
    closeGame,
    initMusicBackground,
    leaveGameRoom,
    loadMiniPanel,
    loadUserData,
    onUserProfileInitialized,
    outRoomGame,
} from "../../_base/action/GameRoomActions";
import MD5Component from "../../_base/view-models/MD5Component";
import TableGameBase from "./TableGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandAloneTableGameBase extends TableGameBase {
    //#region override some properties to hide them
    @property({ visible: false, override: true })
    betPercentage: cc.Label[] = [];

    @property({ visible: false, override: true })
    waitingDotsSubGame: cc.Node = null;

    @property({ visible: false, override: true })
    gameNameSprite: GameIdSprite = null;

    @property({ visible: false, override: true })
    tableGameBg: cc.Node = null;

    @property({ visible: false, override: true })
    umNotice: UmWarning = null;
    //end region override

    @property(cc.Prefab)
    miniPanelPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniPanelContainer: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Node)
    loading: cc.Node = null;

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

    initEventForInGameMenu() {
        const node = super.initEventForInGameMenu();

        node.on(InGameMenuEvents.GO_TO_LOBBY, this.onCloseGame, this);

        return node;
    }

    loadUserData(user) {
        loadUserData(this)(user);
    }

    onUserProfileInitialized(node: cc.Node) {
        onUserProfileInitialized(this)(node);
    }

    initMD5String(node: cc.Node) {
        this.md5Component = node.getChildByName("md5-content").getComponent(MD5Component);
    }

    //#region Methods for room game
    onCloseGame() {
        leaveGameRoom(this)();
    }

    closeGame() {
        closeGame(this)();
    }

    outRoomGame() {
        return outRoomGame(this)();
    }

    onGameHide() {
        super.onGameHide();
        this.closeGame();
    }

    onDisconnected() {
        this.closeGame();
    }
}
