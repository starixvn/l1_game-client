import { limitMD5String, suffixIcon } from "./../texas-contants";
import { convertOldRank } from "./../../holdem-poker/components/cards/view-models/CardWrapper";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasMD5 extends HoldemPockerMD5 {
    createResultDetails(data: any) {
        const { cards, suffix } = data.formatValue;
        this.setCaptionAndHintForMD5(true);
        this.setCopyString(data.rawValue);

        const resultFormatting = this.formatMD5String(cards, "{", "}");
        const suffixFormatting = `<color=#ffffff>{#${suffix}}</color>`;
        this.md5Value.string = `${resultFormatting}_${suffixFormatting}`.substring(0, limitMD5String) + "...";
    }

    convertRankCard(card: any) {
        return convertOldRank(card.rank) + suffixIcon[card.suit];
    }
}
