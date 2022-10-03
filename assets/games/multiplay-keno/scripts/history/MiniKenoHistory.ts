import * as i18n from "i18n/runtime-scripts/LanguageData";

import GameUtils from "../../../../common/GameUtils";
import {
    KenoEastId,
    KenoMini2Id,
    KenoMiniId,
    KenoNorthId,
    KenoSouthId,
    KenoWestId,
    MegaKenoId
} from "../../../mini-keno/view-models/KenoUtils";
import DropdownListMultiplayGameHistory from "../../../multiplay/scripts/DropdownListMultiplayGameHistory";
import { MegaKeno2Id } from "../MegaKenoConfig";
import MiniKenoHistoryDetail from "./MiniKenoHistoryDetail";
import MiniKenoHistoryItem from "./MiniKenoHistoryItem";
import NewDropDownOption from "../../../../common/new-drop-down-list/view-models/NewDropDownOption";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoHistory extends DropdownListMultiplayGameHistory {
    @property(cc.Prefab)
    detailPrefab: cc.Prefab = null;

    private historyDetail: MiniKenoHistoryDetail = null;

    protected readonly options: NewDropDownOption[] = [
        new NewDropDownOption(DropdownListMultiplayGameHistory.AllGameHistory, i18n.t("ui.all_games")),
        new NewDropDownOption(MegaKenoId, "Mega Keno"),
        new NewDropDownOption(MegaKeno2Id, "Mega Keno 2"),
        new NewDropDownOption(KenoMiniId, "Keno Mini"),
        new NewDropDownOption(KenoMini2Id, "Keno Mini 2"),
        new NewDropDownOption(KenoEastId, GameUtils.getGameNameString(KenoEastId)),
        new NewDropDownOption(KenoWestId, GameUtils.getGameNameString(KenoWestId)),
        new NewDropDownOption(KenoSouthId, GameUtils.getGameNameString(KenoSouthId)),
        new NewDropDownOption(KenoNorthId, GameUtils.getGameNameString(KenoNorthId))
    ];

    bindItemRowData(betLog, index) {
        const node = cc.instantiate(this.itemPrefab);
        const item = node.getComponent(MiniKenoHistoryItem);
        item.init(this);
        item.setData(betLog);
        this.content.addChild(node);
    }

    showHistoryDetail(round, result, settlementResult, betLogDetails) {
        const dialog = cc.instantiate(this.detailPrefab);
        this.historyDetail = dialog.getComponent(MiniKenoHistoryDetail);
        this.historyDetail.roundId.string = round;
        this.historyDetail.roundLabel.string = i18n.t("ui.round");
        this.node.addChild(dialog);
        this.historyDetail.setData(result, settlementResult, betLogDetails);
        this.historyDetail.show();
    }
}
