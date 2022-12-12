import { BigRoadScoreboardPoint } from "sc-scoreboards";
import BigRoadItem from "../../../../_baccarat/view-models/base/BigRoadItem";
import { WinThreeCardsSettlementResult } from "../../../view-models/event-models/WinThreeCardsSettlementResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinThreeCardsBigRoadItem extends BigRoadItem {
    protected NodeItems = {
        DRAGON: "dragon",
        PHOENIX: "phoenix",
        TIE: "tie",
        COUNT: "count",
        NEXT: "next"
    };

    @property([cc.Node])
    nodes: cc.Node[] = [];

    protected hasValueArray: boolean[] = [];

    protected onLoad(): void {
        this.hasValueArray = this.nodes.map(() => false);
    }

    resetNode(bigRoadScoreboardPoint: BigRoadScoreboardPoint<WinThreeCardsSettlementResult>) {
        const node = this.nodes[bigRoadScoreboardPoint.y];
        node.getChildByName(this.NodeItems.DRAGON).active = false;
        node.getChildByName(this.NodeItems.PHOENIX).active = false;
        node.getChildByName(this.NodeItems.TIE).active = false;
        node.getChildByName(this.NodeItems.NEXT).active = false;
        node.getChildByName(this.NodeItems.COUNT).getComponent(cc.Label).string = "";
        this.hasValueArray[bigRoadScoreboardPoint.y] = false;
    }

    renderNode(bigRoadScoreboardPoint: BigRoadScoreboardPoint<WinThreeCardsSettlementResult>) {
        const node = this.nodes[bigRoadScoreboardPoint.y];
        const baccaratSettleResult = bigRoadScoreboardPoint.data;

        node.getChildByName(this.NodeItems.DRAGON).active = baccaratSettleResult[0].dragon;
        node.getChildByName(this.NodeItems.PHOENIX).active = baccaratSettleResult[0].phoenix;

        const tieCount = baccaratSettleResult[0].tie ? baccaratSettleResult.length : baccaratSettleResult.length - 1;

        if (tieCount >= 1) {
            node.getChildByName(this.NodeItems.TIE).active = true;
        }

        if (tieCount > 1) {
            node.getChildByName(this.NodeItems.COUNT).active = true;
            node.getChildByName(this.NodeItems.COUNT).getComponent(cc.Label).string = tieCount.toString();
        }
        this.hasValueArray[bigRoadScoreboardPoint.y] = true;
    }

    renderNextNode() {
        const row = this.hasValueArray.findIndex((value) => !value);
        const node = this.nodes[row];
        node.getChildByName(this.NodeItems.NEXT).active = true;
    }

    isFilledColumn() {
        return this.hasValueArray.every((value) => value);
    }

    resetAll() {
        this.nodes.forEach((node) => {
            node.children.forEach((child) => {
                child.active = false;
            });
        });
        this.hasValueArray = this.nodes.map(() => false);
    }
}
