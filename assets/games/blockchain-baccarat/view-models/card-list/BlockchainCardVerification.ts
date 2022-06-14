import { formatPrivateKey } from "../../../_casino/MD5Format";
import { CardChain, CardModel } from "../../BlockchainBaccaratType";
import BlockchainCard from "./BlockchainCard";
import BlockchainCardList from "./BlockchainCardList";
import * as i18n from "i18n/runtime-scripts/LanguageData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardVerification extends cc.Component {
    @property({ type: cc.Prefab })
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    serialNode: cc.Node = null;

    @property(cc.Node)
    privateKeyNode: cc.Node = null;

    @property(cc.Node)
    verifyNode: cc.Node = null;

    @property(cc.Node)
    verifiedSerialNode: cc.Node = null;

    @property(cc.Node)
    cardFirst: cc.Node = null;

    @property(cc.Node)
    cardSecond: cc.Node = null;

    @property(cc.Label)
    indexNumber: cc.Label = null;

    @property(cc.Label)
    indexNumber2: cc.Label = null;

    private hashValue: cc.Label = null;
    private rawValue: cc.RichText = null;
    private verifiedValue: cc.Label = null;

    private verifiedSerialCopyButton: cc.Button = null;
    private privateKeyCopyButton: cc.Button = null;
    private verifyButton: cc.Button = null;
    private root: BlockchainCardList = null;
    private disableButton = "btn-disable";
    private activeButton = "btn-active";

    private privateKey = "************************************************************************************************************";

    renderData(card: CardChain, index: number) {
        this.hashValue.string = card.hashValue;
        this.rawValue.string = card?.rawValue ? this.setPrivateKey(card.rawValue, card.card) : `${this.privateKey}${card.revealedRawValue}`;
        this.indexNumber.string = this.indexNumber2.string = this.root.convertIndexNumber(index + 1);
        this.verifiedValue.string = i18n.t("blockchainBaccarat.verifiedValue");
        if (!card.rawValue) {
            this.privateKeyCopyButton.node.getChildByName(this.disableButton).active = true;
            this.verifyButton.node.getChildByName(this.disableButton).active = true;
            this.verifiedSerialCopyButton.node.getChildByName(this.disableButton).active = true;
        } else {
            this.privateKeyCopyButton.node.getChildByName(this.activeButton).active = true;
            this.verifyButton.node.getChildByName(this.activeButton).active = true;
            this.verifiedSerialCopyButton.node.getChildByName(this.activeButton).active = true;
        }
        this.cardFirst.addChild(this.createCard(card.card));
        this.cardSecond.addChild(this.createCard(card.card));
    }

    init(root: BlockchainCardList) {
        this.root = root;
        this.hashValue = this.serialNode.getChildByName("value").getComponent(cc.Label);
        this.rawValue = this.privateKeyNode.getChildByName("value").getComponent(cc.RichText);
        this.verifiedValue = this.verifiedSerialNode.getChildByName("value").getComponent(cc.Label);
        this.privateKeyCopyButton = this.privateKeyNode.getChildByName("copy-button").getComponent(cc.Button);
        this.verifiedSerialCopyButton = this.verifiedSerialNode.getChildByName("copy-button").getComponent(cc.Button);
        this.verifyButton = this.verifyNode.getComponent(cc.Button);
    }

    private setPrivateKey(rawValue: string, card: CardModel) {
        const suffix = rawValue.split("_");
        const suffixFormatting = `${suffix[1]}_${suffix[2]}`;
        return formatPrivateKey(card, suffixFormatting, true);
    }
    public createCard(card: CardModel, isFaceUp = true): cc.Node {
        const node = cc.instantiate(this.cardPrefab);
        const cardComponent = node.getComponent(BlockchainCard);
        cardComponent.setCardOldStyle({
            rank: card?.rank,
            suit: card?.suit
        });

        !!card ? cardComponent.setFaceUp(isFaceUp) : cardComponent.setFaceUp(!isFaceUp);

        cardComponent.setInfoTag();
        cardComponent.setShadow();
        cardComponent.setIndexNumber();
        return node;
    }
}
