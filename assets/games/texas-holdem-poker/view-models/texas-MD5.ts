import { limitMD5String, suffixIcon } from "./../texas-contants";
import { convertOldRank } from "./../../holdem-poker/components/cards/view-models/CardWrapper";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";
import { CardModel, MD5RawValue } from "../texas-type";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasMD5 extends HoldemPockerMD5 {
    createResultDetails(data: MD5RawValue) {
        const { cards, suffix } = data.formatValue;
        this.setCaptionAndHintForMD5(true);
        this.setCopyString(data.rawValue);

        const resultFormatting = this.formatMD5String(cards, "{", "}");
        const suffixFormatting = `<color=#ffffff>{#${suffix}}</color>`;
        this.md5Value.string = `${resultFormatting}_${suffixFormatting}`.substring(0, limitMD5String) + "...";
    }

    convertRankCard(card: CardModel) {
        return convertOldRank(card.rank) + suffixIcon[card.suit];
    }

    formatCardValue(card: CardModel) {
        return card.suit > 1
            ? `<color=#050f04>${this.convertRankCard(card)}</color>`
            : `<color=#ff2626>${this.convertRankCard(card)}</color>`;
    }
}
