import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import SpinButtonStateModel from "./SpinButtonStateModel";

export default class FeatureSlotGameData extends GameData {
    static Events = {};

    spinButtonStateModel: SpinButtonStateModel;

    constructor(mainGame: CascadingSlotBase) {
        super();
        this.spinButtonStateModel = new SpinButtonStateModel();
    }
}
