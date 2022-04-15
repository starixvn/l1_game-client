import HoldemPokerEventHandler from "./HoldemPokerEventHandler";
import { CasinoSwapDataType } from "../../_casino/event-models/CasinoDataType";

export default class HoldemPokerSwapHandler<Choices> extends HoldemPokerEventHandler<CasinoSwapDataType, Choices> {
    protected verifyEvent(event: CasinoSwapDataType) {
        return !!event.swap;
    }

    protected handle(event: CasinoSwapDataType) {
        const { player, combinationResult, roundId } = event.swap;
        this.gameData.stateModel.swapping();
        this.gameData.swapModel.changeDataAfterSwap(player, combinationResult, roundId);
    }
}
