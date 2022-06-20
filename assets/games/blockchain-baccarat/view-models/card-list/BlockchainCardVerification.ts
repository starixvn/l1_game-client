import { formatPrivateKey } from "../../../_casino/MD5Format";
import { CardChain, CardModel } from "../../BlockchainBaccaratType";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import BlockchainCardVerificationItem from "./BlockchainCardVerificationItem";
import BlockchainVerify from "./BlockchainVerify";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import BlockchainCardList from "./BlockchainCardList";
import { Blockchain } from "../../event-models/BlockchainBaccaratCardListModel";
import MiniPanel from "../../../../mini-games-panel/view-models/MiniPanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainCardVerification extends cc.Component {
    @property(BlockchainCardVerificationItem)
    serialNumber: BlockchainCardVerificationItem = null;

    @property(BlockchainCardVerificationItem)
    privateKey: BlockchainCardVerificationItem = null;

    @property(BlockchainVerify)
    verify: BlockchainVerify = null;

    @property(BlockchainCardVerificationItem)
    verifiedSerial: BlockchainCardVerificationItem = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    private cardChain: CardChain[];
    private blockchain: Blockchain;
    public cardList: BlockchainCardList = null;
    public currentMiniPanel: MiniPanel;

    private encrypKey = "************************************************************************************************************";

    initMiniPanel(miniPanel: MiniPanel) {
        this.currentMiniPanel = miniPanel;
    }

    renderDataCradVerification(blockchain, index: number) {
        this.blockchain = blockchain;
        const { chain } = blockchain;
        this.cardChain = chain;
        const card = chain[index];
        const rawValue = card?.rawValue ? this.setPrivateKey(card.rawValue, card.card) : `${this.encrypKey}${card.revealedRawValue}`;
        const verifiedValue = this.verify.isSuccessfull ? card.hashValue : i18n.t("blockchainBaccarat.verifiedValue");
        this.serialNumber.setHashValue(card?.hashValue);
        this.privateKey.setRawValue(rawValue);
        this.verifiedSerial.enableCopyButton(this.verify.isSuccessfull);
        this.verifiedSerial.setHashValue(verifiedValue);

        if (!card.rawValue) {
            this.verify.enableVerifyButton(false);
            this.privateKey.enableCopyButton(false);
        } else {
            this.privateKey.enableCopyButton(true);
            this.verify.enableVerifyButton(true);
            this.privateKey.setTextCopy(card.rawValue);
        }
        this.serialNumber.renderCard(card.card, index);
        this.privateKey.renderCard(card.card, index);
    }

    private setPrivateKey(rawValue: string, card: CardModel) {
        const suffix = rawValue.split("_");
        const suffixFormatting = `${suffix[1]}_${suffix[2]}`;
        return formatPrivateKey(card, suffixFormatting, true);
    }

    onClickVerifyButton() {
        const serialCard = this.cardChain[parseInt(this.serialNumber.numberKey.string) - 1];
        const privateCard = this.cardChain[parseInt(this.privateKey.numberKey.string) - 1];
        const isRawValue = serialCard.rawValue.localeCompare(privateCard.rawValue);
        const isHashValue = serialCard.hashValue.localeCompare(privateCard.hashValue);
        this.verifiedSerial.setHashValue(serialCard.hashValue);
        if (isRawValue === 0 && isHashValue === 0) {
            this.verify.setText(serialCard.hashValue);
            this.verify.setVerifySuccess(true);
            this.serialNumber.setHighLightSuccess();
            this.verifiedSerial.setHighLightSuccess();
            this.verifiedSerial.enableCopyButton(true);
        } else {
            this.verify.setVerifySuccess(false);
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
        this.cardList.setData(this.blockchain);
        this.cardList.highLightCurrentCardSelected(parseInt(this.privateKey.numberKey.string) - 1);
        this.currentMiniPanel.addDialog(dialog);
        this.cardList.showDialog();
    }
}
