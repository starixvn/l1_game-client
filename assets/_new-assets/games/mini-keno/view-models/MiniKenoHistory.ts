const { ccclass, property } = cc._decorator;

import GameHistoryBase from "../../_base/GameHistoryBase";
import DropDownOption from "../../../common/drop-down-list/view-models/DropDownOption";
import DropDownList from "../../../common/drop-down-list/view-models/DropDownList";

@ccclass
export default class MiniKenoHistory extends GameHistoryBase {

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Node)
    dropDownList: cc.Node = null;

    private options: DropDownOption[] = [
        new DropDownOption("kenoProViet", "Keno Pro Việt"),
        new DropDownOption("kenoMax", "Keno Max"),
        new DropDownOption("kenoMax2", "Keno Max 2"),
        new DropDownOption("kenoMini", "Keno Mini"),
        new DropDownOption("kenoMini2", "Keno Mini 2"),
        new DropDownOption("kenoEast", "Keno Đông"),
        new DropDownOption("kenoWest", "Keno Tây"),
        new DropDownOption("kenoSouth", "Keno Nam"),
        new DropDownOption("kenoNorth", "Keno Bắc"),
    ];

    onLoad() {
        this.initDropDown();
    }

    initDropDown() {
        const dropDown: DropDownList = this.dropDownList.getComponent("DropDownList");
        dropDown.init(this.options);
    }

    onData(data) {

    }
}
