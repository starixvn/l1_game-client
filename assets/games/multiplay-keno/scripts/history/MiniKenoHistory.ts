import * as i18n from "i18n/runtime-scripts/LanguageData";

import GameUtils from "../../../../common/GameUtils";
import DropdownListMultiplayGameHistory from "../../../multiplay/scripts/DropdownListMultiplayGameHistory";
import { MegaKeno1Id, MegaKeno2Id, MegaKeno3Id, MegaKeno4Id, MegaKeno5Id, MegaKeno6Id, MegaKeno7Id, MegaKeno8Id } from "../MegaKenoConfig";
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
        new NewDropDownOption(DropdownListMultiplayGameHistory.AllGameHistory, i18n.t("ui.all")),
        new NewDropDownOption(MegaKeno1Id, GameUtils.getGameNameString(MegaKeno1Id)),
        new NewDropDownOption(MegaKeno2Id, GameUtils.getGameNameString(MegaKeno2Id)),
        new NewDropDownOption(MegaKeno3Id, GameUtils.getGameNameString(MegaKeno3Id)),
        new NewDropDownOption(MegaKeno4Id, GameUtils.getGameNameString(MegaKeno4Id)),
        new NewDropDownOption(MegaKeno5Id, GameUtils.getGameNameString(MegaKeno5Id)),
        new NewDropDownOption(MegaKeno6Id, GameUtils.getGameNameString(MegaKeno6Id)),
        new NewDropDownOption(MegaKeno7Id, GameUtils.getGameNameString(MegaKeno7Id)),
        new NewDropDownOption(MegaKeno8Id, GameUtils.getGameNameString(MegaKeno8Id))
    ];

    bindItemRowData(betLog, index) {
        super.bindItemRowData(betLog, index);
        const node = cc.instantiate(this.itemPrefab);
        const item = node.getComponent(MiniKenoHistoryItem);
        item.init(this);
        item.setData(betLog, index);
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
