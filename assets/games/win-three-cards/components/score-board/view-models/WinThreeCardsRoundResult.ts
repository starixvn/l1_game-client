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
        this.backgroundNode[OrderNode.dragon].active = settlementResult.dragon;
        this.backgroundNode[OrderNode.phoenix].active = settlementResult.phoenix;
    }

    changeValueText(result: WinThreeCardsResultCards) {
        this.textLabel[OrderNode.dragon].string = `${getCardsResult(result.dragon.handRankId)} ${convertRank(+result.dragon.cardRankId)}`;
        this.textLabel[OrderNode.phoenix].string = `${getCardsResult(result.phoenix.handRankId)} ${convertRank(
            +result.phoenix.cardRankId
        )}`;
    }
}
