import { scoreBoard } from "../../../../../ClientModules";
import BigRoadItem from "../../../../_baccarat/view-models/base/BigRoadItem";
import { WinThreeCardsSettlementResult } from "../../../view-models/event-models/WinThreeCardsSettlementResult";
import WinThreeCardsBigRoadDot from "./WinThreeCardsBigRoadDot";

const { ccclass, property } = cc._decorator;
const ROW_NUMBER = 6;

@ccclass
export default class WinThreeCardsBigRoadItem extends BigRoadItem {
    @property(cc.Node)
    nodes: cc.Node[] = [];

    @property(cc.Prefab)
    prefabDot: cc.Prefab = null;

    @property(cc.Node)
    containerDot: cc.Node = null;

    protected hasValueArray: boolean[] = [];
    protected componentNode: WinThreeCardsBigRoadDot[] = [];

    protected onLoad(): void {
        for (let i = 0; i < ROW_NUMBER; i++) {
            const dot = cc.instantiate(this.prefabDot);
            this.nodes.push(dot);
            this.componentNode.push(dot.getComponent("WinThreeCardsBigRoadDot"));
            this.containerDot.addChild(dot);
        }
        this.hasValueArray = this.nodes.map(() => false);
    }

    resetNode(bigRoadScoreboardPoint: scoreBoard.BigRoadScoreboardPoint<WinThreeCardsSettlementResult>) {
        const componentNode = this.componentNode[bigRoadScoreboardPoint.y];
        componentNode.resetNode();
        this.hasValueArray[bigRoadScoreboardPoint.y] = false;
    }

    renderNode(bigRoadScoreboardPoint: scoreBoard.BigRoadScoreboardPoint<WinThreeCardsSettlementResult>) {
        const componentNode = this.componentNode[bigRoadScoreboardPoint.y];
        const baccaratSettleResult = bigRoadScoreboardPoint.data;
        componentNode.dragon.active = baccaratSettleResult[0].dragon;
        componentNode.phoenix.active = baccaratSettleResult[0].phoenix;
        const tieCount = baccaratSettleResult[0].tie ? baccaratSettleResult.length : baccaratSettleResult.length - 1;

        if (tieCount >= 1) {
            componentNode.tie.active = true;
        }

        if (tieCount > 1) {
            componentNode.count.active = true;
            componentNode.count.getComponent(cc.Label).string = tieCount.toString();
        }
        this.hasValueArray[bigRoadScoreboardPoint.y] = true;
    }

    renderNextNode() {
        const row = this.hasValueArray.findIndex((value) => !value);
        const componentNode = this.componentNode[row];
        componentNode.next.active = true;
    }
}
