import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import { games } from "../../../configs/SabaConfigs";
import { numberPad, numberWithCommas } from "./../../../common/helpers/NumberHelper";
import BauCuaFinishHandler from "./handlers/BauCuaFinishHandler";
import BauCuaTimeHandler from "./handlers/BauCuaTimeHandler";
import BauCuaLogsHandler from "./handlers/BauCuaLogsHandler";
import BauCuaBetHandler from "./handlers/BauCuaBetHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCua extends SocketIOMiniGameBase {
    get gameId() {
        return games.BauCua.id;
    }

    @property(cc.Node)
    background: cc.Node = null;

    @property({ type: cc.Sprite })
    iconLV: cc.Sprite[] = [];

    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    logHuou: cc.Label = null;

    @property(cc.Label)
    logBau: cc.Label = null;

    @property(cc.Label)
    logGa: cc.Label = null;

    @property(cc.Label)
    logCa: cc.Label = null;

    @property(cc.Label)
    logCua: cc.Label = null;

    @property(cc.Label)
    logTom: cc.Label = null;

    @property(cc.Label)
    phienLabel: cc.Label = null;

    @property(cc.Label)
    userCountLabel: cc.Label = null;

    @property(cc.Label)
    waitedTime: cc.Label = null;

    @property(cc.Node)
    logNode: cc.Node = null;

    @property(cc.Node)
    logs: cc.Node = null;

    @property(cc.Prefab)
    prefabLogs: cc.Prefab = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(cc.Node)
    umWarning: cc.Node = null;

    @property(cc.Label)
    umWarningMessage: cc.Label = null;

    @property(cc.Prefab)
    prefabNotice: cc.Prefab = null;

    @property(cc.Node)
    center: cc.Node = null;
    // @property(cc.Prefab)
    // historyPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    historyDialog: cc.Prefab = null;

    @property(cc.Prefab)
    topDialog: cc.Prefab = null;

    @property(cc.Label)
    oddOne: cc.Label = null;

    @property(cc.Label)
    oddTwo: cc.Label = null;

    @property(cc.Label)
    oddThree: cc.Label = null;

    @property(cc.Prefab)
    gameAudiosPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Node)
    betChipsContainer: cc.Node = null;

    @property(cc.Prefab)
    betChipsPrefab: cc.Prefab = null;

    protected cuoc: any;
    protected red = true;
    protected betChipList = [];
    protected localPhien = "";
    protected localResultDices = [];
    private limitLog = 30;
    protected LichSu: cc.Component;

    // init(gameName, obj) {
    //     this.gameName = gameName;
    //     // this.initSettingBauCua();
    //     cc.RedT.setting.baucua.regOpen = false; // force get new data when back from other scene

    //     var check = cc.sys.localStorage.getItem("bauCua");
    //     if (check === "true") {
    //         this.node.active = true;
    //     }

    //     if (void 0 !== cc.RedT.setting.baucua.position) {
    //         this.node.position = cc.RedT.setting.baucua.position;
    //     }
    //     // if (void 0 !== cc.RedT.setting.baucua.time_remain) {
    //     //     cc.RedT.setting.baucua.time_remain++;
    //     //     this.nextRealTime();
    //     // }
    //     // if (cc.RedT.IS_LOGIN) {
    //     //     this.dataHandling(cc.RedT.setting.baucua.data);
    //     //     if (this.red !== cc.RedT.setting.baucua.red) {
    //     //         this.changerCoint();
    //     //     }

    //     //     if (void 0 !== cc.RedT.setting.baucua.logs) {
    //     //         this.addLogs();
    //     //     }
    //     // }
    // }

    initSettingBauCua() {
        cc.RedT.setting.baucua = cc.RedT.setting.baucua || {
            regOpen: false,
            data: {
                meRedBau: 0,
                meRedCa: 0,
                meRedCua: 0,
                meRedGa: 0,
                meRedHuou: 0,
                meRedTom: 0,
                redBau: 0,
                redCa: 0,
                redCua: 0,
                redGa: 0,
                redHuou: 0,
                redTom: 0
            },
            logLV: {},
            red: true,
            bet: "1"
        };
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        super.onLoad();
    }
    initBetChips() {
        var betChipsNode = cc.instantiate(this.betChipsPrefab);
        this.betChips = betChipsNode.getComponent("BetChips");
        this.betChips.init((bet) => {
            this.cuoc = parseInt(bet);
        });
        this.betChipsContainer.addChild(betChipsNode);
    }

    onEnable() {
        super.onEnable();
        // this.logNode.active = cc.RedT.setting.baucua.logs && cc.RedT.setting.baucua.logs.length > 0;
        // this.observeData();
    }

    initHandlers() {
        super.initHandlers();
        // this.finishHandler = new BauCuaBetHandler(this);
        // this.finishHandler = new BauCuaFinishHandler(this);
        this.timeHandler = new BauCuaTimeHandler(this);
        // this.logsHandler = new BauCuaLogsHandler(this);
    }

    // addLogs() {
    //     var self = this;
    //     this.logs.removeAllChildren();
    //     var count = Math.min(this.limitLog, cc.RedT.setting.baucua.logs.length);
    //     if (count === 0) {
    //         this.logNode.active = false;
    //         return;
    //     }
    //     this.logNode.active = true;

    //     var LinhVat = [0, 0, 0, 0, 0, 0];
    //     for (var index = 0; index < count; index++) {
    //         var log = cc.RedT.setting.baucua.logs[index];
    //         LinhVat[log[0]] += 1;
    //         LinhVat[log[1]] += 1;
    //         LinhVat[log[2]] += 1;
    //         var node = cc.instantiate(self.prefabLogs);
    //         var nodeComponent = node.getComponent("BauCua_logMini");
    //         nodeComponent.icon.forEach(function (sp, i) {
    //             sp.spriteFrame = self.iconMini[log[i]];
    //         });

    //         self.logs.addChild(node);
    //     }

    //     this.logLVHandling(LinhVat);
    // }

    pressedShowScoreBoard() {
        cc.RedT.audio.playClick();
        this.logNode.active = !this.logNode.active;
    }
    pressedHistoryDialog() {
        cc.RedT.audio.playClick();
        var dialog = cc.instantiate(this.historyDialog);
        this.currentMiniPanel.node.addChild(dialog);
    }
    pressedShowGuide() {
        cc.RedT.audio.playClick();
        var dialog = cc.instantiate(this.guidePrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }
}
