import TableGameBase from "./TableGameBase";
import MD5Component from "../../_base/view-models/MD5Component";
import GameIdSprite from "../../../common/GameIdSprite";
import UmWarning from "../../../common/um-warning/UmWarning";
import {
    closeGame,
    initMusicBackground,
    leaveGameRoom,
    loadMiniPanel,
    loadUserData,
    onUserProfileInitialized,
    outRoomGame
} from "../../_base/action/GameRoomActions";

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
}
