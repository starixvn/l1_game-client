import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import CascadingSlotFinishHandler from "../handlers/CascadingSlotFinishHandler";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotFinishModel } from "./CascadingSlotFinishModel";
import CascadingSlotPlaceBetModel from "./CascadingSlotPlaceBetModel";
import CascadingUIModel from "./CascadingUIModel";

export default class CascadingSlotGameData<Choices> extends GameData<Choices> {
    static Events = {};

    finishModel: CascadingSlotFinishModel;
    placeBetModel: CascadingSlotPlaceBetModel;
    uiModel: CascadingUIModel;

    constructor(mainGame: CascadingSlotBase) {
        super();
        this.finishModel = new CascadingSlotFinishModel();
        this.placeBetModel = new CascadingSlotPlaceBetModel();
        this.uiModel = new CascadingUIModel();
    }

    protected registerEventHandlers() {
        const handlers = [CascadingSlotFinishHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
