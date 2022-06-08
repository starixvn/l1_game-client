import NewCard from "../../../../common/new-card/view-models/NewCard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCard extends NewCard {
    @property(cc.Node)
    highLight: cc.Node = null;

    @property(cc.Node)
    shadow: cc.Node = null;

    @property(cc.Node)
    keyCard: cc.Node = null;

    @property(cc.Label)
    indexNumber: cc.Label = null;

    setHighlight() {
        this.highLight.active = true;
    }

    resetHighlight() {
        this.highLight.active = false;
    }

    setKeyCard() {
        this.keyCard.active = true;
    }

    resetKeyCard() {
        this.keyCard.active = false;
    }

    setShadow() {
        this.shadow.active = false;
    }

    resetShadow() {
        this.shadow.active = true;
    }

    openCardVerification() {}

    closeCardVerification() {
        this.resetShadow();
        this.resetHighlight();
    }
}
