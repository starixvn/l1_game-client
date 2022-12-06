import { i18n } from "../../../../../ClientModules";

const { ccclass, property } = cc._decorator;
@ccclass
export default class WinThreeCardsTicketDetailResultGroupItem extends cc.Component {
    @property(cc.Label)
    spin: cc.Label = null;
    

    height: number = null;

    updateContent(symbolSpriteFrame: cc.SpriteFrame, index: number, bigSmallValue: number) {       
        this.height = this.node.height;

        if (index === 0) {
            this.updateFirstRowContent(bigSmallValue);
        } else {
            this.node.getChildByName("bigSmall").active = false;
            this.spin.string = i18n.t("fruitSlot.extraSpin");
        }
    }

    private updateFirstRowContent(bigSmallValue: number) {
        this.spin.string = i18n.t("fruitSlot.spinResult");      
        this.node.getChildByName("topBorder").active = false;
    }
}
