import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import BauCuaHistoryItems from "./BauCuaHistoryItems";

const { ccclass, property } = cc._decorator;
@ccclass
export default class BauCuaHistory extends SocketIOGameHistoryBase {
    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(BauCuaHistoryItems);
        item.node.active = true;
        const { time, phien, result, betwin, stag, crab, fish, gourd, prawn, rooster } = betLog;
        item.time.string = getStringDateByTime(time);
        item.round.string = phien;

        item.dices[0].spriteFrame = this.animalSprites[result.dice1];
        item.dices[1].spriteFrame = this.animalSprites[result.dice2];
        item.dices[2].spriteFrame = this.animalSprites[result.dice3];

        item.betList.forEach((node) => {
            switch (node.name) {
                case "stag":
                    this.handleUINodeBet(node, stag);
                    break;
                case "crab":
                    this.handleUINodeBet(node, crab);
                    break;
                case "fish":
                    this.handleUINodeBet(node, fish);
                    break;
                case "gourd":
                    this.handleUINodeBet(node, gourd);
                    break;
                case "prawn":
                    this.handleUINodeBet(node, prawn);
                    break;
                case "rooster":
                    this.handleUINodeBet(node, rooster);
                    break;
            }
        });

        item.win.string = numberWithCommas(betwin);
        item.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        this.content.addChild(itemNode);
    }

    handleUINodeBet(node: cc.Node, value: number) {
        if (value > 0) {
            node.active = true;
            node.getComponentInChildren(cc.Label).string = value.toString();
            node.getChildByName("value").color = cc.Color.YELLOW;
        }
    }
}
