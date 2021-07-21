import * as i18n from "i18n/runtime-scripts/LanguageData";

import DropDownList from "../../../../common/drop-down-list/view-models/DropDownList";
import DropDownOption from "../../../../common/drop-down-list/view-models/DropDownOption";
import GameUtils from "../../../../common/GameUtils";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import { GameIds } from "../../../../configs/SabaConfigs";
import GameHistoryBase from "../../../_base/view-models/GameHistoryBase";
import MiniKenoHistoryDetail from "./MiniKenoHistoryDetail";
import MiniKenoHistoryItem from "./MiniKenoHistoryItem";

const { ccclass, property } = cc._decorator;

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
    public kenoGameDropDownList: DropDownList;
    private readonly kenoProVietGameName = "kenoProViet";

    private readonly options: DropDownOption[] = [
        new DropDownOption("kenoMax", "Keno Max"),
        new DropDownOption("kenoMax2", "Keno Max 2"),
        new DropDownOption("kenoMini", "Keno Mini"),
        new DropDownOption("kenoMini2", "Keno Mini 2"),
        new DropDownOption("kenoEast", GameUtils.getGameNameString(GameIds.KenoEast)),
        new DropDownOption("kenoWest", GameUtils.getGameNameString(GameIds.KenoWest)),
        new DropDownOption("kenoSouth", GameUtils.getGameNameString(GameIds.KenoSouth)),
        new DropDownOption("kenoNorth", GameUtils.getGameNameString(GameIds.KenoNorth))
    ];

    private readonly betChoices = ["even", "odd", "big", "small", "gold", "wood", "water", "fire", "earth"];

    onLoad() {
        super.onLoad();

        this.initDropDown();
        this.init(this.kenoGameDropDownList.selectedItem.value);
    }

    initDropDown() {
        const dropdownNode = cc.instantiate(this.dropDownList);
        this.kenoGameDropDownList = dropdownNode.getComponent("DropDownList");
        this.kenoGameDropDownList.init(this.options, this.onGameChanged.bind(this));
        this.gameDropDownContainer.addChild(dropdownNode);
    }

    onGameChanged() {
        this.gameName = this.kenoGameDropDownList.selectedItem.value;
        this.pages.resetPageCurrent();
        this.get_data();
    }

    onData(data) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.destroyAllChildren();

        if (!data.betLogs || !data.betLogs.length) {
            return;
        }

        data.betLogs.forEach((betLog) => {
            const { phien, betLogDetails, betwin, result, settlementResult } = betLog;
            const node = cc.instantiate(this.prefabItem);
            const item: MiniKenoHistoryItem = node.getComponent("MiniKenoHistoryItem");
            item.init(this);
            item.node.active = true;
            item.result = result;
            item.settlementResult = settlementResult;
            item.betLogDetails = betLogDetails;
            item.time.string = getStringDateByTime(betLog.time);
            item.roundId.string = phien;

            this.betChoices.forEach((choice) => {
                item[choice].string = numberWithCommas(betLog[choice]);
            });

            const total = result.reduce((total: number, number: number) => total + number, 0);
            item.total.string = total;

            Object.keys(settlementResult).forEach((key) => {
                if (settlementResult[key]) {
                    item[key].node.color = cc.Color.YELLOW;
                }
            });
            item.win.string = numberWithCommas(betwin);
            item.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            this.content.addChild(node);
        });
    }

    showHistoryDetail(round, result, settlementResult, betLogDetails) {
        const dialog = cc.instantiate(this.prefabRoundResult);
        this.historyDetail = dialog.getComponent(MiniKenoHistoryDetail);
        this.historyDetail.roundId.string = round;
        this.historyDetail.roundLabel.string = i18n.t("ui.round");
        this.node.addChild(dialog);
        this.historyDetail.setData(result, settlementResult, betLogDetails);
        this.historyDetail.show();
    }

    public hideRoundResult() {
        this.historyDetail = null;
    }

    closeDropDown() {
        this.kenoGameDropDownList && this.kenoGameDropDownList.closeDropDown();
    }
}
