import MD5Component from "../../_base/view-models/MD5Component";
import MegaKeno from "./MegaKeno";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKenoSubGame extends MegaKeno {
    //#region override some properties to hide them
    @property({ visible: false, override: true })
    players: any[] = [];

    @property({ visible: false, override: true })
    otherPlayers: cc.Node = null;

    @property({ visible: false, override: true })
    userName: cc.Label = null;

    @property({ visible: false, override: true })
    userAvatar: cc.Sprite = null;

    @property({ visible: false, override: true })
    winningPlayerEffectPrefab: cc.Prefab = null;

    @property({ visible: false, override: true })
    md5Component: MD5Component = null;

    @property({ visible: false, override: true })
    musicBg: cc.AudioSource = null;

    public showOtherPlayerChips = false;

    //TODO:missing custom duration for Keno Mini
    showResultDuration = 5;
}
