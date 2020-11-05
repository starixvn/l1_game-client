import { games } from "../../../SabaConfigs";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import VipFishPrawnCrabBetHandler from "./handlers/VipFishPrawnCrabBetHandler";
import VipFishPrawnCrabFinishHandler from "./handlers/VipFishPrawnCrabFinishHandler";
import VipFishPrawnCrabLogsHandler from "./handlers/VipFishPrawnCrabLogsHandler";
import VipFishPrawnCrabConfigs from "./VipFishPrawnCrabConfigs";
import VipFishPrawnCrabGuide from "./VipFishPrawnCrabGuide";
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

    private statsComponent: VipFishPrawnCrabStats;
    private historyComponent: VipFishPrawnCrabHistory;

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
    }

    setResult() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];
            this.setDices(Object.values(result));
            this.betItems.forEach(betItem => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
            this.updateStats();
        }
    }

    setDices(dices: number[]) {
        dices.forEach((dice, index) => {
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
        // this.gameConfigs.odds && this.betItems.forEach(item => item.setOdd(this.gameConfigs.odds[item.node.name]));
    }

    openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(VipFishPrawnCrabGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }
}
