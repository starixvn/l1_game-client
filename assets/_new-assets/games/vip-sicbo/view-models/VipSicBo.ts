import * as _ from "lodash";

import { games } from "../../../SabaConfigs";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import VipSicBoBetHandler from "./handlers/VipSicBoBetHandler";
import VipSicBoFinishHandler from "./handlers/VipSicBoFinishHandler";
import VipSicBoLogsHandler from "./handlers/VipSicBoLogsHandler";
import VipSicBoTimeHandler from "./handlers/VipSicBoTimeHandler";
import VipSicBoBetItem from "./VipSicBoBetItem";
import VipSicBoConfigs from "./VipSicBoConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrab extends NewSocketGameBase {
    public readonly shakeThePlateTime = 33;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Animation)
    openDiskAnimation: cc.Animation = null;

    @property(cc.Node)
    statsContainer: cc.Node = null;

    @property(cc.Prefab)
    statsPrefab: cc.Prefab = null;

    @property(cc.Animation)
    shakeAnimation: cc.Animation = null;

    @property(cc.AudioSource)
    shakeAudio: cc.AudioSource = null;

    @property(cc.Node)
    randomResult: cc.Node = null;

    public finishShakeThePlate: boolean = false;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("VipSicBo", new VipSicBoConfigs(), null, 1, games.VipFishPrawnCrab.id);
        this.finishShowResult = false;
    }

    onLoad() {
        super.onLoad();
        this.shakeAnimation.node.active = false;
        this.animatedTime.setAnimatedY(30, -5);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new VipSicBoFinishHandler(this);
        this.logsHandler = new VipSicBoLogsHandler(this);
        this.betHandler = new VipSicBoBetHandler(this);
        this.timeHandler = new VipSicBoTimeHandler(this);
    }

    setResult() {
        if (this.currentDataLogs.length > 0) {
            const { result } = this.currentDataLogs[0];
            this.setDices(_.values(result));
        }
    }

    highlightWinningBetItems() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];
            this.betItems.forEach((betItem: VipSicBoBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(settlementResult[choice], true);
            });
        }
    }

    setDices(dices: number[]) {
        const optRandom = _.random(0, this.randomResult.children.length - 1);
        const randomOption = this.randomResult.children[optRandom];

        const resultText = [];

        dices.forEach((dice, index) => {
            this.dices[index].node.position = randomOption.children[index].position;
            this.dices[index].spriteFrame = this.characterIcons[dice];
            this.dices[index].node.active = true;
        });
    }

    resetDataAndUI() {
        super.resetDataAndUI();

        this.openDiskAnimation.node.active = false;
    }

    openHistory() {
    }

    onDataGameRoom(data) {
        if (data.history) {
            // this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    openGuide() {
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];

        if (dataLog) {
            this.betItems.forEach((betItem: VipSicBoBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(dataLog?.settlementResult[choice], false);
            });
        }
    }
}
