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
    x3SpriteFrame: cc.SpriteFrame = null;

    @property(cc.Animation)
    shakeAnimation: cc.Animation = null;

    @property(cc.Node)
    displayResultNode: cc.Node = null;

    @property(cc.Label)
    displayResultLabel: cc.Label = null;

    private statsComponent: VipFishPrawnCrabStats;
    private historyComponent: VipFishPrawnCrabHistory;

    public finishShakeThePlate: boolean = false;
    private resultTextMapper = {
        0: "Nai",
        1: "Bầu",
        2: "Gà",
        3: "Cá",
        4: "Cua",
        5: "Tôm",
    };

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
    }

    initStats() {
        const node = cc.instantiate(this.statsPrefab);
        this.statsComponent = node.getComponent(VipFishPrawnCrabStats);
        this.statsContainer.addChild(node);
    }

    updateStats() {
        const roundResults = this.currentDataLogs.map((log) => log.result);
        this.statsComponent.renderData(roundResults);
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
            const { result, settlementResult } = this.currentDataLogs[0];
            const resultArray = _.values(result);

            this.setDices(resultArray);
            this.betItems.forEach((betItem: VipFishPrawnCrabBetItem) => {
                const choice = betItem.node.name;
                betItem.setHighlight(settlementResult[choice], true);

                if (_.keys(constants.resultMapper).indexOf(choice) >= 0) {
                    const xValue = resultArray.filter(value => value == constants.resultMapper[choice]).length;
                    xValue > 1 && betItem.setXSpriteFrame(xValue == 2 ? this.x2SpriteFrame : this.x3SpriteFrame);
                }
            });
            this.updateStats();
        }
    }

    setDices(dices: number[]) {
        const resultText = [];

        dices.forEach((dice, index) => {
            this.dices[index].spriteFrame = this.characterIcons[dice];
            this.dices[index].node.active = true;
            resultText.push(this.resultTextMapper[dice]);
        });

        this.displayResultLabel.string = resultText.join(" - ");
    }

    resetDataAndUI() {
        console.log("VipFishPrawnCrab resetDataAndUI");
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
                    xValue > 1 && betItem.setXSpriteFrame(xValue == 2 ? this.x2SpriteFrame : this.x3SpriteFrame, false);
                }
            });
        }
    }
}
