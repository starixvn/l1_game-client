import TexasEventHandler from "./texas-event-handler";
import { CasinoSwapDataType } from "../../_casino/event-models/CasinoDataType";

export default class TexasSwapHandler<Choices> extends TexasEventHandler<CasinoSwapDataType, Choices> {
    protected verifyEvent(event: CasinoSwapDataType) {
        return !!event.swap;
    }

    protected handle(event: CasinoSwapDataType) {
        const { player, combinationResult, roundId } = event.swap;
        this.gameData.stateModel.swapping();
        this.gameData.swapModel.changeDataAfterSwap(player, combinationResult, roundId);
    }
}
