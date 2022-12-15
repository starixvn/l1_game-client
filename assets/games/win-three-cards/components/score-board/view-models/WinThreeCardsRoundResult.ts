import { WinThreeCardsResultCards, WinThreeCardsSettlementResult } from "../../../view-models/models/WinThreeCardsModel";
import { convertRank, getCardsResult } from "../../../helper";
const { ccclass, property } = cc._decorator;

enum OrderNode {
    dragon = 0,
    phoenix
}
@ccclass
export default class WinThreeCardsRoundResult extends cc.Component {
    @property(cc.Node)
    backgroundNode: cc.Node[] = [];

    @property(cc.Label)
    textLabel: cc.Label[] = [];

    private readonly infoNameNode = ["dragon", "phoenix"];

    changeColorText(settlementResult: WinThreeCardsSettlementResult) {
        const color = cc.Color.WHITE;
        if (settlementResult.dragon || settlementResult.phoenix) {
            this.textLabel.forEach((label) => {
                label.node.color = color;
            });
        }

        if (!settlementResult.dragon) {
            this.textLabel[OrderNode.dragon].node.color = color.fromHEX("#008fff");
        }

        if (!settlementResult.phoenix) {
            this.textLabel[OrderNode.phoenix].node.color = color.fromHEX("#f62d2d");
        }
    }

    changeBackgroundColor(settlementResult: WinThreeCardsSettlementResult) {
        this.infoNameNode.forEach((name: string, index: number) => {
            this.backgroundNode[index].active = settlementResult[name];
        });
    }

    changeValueText(result: WinThreeCardsResultCards) {
        this.infoNameNode.forEach((name: string, index: number) => {
            this.textLabel[index].string = `${getCardsResult(result[name].handRankId)} ${convertRank(+result[name].cardRankId)}`;
        });
    }
}
