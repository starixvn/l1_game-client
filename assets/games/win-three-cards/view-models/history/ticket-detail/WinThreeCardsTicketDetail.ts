import GameTicketDetailBase from "../../../../_base/view-models/GameTicketDetailBase";
import { WinThreeCardsBetData  } from "../WinThreeCardsHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WinThreeCardsTicketDetail extends GameTicketDetailBase {
    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    fruitSlotTicketDetailGroup: cc.Prefab = null;

    @property(cc.Node)
    groupContent: cc.Node = null;

    @property(cc.Label)
    round: cc.Label = null;

    

    setData(data: WinThreeCardsBetData) {
        this.round.string = data.phien;
        // this.cards &&
        //     this.cards.forEach((card, i) => {
        //         card.setCard(data.result[i]);
        //         card.faceUp();
        //     });
        //this.winChoices && this.winChoices.setData(data);
        //this.itemPrefab && this.createDetailItems(data);
    }
}
