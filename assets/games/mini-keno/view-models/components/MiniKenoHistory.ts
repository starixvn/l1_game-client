import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../../../Application";
import DropDownList from "../../../../common/drop-down-list/view-models/DropDownList";
import DropDownOption from "../../../../common/drop-down-list/view-models/DropDownOption";
import GameUtils from "../../../../common/GameUtils";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import { GameIds, GameInfos } from "../../../../configs/SabaConfigs";
import SocketIOController from "../../../../SocketIOController";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import MiniKenoHistoryDetail from "./MiniKenoHistoryDetail";
import MiniKenoHistoryItem from "./MiniKenoHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistory extends SocketIOGameHistoryBase {
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

    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    private historyDetail: MiniKenoHistoryDetail = null;
    public kenoGameDropDownList: DropDownList;
    private readonly kenoProVietGameName = "kenoProViet";

    private readonly options: DropDownOption[] = [
        new DropDownOption(GameIds.KenoMax, "kenoMax", "Keno Max"),
        new DropDownOption(GameIds.KenoMax2, "kenoMax2", "Keno Max 2"),
        new DropDownOption(GameIds.KenoMini, "kenoMini", "Keno Mini"),
        new DropDownOption(GameIds.KenoMini2, "kenoMini2", "Keno Mini 2"),
        new DropDownOption(GameIds.KenoEast, "kenoEast", GameUtils.getGameNameString(GameIds.KenoEast)),
        new DropDownOption(GameIds.KenoWest, "kenoWest", GameUtils.getGameNameString(GameIds.KenoWest)),
        new DropDownOption(GameIds.KenoSouth, "kenoSouth", GameUtils.getGameNameString(GameIds.KenoSouth)),
        new DropDownOption(GameIds.KenoNorth, "kenoNorth", GameUtils.getGameNameString(GameIds.KenoNorth))
    ];

    private readonly betChoices = ["even", "odd", "big", "small", "gold", "wood", "water", "fire", "earth"];

    onLoad() {
        super.onLoad();
        this.initDropDown();
        this.updateSocketChanged();
    }

    initDropDown() {
        const dropdownNode = cc.instantiate(this.dropDownList);
        this.kenoGameDropDownList = dropdownNode.getComponent("DropDownList");
        this.kenoGameDropDownList.init(this.options, this.onGameChanged.bind(this));
        this.gameDropDownContainer.addChild(dropdownNode);
    }

    updateSocketChanged() {
        const id = this.kenoGameDropDownList.selectedItem.gameId;
        const gameName = GameInfos[id].key;
        this.socket = this.socketIOController.gameSockets[id];

        this.socket.off(gameName).on(gameName, this.receivedData.bind(this));
    }

    onGameChanged() {
        this.updateSocketChanged();
        this.pagination.resetPageCurrent();
        this.get_data();
    }

    receivedData(data) {
        if (data.history) {
            this.onData(data.history);
        }
    }

    bindItemRowData(betLog, index) {
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
