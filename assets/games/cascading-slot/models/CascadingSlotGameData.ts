import { CascadingSlotApiErrorHandler } from "../handlers/CascadingSlotApiErrorHandler";
import CascadingSlotConfigHandler from "../handlers/CascadingSlotConfigHandler";
import CascadingSlotFinishHandler from "../handlers/CascadingSlotFinishHandler";
import { CascadingSlotIngameHandler } from "../handlers/CascadingSlotIngameHandler";
import { CascadingSlotTrialHandler } from "../handlers/CascadingSlotTrialHandler";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { CascadingSlotConfigModel } from "./CascadingSlotConfigModel";
import { CascadingSlotFinishModel } from "./CascadingSlotFinishModel";
import CascadingSlotPlaceBetModel from "./CascadingSlotPlaceBetModel";
import { CascadingSlotStateModel } from "./CascadingSlotStateModel";
import { CascadingSlotTrialModel } from "./CascadingSlotTrialModel";
import CascadingUIModel from "./CascadingUIModel";
import FeatureSlotGameData from "./FeatureSlotGameData";

export default class CascadingSlotGameData<Choices> extends FeatureSlotGameData<Choices> {
    static Events = {};

    finishModel: CascadingSlotFinishModel;
    placeBetModel: CascadingSlotPlaceBetModel;
    uiModel: CascadingUIModel;
    gameConfig: CascadingSlotConfigModel;
    stateModel: CascadingSlotStateModel;
    trialModel: CascadingSlotTrialModel;

    constructor(mainGame: CascadingSlotBase) {
        super(mainGame);
        this.finishModel = new CascadingSlotFinishModel();
        this.placeBetModel = new CascadingSlotPlaceBetModel();
        this.uiModel = new CascadingUIModel();
        this.gameConfig = new CascadingSlotConfigModel();
        this.stateModel = new CascadingSlotStateModel();
        this.trialModel = new CascadingSlotTrialModel();
    }

    protected registerEventHandlers() {
        const handlers = [
            CascadingSlotIngameHandler,
            CascadingSlotFinishHandler,
            CascadingSlotApiErrorHandler,
            CascadingSlotConfigHandler,
            CascadingSlotTrialHandler
        ];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
