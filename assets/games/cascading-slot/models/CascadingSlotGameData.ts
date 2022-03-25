import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import CascadingSlotFinishHandler from "../handlers/CascadingSlotFinishHandler";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotFinishModel } from "./CascadingSlotFinishModel";

export default class CascadingSlotGameData<Choices> extends GameData<Choices> {
    static Events = {};

    finishModel: CascadingSlotFinishModel;

    constructor(mainGame: CascadingSlotBase) {
        super();
        this.finishModel = new CascadingSlotFinishModel();
    }

    protected registerEventHandlers() {
        const handlers = [CascadingSlotFinishHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
