import { i18n } from "../../../../ClientModules";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { formatOdds, numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    setData(data: any, choice: string, index: number, isWin: boolean) {
        this.time.string = getStringDateByTime(data.time);
        this.odd.string = cc.RedT?.user?.fractionalOddsFormat ? numberWithCommas(+data.odds[choice] - 1, 2) : data.odds[choice];
        this.betChoice.string = this.renderBetChoice(choice);
        this.stake.string = numberWithCommas(data[choice], 2);
        this.win.string = isWin ? numberWithCommas(data[choice] * data.odds[choice], 2) : 0;
        this.bgRow.active = index % 2 > 0;
        if (isWin) {
            this.betChoice.node.color = cc.Color.YELLOW;
            this.stake.node.color = cc.Color.YELLOW;
            this.odd.node.color = cc.Color.YELLOW;
        }
    }

    renderBetChoice(choice: string) {
        const textArr = choice.split(/([0-9]+)/);
        const textStr = textArr[0];
        let text = textStr.charAt(0).toUpperCase() + textStr.slice(1);
        let numberStr = "";
        if (textArr.length > 1) {
            numberStr = textArr[1]
                .split("")
                .map((a) => a + " ")
                .join("");
        } else {
            const choice = `ui.choice_${textStr}`;
            text = i18n.t(choice);
        }

        return numberStr + text;
    }
}
