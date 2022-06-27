import * as i18n from "i18n/runtime-scripts/LanguageData";
import CommonDialog from "../../../../../common/_base/view-models/CommonDialog";
import { formatPrivateKey } from "../../../../_casino/MD5Format";
import { CardModel, Chain } from "../../../BlockchainBaccaratType";
import BlockchainCardVerificationItem from "./BlockchainCardVerificationItem";
import BlockchainCardVerify from "./BlockchainCardVerify";
import cryptoJs = require("crypto");

const { ccclass, property } = cc._decorator;

export enum CardVerificationState {
    blank_new = 0,
    serial_change,
    private_change
}

export enum CardVerificationEvents {
    CHANGE_CARD = "change_card",
    OPEN_VERIFICATION = "openVerification",
    CLOSE_POPUP = "closePopup"
}

@ccclass
export default class BlockchainCardVerification extends cc.Component {
    @property(BlockchainCardVerificationItem)
    serialNumber: BlockchainCardVerificationItem = null;

    @property(BlockchainCardVerificationItem)
    privateKey: BlockchainCardVerificationItem = null;

    @property(BlockchainCardVerify)
    verifyCard: BlockchainCardVerify = null;

    @property(BlockchainCardVerificationItem)
    verifiedSerial: BlockchainCardVerificationItem = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    private serialCardChain: Chain;
    private privateCardChain: Chain;
    cardVerificationDialog: CommonDialog;
    public state = CardVerificationState.blank_new;
    public timeout: any;

    private readonly encrypKey =
        "************************************************************************************************************";

    showDialog() {
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.showDialog();
        }
    }

    renderDataCardVerification(chain: Chain, index: number) {
        console.log("state", this.state);
        const verifiedValue = i18n.t("blockchainBaccarat.verifiedValue");
        this.verifiedSerial.enableCopyButton(false);
        this.verifiedSerial.setHashValue(verifiedValue);
        this.verifiedSerial.resetHighLight();
        if (this.state === CardVerificationState.serial_change) {
            this.renderSerialNumber(chain, index);
        } else if (this.state === CardVerificationState.private_change) {
            this.renderPrivateKey(chain, index);
        } else {
            this.renderSerialNumber(chain, index);
            this.renderPrivateKey(chain, index);
        }
        this.renderButton();
    }

    renderButton() {
        if (!this.privateCardChain?.rawValue) {
            this.verifyCard.enableVerifyButton(false);
            this.privateKey.enableCopyButton(false);
        } else {
            this.privateKey.enableCopyButton(true);
            this.verifyCard.enableVerifyButton(true);
            this.privateKey.setTextCopy(this.privateCardChain?.rawValue);
        }
    }

    renderSerialNumber(cardChain: Chain, index: number) {
        this.serialNumber.setHashValue(cardChain?.hashValue);
        this.serialNumber.renderCard(cardChain.card, index);
        this.serialNumber.resetHighLight();
        this.serialCardChain = cardChain;
    }

    renderPrivateKey(cardChain: Chain, index: number) {
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
        const hashValue = this.createHashSHA256(this.privateCardChain.rawValue);
        const privateKeyIsMatch = this.serialCardChain.hashValue.localeCompare(hashValue);
        if (privateKeyIsMatch === 0) {
            this.verifyCard.setVerifySuccess(true);
            this.serialNumber.setHighLightSuccess();
            this.verifiedSerial.setHighLightSuccess();
        } else {
            this.verifyCard.setVerifySuccess(false);
            this.serialNumber.setHighLightFailed();
            this.verifiedSerial.setHighLightFailed();
        }
        this.verifiedSerial.setHashValue(this.serialCardChain.hashValue);
        this.verifiedSerial.enableCopyButton(true);
    }

    createHashSHA256(value: string) {
        return cryptoJs.createHash("sha256").update(value).digest("hex");
    }

    onClickChangeCard(event: any, customEventData: string) {
        this.closeDialog();
        const values = {
            serial: CardVerificationState.serial_change,
            private: CardVerificationState.private_change
        };

        const indexNumbers = {
            serial: this.serialNumber.getNumberKey(),
            private: this.privateKey.getNumberKey()
        };

        this.state = values[customEventData];
        const index = indexNumbers[customEventData];
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.node.emit(CardVerificationEvents.CHANGE_CARD, index - 1);
        }, 500);
    }

    onClose() {
        this.resetState();
        this.closeDialog();
        this.node.emit(CardVerificationEvents.CLOSE_POPUP);
    }

    closeDialog() {
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.closeDialog();
        }
    }

    resetState() {
        this.state = CardVerificationState.blank_new;
    }

    dispatchOpenEvent(index: number) {
        this.node.emit(CardVerificationEvents.OPEN_VERIFICATION, index);
    }
}
