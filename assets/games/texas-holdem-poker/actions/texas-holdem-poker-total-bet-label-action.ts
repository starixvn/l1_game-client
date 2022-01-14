import { updateTotalBetLabel } from "./texas-holdem-poker-place-bet-actions";
import { TexasHoldemPokerPlaceBetModel } from "./../event-models/texas-holdem-poker-place-bet-model";
import MicroUIAction from "./texas-holdem-poker-microUI-action";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TotalBetLabel extends MicroUIAction {
  handleUI() {
    const totalBetLabel = this.nodeTree.getComponent(cc.Label);
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.PLACE_BET, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.DOUBLE, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.CLEAR_BETS, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.CALL, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.TURN, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.RIVER, updateTotalBetLabel(totalBetLabel));
    this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.UPDATE_TOTAL_BET,  updateTotalBetLabel(totalBetLabel))
  }
}
