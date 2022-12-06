import AudioManager from "../../../../common/audio/AudioManager";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import { WinThreeCardsBetData } from "./WinThreeCardsHistory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinThreeCardsHistoryItem extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    // @property(cc.Node)
    // bottomLine: cc.Node = null;    

    data: WinThreeCardsBetData = null;

    public showTicketDetail = (data: any) => {};    

    setData(betData: WinThreeCardsBetData) {
        this.data = betData;

        this.timeLabel.string = getStringDateByTime(betData.time);
        this.roundLabel.string = betData.phien;
        this.winLabel.string = numberWithCommas(betData.betwin, 2);
        //this.winChoices && this.winChoices.setData(betData);
        this.amountLabel.string = this.summarizeBet(betData);
    }

    showBackground(show: boolean) {
        this.bgRow.active = show;
        //this.bottomLine.active = !show;
    }

    summarizeBet(data: WinThreeCardsBetData): string {
        const keys = ["dragon", "phoenix", "pair8Plus", "threeOfAKind", "straightFlush", "flush", "straight"];

        let total = 0;
        keys.forEach((key) => {
            total += data[key];
        });
        return numberWithCommas(total);
    }

    openTicketDetail() {
        AudioManager.getInstance().playClick();
        this.showTicketDetail(this.data);
    }
}
