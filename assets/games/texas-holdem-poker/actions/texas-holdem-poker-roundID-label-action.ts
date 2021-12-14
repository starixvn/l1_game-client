import { TexasHoldemPokerOwnBetModel } from "../event-models/texas-holdem-poker-own-bet-model";
import MicroUIAction from "./texas-holdem-poker-microUI-action";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundIDAction extends MicroUIAction {
    handleUI() {
        this.gameData.ownBets.on(TexasHoldemPokerOwnBetModel.Events.ROUNDID_CHANGE, (roundId) => {
            this.nodeTree.getComponent(cc.Label).string = `#${roundId}`;
        });
    }
}
