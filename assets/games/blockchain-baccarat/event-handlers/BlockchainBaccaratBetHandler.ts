import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export default class BlockchainBaccaratBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: BlockchainBaccarat) {
        super(main);
    }
}
