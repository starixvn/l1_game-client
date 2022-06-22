import { formatPrivateKey } from "../../../_casino/MD5Format";
import { Chain, CardModel } from "../../BlockchainBaccaratType";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import BlockchainCardVerificationItem from "./BlockchainCardVerificationItem";
import BlockchainVerify from "./BlockchainCardVerify";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import BlockchainCardList from "./BlockchainCardList";
import MiniPanel from "../../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardVerification extends cc.Component {
    @property(BlockchainCardVerificationItem)
    serialNumber: BlockchainCardVerificationItem = null;

    @property(BlockchainCardVerificationItem)
    privateKey: BlockchainCardVerificationItem = null;

    @property(BlockchainVerify)
    verifyCard: BlockchainVerify = null;

    @property(BlockchainCardVerificationItem)
    verifiedSerial: BlockchainCardVerificationItem = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    public cardList: BlockchainCardList = null;
    public currentMiniPanel: MiniPanel;
    private serialCardChain: Chain;
    private privateCardChain: Chain;
    isClickSerialChangeCard = false;
    isClickPrivateChangeCard = false;

    private encrypKey = "************************************************************************************************************";

    initMiniPanel(miniPanel: MiniPanel) {
        this.currentMiniPanel = miniPanel;
    }

    renderDataCardVerification(cardChain: Chain, index: number) {
        const verifiedValue = this.verifyCard.isSuccessfull ? cardChain.hashValue : i18n.t("blockchainBaccarat.verifiedValue");
        this.verifiedSerial.enableCopyButton(this.verifyCard.isSuccessfull);
        this.verifiedSerial.setHashValue(verifiedValue);
        this.renderSerialNumber(cardChain, index);
        this.renderPivateKey(cardChain, index);
        if (!cardChain.rawValue) {
            this.verifyCard.enableVerifyButton(false);
            this.privateKey.enableCopyButton(false);
        } else {
            this.privateKey.enableCopyButton(true);
            this.verifyCard.enableVerifyButton(true);
            this.privateKey.setTextCopy(cardChain.rawValue);
        }
    }

    renderSerialNumber(cardChain: Chain, index: number) {
        this.serialNumber.setHashValue(cardChain?.hashValue);
        this.serialNumber.renderCard(cardChain.card, index);
        this.serialCardChain = cardChain;
    }

    renderPivateKey(cardChain: Chain, index: number) {
        const rawValue = cardChain?.rawValue
            ? this.setPrivateKey(cardChain.rawValue, cardChain.card)
            : `${this.encrypKey}${cardChain.revealedRawValue}`;
        this.privateKey.setRawValue(rawValue);
        this.privateKey.renderCard(cardChain.card, index);
        this.privateCardChain = cardChain;
    }
    private setPrivateKey(rawValue: string, card: CardModel) {
        const suffix = rawValue.split("_");
        const suffixFormatting = `${suffix[1]}_${suffix[2]}`;
        return formatPrivateKey(card, suffixFormatting, true);
    }

    onClickVerifyButton() {
        const isRawValue = this.serialCardChain.rawValue.localeCompare(this.privateCardChain.rawValue);
        const isHashValue = this.serialCardChain.hashValue.localeCompare(this.privateCardChain.hashValue);
        this.verifiedSerial.setHashValue(this.serialCardChain.hashValue);
        if (isRawValue === 0 && isHashValue === 0) {
            this.verifyCard.setText(this.serialCardChain.hashValue);
            this.verifyCard.setVerifySuccess(true);
            this.serialNumber.setHighLightSuccess();
            this.verifiedSerial.setHighLightSuccess();
            this.verifiedSerial.enableCopyButton(true);
        } else {
            this.verifyCard.setVerifySuccess(false);
            this.serialNumber.setHighLightFailed();
            this.verifiedSerial.setHighLightFailed();
        }
    }

    onClickChangeCard() {
        const commonDialog = this.getComponent(CommonDialog);
        if (commonDialog) {
            commonDialog.closeDialog();
        }
    }

    public initCardList() {
        const cardListPrefab = this.node.getChildByName(this.cardListPrefab.name);
        if (cardListPrefab) {
            cardListPrefab.removeFromParent(true);
            cardListPrefab.destroy();
        }
        const dialog = cc.instantiate(this.cardListPrefab);
        this.cardList = dialog.getComponent(BlockchainCardList);
        this.cardList.setData();
        this.cardList.highLightCurrentCardSelected(parseInt(this.privateKey.numberKey.string) - 1);
        this.currentMiniPanel.addDialog(dialog);
    }
}
