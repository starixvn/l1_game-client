const { ccclass, property } = cc._decorator;

import GameHistoryBase from "../../_base/GameHistoryBase";
import DropDownOption from "../../../common/drop-down-list/view-models/DropDownOption";
import DropDownList from "../../../common/drop-down-list/view-models/DropDownList";
import MiniKenoHistoryItem from "./MiniKenoHistoryItem";
import { numberWithCommas, getStringDateByTime } from '../../../common/helpers/Helper';
import MiniKenoHistoryDetail from "./MiniKenoHistoryDetail";

@ccclass
export default class MiniKenoHistory extends GameHistoryBase {

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Prefab)
    dropDownList: cc.Prefab = null;

    @property(cc.Prefab)
    prefabRoundResult: cc.Prefab = null;

    @property(cc.Node)
    gameDropDownContainer: cc.Node = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    private historyDetail: MiniKenoHistoryDetail = null;
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

    private betChoices = ["even", "odd", "big", "small", "gold", "wood", "water", "fire", "earth"];

    isKenoProViet = () => this.gameName == "kenoProViet";

    updateRoundLabel() {
        this.roundLabel.string = this.isKenoProViet ? "Kỳ Vé" : "Phiên";
    }

    onLoad() {
        super.onLoad();

        this.initDropDown();
        this.init(this.kenoGameDropDownList.selectedItem.value);
        this.updateRoundLabel();
    }

    initDropDown() {
        const dropdownNode = cc.instantiate(this.dropDownList);
        this.kenoGameDropDownList = dropdownNode.getComponent("DropDownList");
        this.kenoGameDropDownList.init(this.options, this.onGameChanged.bind(this));
        this.gameDropDownContainer.addChild(dropdownNode);
    }

    onGameChanged() {
        this.removeDataObserver(this.gameName)
        this.gameName = this.kenoGameDropDownList.selectedItem.value;
        this.addDataObserver(this.gameName);
        this.updateRoundLabel();
        this.getData();
    }

    onData(data) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.destroyAllChildren();

        if (data.betLogs && data.betLogs.length) {
            for (let index = 0; index < data.betLogs.length; index++) {
                const betLog = data.betLogs[index];
                const { result, settlementResult } = betLog;
                const node = cc.instantiate(this.prefabItem);
                let item: MiniKenoHistoryItem = node.getComponent("MiniKenoHistoryItem");
                item.init(this);
                item.node.active = true;
                item.result = result;
                item.settlementResult = settlementResult;
                item.betLogDetails = betLog.betLogDetails;
                item.time.string = getStringDateByTime(betLog.time);
                item.roundId.string = betLog.phien;

                this.betChoices.forEach(choice => {
                    item[choice].string = numberWithCommas(betLog[choice]);
                });

                if (result && result.length && settlementResult) {
                    let total = 0;
                    for (let i = 0; i < result.length; i++) {
                        total += result[i];
                    }
                    item.total.string = total.toString();
                    Object.keys(settlementResult).forEach(key => {

                        if (settlementResult[key]) {
                            item[key].node.color = cc.Color.YELLOW;
                        }
                    });
                    item.win.string = numberWithCommas(betLog.betwin);
                    item.win.node.color = betLog.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                } else {
                    item.total.string = "..."
                    item.total.node.getComponent(cc.Button).clickEvents = [];
                    item.win.string = "Đang chờ";
                }

                this.content.addChild(node);
            }
        }
    }

    showHistoryDetail(round, result, settlementResult, betLogDetails) {
        let dialog = cc.instantiate(this.prefabRoundResult);
        this.historyDetail = dialog.getComponent("MiniKenoHistoryDetail");
        this.historyDetail.round.string = round;
        this.node.addChild(dialog);
        this.historyDetail.setData(result, settlementResult, betLogDetails);
        this.historyDetail.show();
    }

    public hideRoundResult() {
        this.historyDetail = null;
    }
}
