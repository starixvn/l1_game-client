import { lazyInject } from "../../../Application";
import GameUtils from "../../../common/GameUtils";
import { games } from "../../../configs/SabaConfigs";
import SlotGameBase from "../../_slotgame_base/SlotGameBase";
import SlotGameTopWinner from "../../_slotgame_base/SlotGameTopWinner";
import FourGuardiansConfig from "./FourGuardiansConfig";
import FourGuardiansGuide from "./FourGuardiansGuide";
import FourGuardiansHistory from "./FourGuardiansHistory";
import { FourGuardiansSlotConfigs } from "./FourGuardiansSlotConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FourGuardians extends SlotGameBase {
    @property(cc.Node)
    deactiveSpinNode: cc.Node = null;

    @lazyInject(FourGuardiansConfig)
    private readonly fourGuardiansConfig: FourGuardiansConfig;

    private historyComponent: FourGuardiansHistory;

    constructor() {
        super();
        this.init("FourGuardians", null, null, 1, games.FourGuardians.id);
    }

    onLoad() {
        super.onLoad();

        this.showJackpotInfo(this.fourGuardiansConfig.jackpotEnabled);
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    initSlotGameConfig() {
        this.slotGameConfigs = new FourGuardiansSlotConfigs();
    }

    onClickShowHistory() {
        super.onClickShowHistory();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(FourGuardiansHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    async onClickShowGuide() {
        super.onClickShowGuide();
        const prefab = await GameUtils.loadResource(this.fourGuardiansConfig.guidePrefabUrl);
        const dialog = cc.instantiate(prefab);
        dialog.getComponent(FourGuardiansGuide).init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    activeSpinButton() {
        super.activeSpinButton();
        this.deactiveSpinNode.active = false;
    }

    deactiveSpinButton() {
        super.deactiveSpinButton();
        this.deactiveSpinNode.active = true;
    }

    onClickShowTopWinner() {
        super.onClickShowTopWinner();

        const dialog = cc.instantiate(this.topWinnerPrefab);
        const topWinnerComponent = dialog.getComponent(SlotGameTopWinner);
        topWinnerComponent.init(this.socket, this.gameName);
        this.currentMiniPanel.node.addChild(dialog);
    }
}
