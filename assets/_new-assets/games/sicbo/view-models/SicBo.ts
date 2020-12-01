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
import SicBoStatistic from "./SicBoStatistic";
import SicBoRoundHistory from './SicBoRoundHistory';
import SicBoRoundHistoryItem from "./SicBoRoundHistoryItem";
import SicBoHistory from "./SicBoHistory";
import SicBoGuide from './SiBoGuide';
import SicBoDicesStatistic from "./SicBoDicesStatistic";

const { ccclass, property } = cc._decorator;

export enum SicBoBetType {
    big = "big",
    small = "small",
    anyTriple = "anyTriple",
    specific1 = "specific1",
    specific2 = "specific2",
    specific3 = "specific3",
    specific4 = "specific4",
    specific5 = "specific5",
    specific6 = "specific6"
}

@ccclass
export default class SicBo extends NewSocketGameBase {
    public get shakeThePlateTime() { return this.config.betTime + 3; }

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
    bigStatsLabel: cc.Label = null;

    @property(cc.Label)
    smallStatsLabel: cc.Label = null;

    @property(cc.Label)
    anyTripleStatsLabel: cc.Label = null;

    @property(cc.Node)
    betChoiceStatistic: cc.Node = null;

    @property(cc.SpriteAtlas)
    sicboAtlas: cc.SpriteAtlas = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Node)
    dicesStatisticContainer: cc.Node = null;

    @property(cc.Prefab)

    dicesStatisticPrefab: cc.Prefab = null;

    public finishShakeThePlate: boolean = false;

    bigStatistic: number = 0;
    smallStatistic: number = 0;
    anyTripleStatistic: number = 0;
    specific1Statistic: number = 0;
    specific2Statistic: number = 0;
    specific3Statistic: number = 0;
    specific4Statistic: number = 0;
    specific5Statistic: number = 0;
    specific6Statistic: number = 0;

    private statisticComponent: SicBoStatistic;
    private miniRoundHistory: SicBoRoundHistory;
    private userHistoryComponent: SicBoHistory;
    private dicesStatisticComponent: SicBoDicesStatistic;

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
        this.initRoundHistory();
        //this.initBetChoiceStatistic();
        this.initDicesStatistic();
    }

    initDicesStatistic() {
        const dicesStatistic = cc.instantiate(this.dicesStatisticPrefab);
        this.dicesStatisticComponent = dicesStatistic.getComponent(SicBoDicesStatistic);
        this.dicesStatisticComponent.init(this);

        this.dicesStatisticContainer.addChild(dicesStatistic);
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
        if (data.history && this.userHistoryComponent) {
            this.userHistoryComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(SicBoGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    openHistory() {
        let dialog = cc.instantiate(this.historyPrefab);
        this.userHistoryComponent = dialog.getComponent(SicBoHistory);
        this.userHistoryComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    openStatistic() {
        let dialog = cc.instantiate(this.statsPrefab);
        this.statisticComponent = dialog.getComponent(SicBoStatistic);
        this.statisticComponent.init(this);
        this.currentMiniPanel.node.addChild(dialog);
    }

    initBetChoiceStatistic() {
        this.betChoiceStatistic.children.forEach(choice => {
            const label = choice.getComponent(cc.Label);
            label.string = "";
        })
    }

    resetStatistic() {
        this.bigStatistic = 0;
        this.smallStatistic = 0;
        this.anyTripleStatistic = 0;
        this.specific1Statistic = 0;
        this.specific2Statistic = 0;
        this.specific3Statistic = 0;
        this.specific4Statistic = 0;
        this.specific5Statistic = 0;
        this.specific6Statistic = 0;
    }

    updateStatistic(data: any) {
        this.dicesStatisticComponent.updateData(data);

    }

    initRoundHistory() {
        const node = cc.instantiate(this.roundHistoryPrefab);
        this.miniRoundHistory = node.getComponent(SicBoRoundHistory);;
        this.roundHistoryContainer.addChild(node);
    }

    updateRoundHistory(data) {
        this.miniRoundHistory.setData(data);
    }
}
