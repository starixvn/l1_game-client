import GameUtils from "../../../common/GameUtils";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import NewCard from "../../../common/new-card/view-models/NewCard";
import { ThreeCardsBetData } from "./DataDefinition";
import ThreeCardsResultItem from "./ThreeCardsResultItem";
import ThreeCardsWinChoiceView from "./ThreeCardsWinChoiceView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(ThreeCardsWinChoiceView)
    winChoices: ThreeCardsWinChoiceView = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    betWin: cc.Label = null;

    @property({ type: NewCard })
    cards: NewCard[] = [];

    @property(cc.Node)
    bg: cc.Node = null;

    data: ThreeCardsBetData = null;

    public showTicketDetail = (data: any) => {};

    setData(betData: ThreeCardsBetData) {
        this.data = betData;

        this.time.string = getStringDateByTime(betData.time);
        this.round.string = betData.phien;
        this.betWin.string = numberWithCommas(betData.betwin);
        this.winChoices.setData(betData);
        this.bet.string = this.summarizeBet(betData);
        this.cards.forEach((card, i) => {
            card.setCard(betData.result[i]);
            card.faceUp();
        });
    }

    showBackground(show: boolean) {
        this.bg.active = show;
    }

    public static generateWinChoices(data: ThreeCardsBetData): string {
        const keys = ["red", "black", "diamonds", "hearts", "spades", "clubs"];
        const { settlementResult } = data;
        let winString = "";
        keys.forEach((key, i) => {
            if (settlementResult[key]) {
                if (i > 0 && winString.length > 0) {
                    winString += ", ";
                }
                const choice = GameUtils.getBetChoiceString(key);

                if (key === "red" || key === "diamonds" || key === "hearts") {
                    winString += `<color=#ff0000>${choice}</c>`;
                } else {
                    winString += choice;
                }
            }
        });

        return winString;
    }

    summarizeBet(data: ThreeCardsBetData): string {
        const keys = ["red", "black", "diamonds", "hearts", "spades", "clubs"];

        let total = 0;
        keys.forEach((key) => {
            total += data[key];
        });
        return numberWithCommas(total);
    }

    openTicketDetail() {
        cc.RedT.audio.playClick();
        this.showTicketDetail(this.data);
    }
}
