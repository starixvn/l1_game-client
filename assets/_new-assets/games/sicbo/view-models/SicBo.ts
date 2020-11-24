import * as _ from "lodash";
import * as helper from "../../../common/helpers/Helper";
import { games } from "../../../SabaConfigs";
import BetItem from "../../_base/BetItem";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import SicBoConfigs from "./SicBoConfigs";
import SicBoOddsItem from './SicBoOddsItem';
import SicBoTimeHandler from './handlers/SicBoTimeHandler';
import SicBoLogsHandler from "./handlers/SicBoLogsHandler";
import SicBoFinishHandler from "./handlers/SicBoFinishHandler";
import SicBoBetItem from './SicBoBetItem';
import SicBoBetHandler from "./handlers/SicBoBetHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBo extends NewSocketGameBase {
    public readonly shakeThePlateTime = 33;

    @property(cc.Node)
    betChoices: cc.Node = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    characterIcons: cc.SpriteFrame[] = [];

    @property({ type: SicBoOddsItem })
    oddsItems: SicBoOddsItem[] = [];

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

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    public finishShakeThePlate: boolean = false;

    bigStatistic: number = 0;
    smallStatistic: number = 0;
    anyTripleStatistic: number = 0;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("SicBo", new SicBoConfigs(), null, 1, games.SicBo.id);
        this.finishShowResult = false;
    }

    onLoad() {
        this.betChoices.children.forEach((choice) => {
            const betItem = choice.getComponent(BetItem);
            if (betItem) {
                this.betItems.push(betItem)
            }
        });

        super.onLoad();
        this.shakeAnimation.node.active = false;
        this.animatedTime.setAnimatedY(30, -5);
    }

    initHandlers() {
        super.initHandlers();
        this.finishHandler = new SicBoFinishHandler(this);
        this.logsHandler = new SicBoLogsHandler(this);
        this.timeHandler = new SicBoTimeHandler(this);
        this.betHandler = new SicBoBetHandler(this);
    }

    public updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        this.gameConfigs.odds && this.oddsItems.forEach(item => item.setValue(this.gameConfigs.odds[item.node.name]));
    }

    setResult() {
        if (this.currentDataLogs.length > 0) {
            const { result } = this.currentDataLogs[0];
            console.log(result);
            this.setDices(_.values(result))
        }
    }

    setDices(dices: number[]) {
        dices.forEach((dice, index) => {
            this.dices[index].spriteFrame = this.characterIcons[dice - 1];
            this.dices[index].node.active = true;
        })
    }

    highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];

        if (dataLog) {
            this.betItems.forEach((betItem: SicBoBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(dataLog?.settlementResult[choice], false);
            });
        }
    }

    highlightWinningBetItems() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];
            this.betItems.forEach((betItem: SicBoBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(settlementResult[choice], true);
            });
        }
    }

    onDataGameRoom(data) {
        if (data.history) {
            // this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    openGuide() {
    }

    openHistory() {
    }

    openStatistic() {

    }

    updateStatistic(data: any) {
        console.log(data);
    }

    updateTotalBetLabel(totalBet: number) {
        this.totalBetLabel.string = totalBet.toString();
    }

    // getBigSmallResult(logData: any, choice: string) {
    //     logData.forEach((log, index) => {
    //         if (log[choice]) {
    //             this.bigStatistic
    //         }
    //     })
    // }
}
