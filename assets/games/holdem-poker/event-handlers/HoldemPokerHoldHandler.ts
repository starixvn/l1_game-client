import HoldemPokerEventHandler from "./HoldemPokerEventHandler";
import { CasinoHoldDataType } from "../../_casino/event-models/CasinoDataType";

export default class HoldemPokerHoldHandler<Choices> extends HoldemPokerEventHandler<CasinoHoldDataType, Choices> {
    protected verifyEvent(event: CasinoHoldDataType) {
        return !!event.hold;
    }

    protected handle(event: CasinoHoldDataType) {
        const { player, roundId, combinationResult, communityCards } = event.hold;
        this.gameData.stateModel.holding();

        const data = { playerCards: player, combinationResult, roundId, communityCards };
        this.gameData.holdModel.changeDataAfterHold(data);
    }
}
