import { convertOldRank } from "./../../holdem-poker/components/cards/view-models/CardWrapper";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasMD5 extends HoldemPockerMD5 {
    protected readonly suffixIcon = ["♥", "♦", "♣", "♠"];
    private readonly limitSting = 26;

    createResultDetails(data: any) {
        const { cards, suffix } = data.formatValue;
        this.setCaptionAndHintForMD5(true);
        this.setCopyString(data.rawValue);

        let resultFormatting = "";
        cards.forEach((card, index) => {
            const startSquareBracket = index === 0 ? `<color=#ffffff>{</color>` : "";
            const endSquareBracket = index === cards.length - 1 ? `<color=#ffffff>}</color>` : "";
            const comma = index === cards.length - 1 ? "" : index === 1 || index === 3 ? `<color=#ffffff>, </color>` : " ";
            const cardValue =
                card.suit > 1
                    ? `<color=#000000>${convertOldRank(card.rank)}${this.suffixIcon[card.suit]}</color>`
                    : `<color=#E92E2E>${convertOldRank(card.rank)}${this.suffixIcon[card.suit]}</color>`;
            resultFormatting += `${startSquareBracket}${cardValue}${comma}${endSquareBracket}`;
        });
        const suffixFormatting = `<color=#ffffff>{#${suffix}}</color>`;
        const md5String = `${resultFormatting}_${suffixFormatting}`;
        console.log(md5String);
        this.md5Value.string = `${resultFormatting}_${suffixFormatting}`.substring(0, 357) + "...";
    }
}
