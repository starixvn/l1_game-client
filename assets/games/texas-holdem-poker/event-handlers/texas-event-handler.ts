import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import TexasGameDataModel from "../event-models/texas-game-data-model";

export default class TexasEventHandler<Event, Choices> extends BaseEventHandler<Event, Choices> {
    protected readonly gameData: TexasGameDataModel<Choices>;
}
