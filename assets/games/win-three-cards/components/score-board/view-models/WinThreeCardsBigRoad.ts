import BaccaratBigRoad from "../../../../_baccarat/view-models/BaccaratBigRoad";
import WinThreeCardsBigRoadItem from "./WinThreeCardsBigRoadItem";
import { BigRoadScoreboard, Converter } from "sc-scoreboards";
import { WinThreeCardsSettlementResult } from "../../../view-models/event-models/WinThreeCardsSettlementResult";
const { ccclass } = cc._decorator;

class WinThreeCardsConverter extends Converter<WinThreeCardsSettlementResult> {
    positiveKey() {
        return "dragon";
    }
}

@ccclass
export default class WinThreeCardsBigRoad extends BaccaratBigRoad {
    initialBigRoad = (): any => {
        const converter = new WinThreeCardsConverter();

        return new BigRoadScoreboard({ height: 6, converter });
    };

    getComponentItem(node: cc.Node): any {
        return node.getComponent(WinThreeCardsBigRoadItem);
    }
}
