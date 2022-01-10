import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type HoldemPokerFinish<Choices> = {
  finish: {
    settlementResult: {
      aa: number;
      ante: number;
      call: number;
    };
  };
};

export default class HoldemPokerFinishHandler<Choices> extends HoldemPokerEventHandler<HoldemPokerFinish<Choices>, Choices> {
  protected verifyEvent(event: HoldemPokerFinish<Choices>) {
    return !!event.finish;
  }

  protected handle(event: HoldemPokerFinish<Choices>) {
    this.gameData.isProcessingBet = false;
    const { settlementResult } = event.finish;

    this.gameData.emit(HoldemPokerGameData.Events.SETTLED, this);
    this.gameData.finishModel.changeSettlementResult(settlementResult);
  }
}
