const { ccclass, property } = cc._decorator;

import GameHistoryBase from "../../_base/GameHistoryBase";
import DropDownOption from "../../../common/drop-down-list/view-models/DropDownOption";
import DropDownList from "../../../common/drop-down-list/view-models/DropDownList";
import MiniKenoHistoryItem from "./MiniKenoHistoryItem";
import { numberWithCommas, getStringDateByTime } from '../../../common/helpers/Helper';

@ccclass
export default class MiniKenoHistory extends GameHistoryBase {

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Node)
    dropDownList: cc.Node = null;

    private kenoGameDropDownList: DropDownList;

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
        super.onLoad();

        this.initDropDown();
        this.init(this.kenoGameDropDownList.selectedItem.value);
    }

    initDropDown() {
        this.kenoGameDropDownList = this.dropDownList.getComponent("DropDownList");
        this.kenoGameDropDownList.init(this.options, this.onGameChanged.bind(this));
    }

    onGameChanged() {
        this.removeDataObserver(this.gameName)
        this.gameName = this.kenoGameDropDownList.selectedItem.value;
        this.addDataObserver(this.gameName);
        this.getData();
    }

    onData(data) {
        console.log(data);
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.destroyAllChildren();

        if (data.betLogs && data.betLogs.length) {
            for (let index = 0; index < data.betLogs.length; index++) {
                const betLog = data.betLogs[index];
                const { result, settlementResult } = betLog;
                const node = cc.instantiate(this.prefabItem);
                let item: MiniKenoHistoryItem = node.getComponent("MiniKenoHistoryItem");
                item.node.active = true
                item.time.string = getStringDateByTime(betLog.time);
                item.roundId.string = betLog.phien;
                item.win.string = numberWithCommas(betLog.betwin);
                item.win.node.color = betLog.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                let total = 0;
                for (index = 0; index < result.length; index++) {
                    total += result[index];
                }
                item.result.string = total.toString();

                Object.keys(settlementResult).forEach(key => {
                    item[key].string = numberWithCommas(betLog[key]);
                    if (settlementResult[key]) {
                        item[key].node.color = cc.Color.YELLOW;
                    }
                });

                this.content.addChild(node);
            }
        }
    }
}
