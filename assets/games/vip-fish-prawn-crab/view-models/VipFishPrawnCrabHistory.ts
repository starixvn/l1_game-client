import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import { getStringDateByTime } from "./../../../common/helpers/DateTimeHelper";
import VipFishPrawnCrabHistoryItem from "./VipFishPrawnCrabHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabHistory extends SocketIOGameHistoryBase {
    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(VipFishPrawnCrabHistoryItem);
        item.node.active = true;
        item.background.active = index % 2 > 0;

        const { time, phien, result, settlementResult, betwin } = betLog;

        item.time.string = getStringDateByTime(time);
        item.round.string = phien;

        let number = 0;
        Object.keys(result).forEach((key) => {
            if (result[key]) {
                number++;
            }
        });

        item.dices[0].spriteFrame = this.animalSprites[result.dice1];
        item.dices[1].spriteFrame = this.animalSprites[result.dice2];
        item.dices[2].spriteFrame = this.animalSprites[result.dice3];

        Object.keys(settlementResult).forEach((choice) => {
            item[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                item[choice].node.color = cc.Color.YELLOW;
            } else {
                item[choice].node.color = cc.Color.WHITE;
            }
        });

        item.win.string = numberWithCommas(betwin);

        this.content.addChild(itemNode);
    }
}
