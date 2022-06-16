import * as i18n from "i18n/runtime-scripts/LanguageData";
import { BaccaratSettlementResult } from "./../../baccarat/view-models/event-models/BaccaratSettlementResult";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const showLabelWinning =
    (main: BlockchainBaccarat) =>
    (resultData: BaccaratSettlementResult, isAnimated = true) => {
        const winNoticeNode = main.winNoticeLabel.node.parent;
        const keys = getLowercaseObjectKeys(resultData);
        let key = "tie_win";
        main.betOptionsUI?.betItems.forEach((item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));

        if (resultData.banker) {
            key = "banker_win";
        } else if (resultData.player) {
            key = "player_win";
        }
        main.winNoticeLabel.string = i18n.t(`ui.${key}`).toUpperCase();
        winNoticeNode.active = true;
    };

export const showHighLightBet =
    (main: BlockchainBaccarat) =>
    (resultData: BaccaratSettlementResult, isAnimated = true) => {
        const keys = getLowercaseObjectKeys(resultData);
        main.betOptionsUI?.betItems.forEach((item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));
    };
