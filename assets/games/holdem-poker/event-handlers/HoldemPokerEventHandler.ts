import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";

export default class HoldemPokerEventHandler<Event, Choices> extends BaseEventHandler<Event, Choices> {
    protected readonly gameData: HoldemPokerGameData<Choices>;
}
