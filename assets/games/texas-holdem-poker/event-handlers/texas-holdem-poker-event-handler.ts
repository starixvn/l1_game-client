import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import TexasHoldemPokerGameData from "./../event-models/texas-holdem-poker-game-data";

export default class TexasHoldemPokerHandler<Event, Choices> extends BaseEventHandler<Event, Choices> {
    protected readonly gameData: TexasHoldemPokerGameData<Choices>;
}
