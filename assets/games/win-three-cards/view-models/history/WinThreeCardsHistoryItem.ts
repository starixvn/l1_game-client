import AudioManager from "../../../../common/audio/AudioManager";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import NewCard from "../../../../common/new-card/view-models/NewCard";
import { WinThreeCardsBetData } from "./WinThreeCardsHistory";
import WinThreeCardsHistoryResult from "./WinThreeCardsHistoryResult";

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

    @property({ type: NewCard })
    cards: NewCard[] = [];

    @property({type: WinThreeCardsHistoryResult})
    cardResultDragon: WinThreeCardsHistoryResult;

    @property({type: WinThreeCardsHistoryResult})
    cardResultPhoenix: WinThreeCardsHistoryResult;

    data: WinThreeCardsBetData = null;

    public showTicketDetail = (data: any) => {};    

    setData(betData: WinThreeCardsBetData) {
        this.data = betData;
        const dragonCards = betData.result.dragon;
        const phoenixCards = betData.result.phoenix;

        this.timeLabel.string = getStringDateByTime(betData.time);
        this.roundLabel.string = betData.phien;
        this.winLabel.string = numberWithCommas(betData.betwin, 2);
        this.amountLabel.string = this.summarizeBet(betData);        
        this.cardResultDragon && this.cardResultDragon.setData(dragonCards);
        this.cardResultPhoenix && this.cardResultPhoenix.setData(phoenixCards);
    }

    showBackground(show: boolean) {
        this.bgRow.active = show;
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
        const { betLogDetails, odds, settlementResult } = this.data;
        console.log(this.data.betLogDetails);

        // const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        // this.historyMainNode.ticketDetailContent.addChild(ticketDetailPrefab);

        // const ticketDetailComponent = ticketDetailPrefab.getComponent(FruitSlotTicketDetail);
        // ticketDetailComponent.setData(betLogDetails, settlementResult);
        // ticketDetailComponent.showbetLogs(this.symbolSprites, odds, this.betLog);
    }
}
