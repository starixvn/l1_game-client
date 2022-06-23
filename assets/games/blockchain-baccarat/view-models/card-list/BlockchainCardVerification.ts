import { formatPrivateKey } from "../../../_casino/MD5Format";
import { Chain, CardModel } from "../../BlockchainBaccaratType";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import BlockchainCardVerificationItem from "./BlockchainCardVerificationItem";
import BlockchainVerify from "./BlockchainCardVerify";
import CommonDialog from "../../../../common/_base/view-models/CommonDialog";

const { ccclass, property } = cc._decorator;

export enum CardVerificationState {
    blank_new = 0,
    serial_change,
    private_change
}

export enum CardEvents {
    CHANGE_CARD = "change_card"
}

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

    private serialCardChain: Chain;
    private privateCardChain: Chain;
    isClickSerialChangeCard = false;
    isClickPrivateChangeCard = false;
    cardVerificationDialog: CommonDialog;
    public state = CardVerificationState.blank_new;

    private encrypKey = "************************************************************************************************************";

    showDialog() {
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.showDialog();
        }
    }

    renderDataCardVerification(cardChain: Chain, index: number) {
        console.log("state", this.state);
        const verifiedValue = i18n.t("blockchainBaccarat.verifiedValue");
        this.verifiedSerial.enableCopyButton(false);
        this.verifiedSerial.setHashValue(verifiedValue);
        this.verifiedSerial.resetHighLight();
        if (this.state === CardVerificationState.serial_change) {
            this.renderSerialNumber(cardChain, index);
        } else if (this.state === CardVerificationState.private_change) {
            this.renderPivateKey(cardChain, index);
        } else {
            this.renderSerialNumber(cardChain, index);
            this.renderPivateKey(cardChain, index);
        }

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
        this.serialNumber.resetHighLight();
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
        this.verifiedSerial.enableCopyButton(true);
        if (isRawValue === 0 && isHashValue === 0) {
            this.verifyCard.setVerifySuccess(true);
            this.serialNumber.setHighLightSuccess();
            this.verifiedSerial.setHighLightSuccess();
        } else {
            this.verifyCard.setVerifySuccess(false);
            this.serialNumber.setHighLightFailed();
            this.verifiedSerial.setHighLightFailed();
        }
    }

    onClickChangeCard(event, customEventData) {
        const values = {
            serial: CardVerificationState.serial_change,
            private: CardVerificationState.private_change
        };
        this.state = values[customEventData];
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.closeDialog();
        }
        //this.node.emit(CardEvents.CHANGE_CARD);
    }

    onClose() {
        this.state = CardVerificationState.blank_new;
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.closeDialog();
        }
    }
}
