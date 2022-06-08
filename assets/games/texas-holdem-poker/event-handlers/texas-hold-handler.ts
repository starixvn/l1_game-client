import TexasEventHandler from "./texas-event-handler";
import { CasinoHoldDataType } from "../../_casino/event-models/CasinoDataType";

export default class TexasHoldHandler<Choices> extends TexasEventHandler<CasinoHoldDataType, Choices> {
    protected verifyEvent(event: CasinoHoldDataType) {
        return !!event.hold;
    }

    protected handle(event: CasinoHoldDataType) {
        const { player, roundId, combinationResult } = event.hold;
        this.gameData.stateModel.holding();
        this.gameData.holdModel.changeDataAfterHold({ playerCards: player, combinationResult, roundId });
    }
}
