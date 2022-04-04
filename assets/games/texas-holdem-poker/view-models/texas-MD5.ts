import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";
import { FormatMD5Result } from "../../_casino/MD5Format";
import { CardModel } from "../texas-type";

const { ccclass } = cc._decorator;

@ccclass
export default class TexasMD5 extends HoldemPockerMD5 {
    setMD5Value(cards: CardModel[], suffix: string, roundId: string) {
        this.md5Value.string = FormatMD5Result({
            cards,
            suffix,
            firstCharacter: "{",
            endCharacter: "}",
            suitBlack: "#050f04",
            suitRed: "#ff2626",
            isShowIconSuit: true,
            length: 352,
            roundId
        });
    }
}
