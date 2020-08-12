import BaseSocketIOController from "../../../BaseSocketIOController";
import { gameIds } from "../../../Configs";
import GameRoomBase from "../../_base/GameRoomBase";
import SedieMiniRoundHistory from "../../mini-sedie/viewModels/SedieMiniRoundHistory";
import SedieRoundHistory from "../../mini-sedie/viewModels/SedieRoundHistory";
import * as authManager from "./../../../common/auth/AuthManager";
import SedieFinishHandler from "./handlers/SedieFinishHandler";
import SedieLogsHandler from "./handlers/SedieLogsHandler";
import SedieTimeHandler from "./handlers/SedieTimeHandler";
import { SedieConfigs } from "./SedieConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Sedie extends GameRoomBase {

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Animation)
    shakeThePlateAnimation: cc.Animation = null;

    @property(cc.AudioSource)
    shakeThePlateAudio: cc.AudioSource = null;

    @property(cc.Node)
    thePlate: cc.Node = null;

    @property({ type: cc.Sprite })
    dots: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

    private socket: SocketIOClient.Socket;
    private roundHistory: SedieRoundHistory;
    private miniRoundHistory: SedieMiniRoundHistory;

    constructor() {
        super();
        this.init("XocXoc", new SedieConfigs());
        this.finishShowResult = false;
    }

    initHandlers() {
        super.initHandlers();

        this.logsHandler = new SedieLogsHandler(this);
        this.timeHandler = new SedieTimeHandler(this);
        this.finishHandler = new SedieFinishHandler(this);
    }

    onLoad() {
        super.onLoad();

        authManager.storeInRoomGameId(gameIds.XocXoc);
        this.currentMiniPanel.currentGameRoomId = gameIds.XocXoc;
        this.initRoundHistory();

        this.socket = BaseSocketIOController.getInstance().gameSockets[gameIds.XocXoc];
        this.socket.on(this.gameName, (data) => { this.onDataGameRoom(data); });
        this.socket.on('disconnect', () => { this.closeGame(); });
    }

    onDestroy() {
        super.destroy();
        BaseSocketIOController.getInstance().closeSocket(gameIds.XocXoc);
    }

    initRoundHistory() {
        const node = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = node.getComponent(SedieRoundHistory);
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime;
        };
        this.roundHistory.logControl.init(condition);
        this.roundHistoryContainer.addChild(node);

        var mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
        this.miniRoundHistoryContainer.addChild(mini);
    }

    updateRoundHistory() {
        const miniHistoryData = this.currentDataLogs.map((d) => {
            let count = 0;
            const list = ["red1", "red2", "red3", "red4"];
            list.forEach((i) => {
                if (d.result[i]) {
                    count++;
                }
            });
            return {
                roundId: d.roundId || d.id || d.round,
                red: count,
            };
        });
        this.roundHistory.setData(miniHistoryData.map((d) => d.red));
        this.miniRoundHistory.setData(miniHistoryData);
    }

    start() {
        cc.RedT.send({ scene: 'xocxoc' });
        this.socket.emit('inGame');
    }

    onBet(event) {
        if (this.isDisableGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        }
        else {
            this.waitingProcessing = true;
            const betData = {
                amount: this.currentBet, box: event.target.name
            };
            this.socket && this.socket.emit("bet", betData);
        }
    }

    openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent('XocXoc_guide');
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    openHistory() {
        let dialog = cc.instantiate(this.historyPrefab);
        const history = dialog.getComponent('XocXoc_history');
        history.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    onCloseGameClick() {
        authManager.removeInRoomGameId();
        this.closeGame();
    }

    onData(data) {
        this.currentMiniPanel.onGeneralData(data);
        this.onDataGameRoomGeneral(data);
    }

    setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];
            this.setDots(result);
            this.betItems.forEach(betItem => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
            this.updateRoundHistory();
        }
    }
}
