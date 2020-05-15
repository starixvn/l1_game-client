import BaseDataHandler from "./BaseDataHandler";
import DataHandler from "../../../../_base/handlers/DataHandler";
import ChanLeMain from "../ChanLeMain";
import { numberWithCommas } from '../../../../../common/helpers/Helper';

export default class BetStatusDataHandler extends BaseDataHandler implements DataHandler {
    constructor(main: ChanLeMain) {
        super(main)
    }

    handle(data: any): boolean {
        if (!data.status) {
            return false;
        }

        var self = this;

        setTimeout(() => {
            if (!self.main.isNan) {
                self.showUserWinLossAnimation(data.status);
            }
            self.main.root.sendData({ get_new: true });
        }, 2e3);

        return true;
    }

    private showUserWinLossAnimation(data) {
        if (!this.main.notice) {
            return;
        }

        var resultNode = new cc.Node();
        resultNode.addComponent(cc.Label);
        var resultLabel = resultNode.getComponent(cc.Label);
        resultLabel.string = (data.win ? "+" : "-") + numberWithCommas(data.bet);
        resultLabel.font = data.win ? this.main.fontPlus : this.main.fontMinus;
        resultLabel.lineHeight = 130;
        resultLabel.fontSize = 25;
        resultLabel.node.position = cc.v2(data.select ? -245 : 245, -50);
        this.main.notice.addChild(resultLabel.node);
        resultLabel.node.runAction(
            cc.sequence(
                cc.moveTo(3, cc.v2(data.select ? -245 : 245, 130)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, resultLabel)
            )
        );
    }

}