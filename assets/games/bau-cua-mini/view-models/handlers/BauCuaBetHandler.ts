import GameRoomBaseBetHandler from "../../../_base/handlers/GameRoomBaseBetHandler";
import BauCua from "../BauCua";

export default class BauCuaBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: BauCua) {
        super(main);
    }
}
