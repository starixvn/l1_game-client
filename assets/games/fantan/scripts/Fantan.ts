import StandAloneTableGameBase from "../../_base_new/view-models/StandAloneTableGameBase";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import { FantanConfig, FantanId } from "./FantanConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fantan extends StandAloneTableGameBase {
    constructor() {
        super();
        this.gameId = FantanId;
        this.setConfig(FantanConfig);
    }
}
