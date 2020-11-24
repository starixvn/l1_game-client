import * as _ from "lodash";

import { games } from "../../../SabaConfigs";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import VipFishPrawnCrabBetHandler from "./handlers/VipFishPrawnCrabBetHandler";
import VipFishPrawnCrabFinishHandler from "./handlers/VipFishPrawnCrabFinishHandler";
import VipFishPrawnCrabLogsHandler from "./handlers/VipFishPrawnCrabLogsHandler";
import VipFishPrawnCrabTimeHandler from "./handlers/VipFishPrawnCrabTimeHandler";
import VipFishPrawnCrabBetItem from "./VipFishPrawnCrabBetItem";
import VipFishPrawnCrabConfigs from "./VipFishPrawnCrabConfigs";
import constants from "./VipFishPrawnCrabConstants";
import VipFishPrawnCrabGuide from "./VipFishPrawnCrabGuide";
import VipFishPrawnCrabHistory from "./VipFishPrawnCrabHistory";
import VipFishPrawnCrabOddItem from "./VipFishPrawnCrabOddItem";
import VipFishPrawnCrabStats from "./VipFishPrawnCrabStats";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrab extends NewSocketGameBase {
    public readonly shakeThePlateTime = 48;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property({ type: cc.SpriteFrame })
    characterIcons: cc.SpriteFrame[] = [];

    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property(cc.Animation)
    openDiskAnimation: cc.Animation = null;

    @property(cc.Node)
    statsContainer: cc.Node = null;

    @property(cc.Prefab)
    statsPrefab: cc.Prefab = null;

    @property({ type: VipFishPrawnCrabOddItem })
    oddItems: VipFishPrawnCrabOddItem[] = [];

    @property(cc.SpriteFrame)
    x2SpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x2LastSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3SpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3LastSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Animation)
    shakeAnimation: cc.Animation = null;

    @property(cc.AudioSource)
    shakeAudio: cc.AudioSource = null;

    @property(cc.Node)
    randomResult: cc.Node = null;

    private statsComponent: VipFishPrawnCrabStats;
    private historyComponent: VipFishPrawnCrabHistory;

    public finishShakeThePlate: boolean = false;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("VipFishPrawnCrab", new VipFishPrawnCrabConfigs(), null, 1, games.VipFishPrawnCrab.id);
        this.finishShowResult = false;
    }

    onLoad() {
        super.onLoad();
        this.shakeAnimation.node.active = false;
        this.initStats();
        this.animatedTime.setAnimatedY(30, -5);
    }

    initStats() {
        const node = cc.instantiate(this.statsPrefab);
        this.statsComponent = node.getComponent(VipFishPrawnCrabStats);
        this.statsComponent.init(this);
        this.statsContainer.addChild(node);
    }

    updateStats() {
        this.statsComponent.renderData(this.currentDataLogs);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new VipFishPrawnCrabFinishHandler(this);
        this.logsHandler = new VipFishPrawnCrabLogsHandler(this);
        this.betHandler = new VipFishPrawnCrabBetHandler(this);
        this.timeHandler = new VipFishPrawnCrabTimeHandler(this);
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
            this.betItems.forEach((betItem: VipFishPrawnCrabBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(settlementResult[choice], true);

                if (_.keys(constants.resultMapper).indexOf(choice) >= 0) {
                    const xValue = _.values(result).filter(value => value == constants.resultMapper[choice]).length;
                    xValue > 1 && betItem.setXSpriteFrame(xValue == 2 ? this.x2SpriteFrame : this.x3SpriteFrame);
                }
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
        let dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(VipFishPrawnCrabHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    public updateDisplayForRemoteConfig() {
        this.gameConfigs.odds && this.oddItems.forEach(item => item.setValue(this.gameConfigs.odds[item.node.name]));
    }

    openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(VipFishPrawnCrabGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];

        if (dataLog) {
            this.betItems.forEach((betItem: VipFishPrawnCrabBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(dataLog?.settlementResult[choice], false);
                if (_.keys(constants.resultMapper).indexOf(choice) >= 0) {
                    const xValue = _.values(dataLog?.result).filter(value => value == constants.resultMapper[choice]).length;
                    xValue > 1 && betItem.setXSpriteFrame(xValue == 2 ? this.x2LastSpriteFrame : this.x3LastSpriteFrame);
                }
            });
        }
    }
}
