import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import SedieHistoryBase from '../../_base/view-models/SedieHistoryBase';
import GameUtils from './../../../common/GameUtils';
import SpecialSeDieHistoryItem from './SpecialSeDieHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialSeDieHistory extends SedieHistoryBase {
    public handleBetHistory = (roundId) => {};

    bindItemRowData(betLog, index) {
        const itemNode = this.bindCommonData(betLog, index);
        const item = itemNode.getComponent(SpecialSeDieHistoryItem);
        const { phien, choice, amount, refund, win } = betLog;

        item.option.string = GameUtils.getBetChoiceString(choice);
        item.option.node.color = win ? cc.Color.YELLOW : cc.Color.WHITE;

        item.bet.string = numberWithCommas(amount);
        item.refund.string = numberWithCommas(refund);
        item.roundId = phien;

        item.win.node.color = win ? cc.Color.YELLOW : cc.Color.WHITE;

        item.handleRoundIdClick = (roundId) => {
            this.openBetHistory(roundId);
        };

        this.content.addChild(itemNode);
    }

    openBetHistory(roundId: number) {
        this.handleBetHistory(roundId);
    }
}
