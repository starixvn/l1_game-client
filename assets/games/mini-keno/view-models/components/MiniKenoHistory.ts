import * as i18n from "i18n/runtime-scripts/LanguageData";

import { lazyInject } from "../../../../Application";
import DropDownList from "../../../../common/drop-down-list/view-models/DropDownList";
import DropDownOption from "../../../../common/drop-down-list/view-models/DropDownOption";
import GameUtils from "../../../../common/GameUtils";
import { getGameConfiguration } from "../../../../configs/GameConfigurations";
import SocketIOController from "../../../../SocketIOController";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import { KenoEastId, KenoMini2Id, KenoMiniId, KenoNorthId, KenoSouthId, KenoWestId } from "../KenoUtils";
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

    private readonly options: DropDownOption[] = [
        new DropDownOption(GameIds.MegaKeno, "Mega Keno"),
        new DropDownOption(GameIds.MegaKeno2, "Mega Keno 2"),
        new DropDownOption(KenoMiniId, "Keno Mini"),
        new DropDownOption(KenoMini2Id, "Keno Mini 2"),
        new DropDownOption(KenoEastId, GameUtils.getGameNameString(KenoEastId)),
        new DropDownOption(KenoWestId, GameUtils.getGameNameString(KenoWestId)),
        new DropDownOption(KenoSouthId, GameUtils.getGameNameString(KenoSouthId)),
        new DropDownOption(KenoNorthId, GameUtils.getGameNameString(KenoNorthId))
    ];

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
        this.socket = this.socketIOController.getSocketGame(id);
    }

    onGameChanged() {
        this.updateSocketChanged();
        this.pagination.resetPageCurrent();
        this.get_data();
    }

    receivedData(dataHistory: any, gameName: string) {
        const id = this.kenoGameDropDownList.selectedItem.gameId;
        const gameConfiguration = getGameConfiguration(id);
        const currentGameName = gameConfiguration?.key;

        if (gameName === currentGameName) {
            this.onData(dataHistory);
        }
    }

    bindItemRowData(betLog, index) {
        const node = cc.instantiate(this.prefabItem);
        const item: MiniKenoHistoryItem = node.getComponent("MiniKenoHistoryItem");
        item.init(this);
        item.setData(betLog);
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
