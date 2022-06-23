import { BlockchainBaccaratCardListModel } from "./../../event-models/BlockchainBaccaratCardListModel";
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

    @property(cc.Node)
    infoTag: cc.Node = null;

    private cardListModel: BlockchainBaccaratCardListModel = null;
    public index: number;

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

    setInfoTag() {
        this.infoTag.active = false;
    }

    resetIndexNumber() {
        this.indexNumber.string = "";
    }

    openCardVerification() {
        this.cardListModel?.openCardVerification(this.index);
    }

    closeCardVerification() {
        this.setShadow();
        this.setHighlight();
    }

    getIndexNumber() {
        return this.indexNumber.toString();
    }

    setIndexNumber(number: number) {
        this.index = number;
        this.indexNumber.string = (number + 1).toString().padStart(3, "0");
    }

    setStatusInfoTag(status: boolean) {
        this.infoTag.active = status;
    }

    setStatusIndexNumber(status: boolean) {
        this.indexNumber.node.active = status;
        this.indexNumber.node?.parent && (this.indexNumber.node.parent.active = status);
    }

    setCardListModel(model: BlockchainBaccaratCardListModel) {
        this.cardListModel = model;
    }
}
