import CascadingSlotConfigHandler from "../handlers/CascadingSlotConfigHandler";
import CascadingSlotFinishHandler from "../handlers/CascadingSlotFinishHandler";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotConfigModel } from "./CascadingSlotConfigModel";
import { CascadingSlotFinishModel } from "./CascadingSlotFinishModel";
import CascadingSlotPlaceBetModel from "./CascadingSlotPlaceBetModel";
import CascadingUIModel from "./CascadingUIModel";
import FeatureSlotGameData from "./FeatureSlotGameData";

export default class CascadingSlotGameData<Choices> extends FeatureSlotGameData<Choices> {
    static Events = {};

    finishModel: CascadingSlotFinishModel;
    placeBetModel: CascadingSlotPlaceBetModel;
    uiModel: CascadingUIModel;
    gameConfig: CascadingSlotConfigModel;

    constructor(mainGame: CascadingSlotBase) {
        super(mainGame);
        this.finishModel = new CascadingSlotFinishModel();
        this.placeBetModel = new CascadingSlotPlaceBetModel();
        this.uiModel = new CascadingUIModel();
        this.gameConfig = new CascadingSlotConfigModel();
    }

    protected registerEventHandlers() {
        const handlers = [CascadingSlotFinishHandler, CascadingSlotConfigHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
