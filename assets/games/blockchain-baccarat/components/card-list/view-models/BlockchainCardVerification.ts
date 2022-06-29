import * as i18n from "i18n/runtime-scripts/LanguageData";
import CommonDialog from "../../../../../common/_base/view-models/CommonDialog";
import { formatPrivateKey } from "../../../../_casino/MD5Format";
import { CardModel, Chain } from "../../../BlockchainBaccaratType";
import BlockchainCardVerificationItem from "./BlockchainCardVerificationItem";
import BlockchainCardVerify from "./BlockchainCardVerify";
import cryptoJs = require("crypto");
import { BlockchainBaccaratEvents, emitEvent } from "../../../view-models/BlockchainBaccaratEvents";

const { ccclass, property } = cc._decorator;

export enum CardVerificationState {
    blankNew = 0,
    serialChange,
    privateChange
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
    public state = CardVerificationState.blankNew;
    public timeout: any;
    numberKey: number;
    numberKey2: number;

    private readonly encryptKey =
        "************************************************************************************************************";

    private readonly numberOfCharactersPerLine = 61;

    showDialog() {
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.showDialog();
        }
    }

    renderDataCardVerification(chain: Chain, index: number) {
        this.renderVerifiedSerialNumber();
        if (this.state === CardVerificationState.serialChange) {
            this.renderSerialNumber(chain, index);
        } else if (this.state === CardVerificationState.privateChange) {
            this.renderPrivateKey(chain, index);
        } else {
            this.renderSerialNumber(chain, index);
            this.renderPrivateKey(chain, index);
        }
        this.renderButton();
        this.onHideTooltips();
    }

    renderVerifiedSerialNumber() {
        const verifiedValue = i18n.t("blockchainBaccarat.verifiedValue");
        this.verifiedSerial.enableCopyButton(false);
        this.verifiedSerial.setHashValue(verifiedValue);
        this.verifiedSerial.resetHighLight();
    }

    autoRenderCardVerification(chain: Chain, index: number) {
        this.renderVerifiedSerialNumber();
        if (this.numberKey === index) {
            this.renderSerialNumber(chain, index);
        }
        if (this.numberKey2 === index) {
            this.renderPrivateKey(chain, index);
        }

        this.renderButton();
        this.onHideTooltips();
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
        this.serialNumber.renderCard(cardChain?.card, index);
        this.serialNumber.resetHighLight();
        this.serialCardChain = cardChain;
        this.numberKey = index;
    }

    renderPrivateKey(cardChain: Chain, index: number) {
        const rawValue = cardChain?.rawValue
            ? this.setPrivateKey(cardChain?.rawValue, cardChain?.card)
            : `${this.encryptKey}${cardChain.revealedRawValue}`;
        this.privateKey.setRawValue(rawValue);
        this.privateKey.renderCard(cardChain?.card, index);
        this.privateCardChain = cardChain;
        this.numberKey2 = index;
    }

    private setPrivateKey(rawValue: string, card: CardModel) {
        const values = rawValue.split("_");
        const suffixFormatting = `${values[1]}_${values[2]}_${values[3]}`;
        const cardValue = formatPrivateKey(card, true);
        const suffix =
            suffixFormatting.slice(0, this.numberOfCharactersPerLine) + " " + suffixFormatting.slice(this.numberOfCharactersPerLine);
        return `${cardValue}_${suffix}`;
    }

    onClickVerifyButton() {
        this.onHideTooltips();
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
            serial: CardVerificationState.serialChange,
            private: CardVerificationState.privateChange
        };

        const indexNumbers = {
            serial: this.numberKey,
            private: this.numberKey2
        };

        this.state = values[customEventData];
        const index = indexNumbers[customEventData];
        this.timeout && clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            emitEvent(BlockchainBaccaratEvents.CHANGE_CARD, { index: index });
        }, 500);
    }

    onClose() {
        this.resetState();
        this.closeDialog();
        emitEvent(BlockchainBaccaratEvents.RESET_CARD_SELECTED);
    }

    closeDialog() {
        this.cardVerificationDialog = this.getComponent(CommonDialog);
        if (this.cardVerificationDialog) {
            this.cardVerificationDialog.closeDialog();
        }
    }

    resetState() {
        this.state = CardVerificationState.blankNew;
    }

    onHideTooltips() {
        this.serialNumber.hideTooltip();
        this.privateKey.hideTooltip();
    }

    onClickSerialTooltip() {
        this.privateKey.hideTooltip();
        const tooltip = i18n.t("blockchainBaccarat.serialTooltip");
        this.serialNumber.showTooltip(tooltip);
    }

    onClickPrivateTooltip() {
        this.serialNumber.hideTooltip();
        const tooltip = i18n.t("blockchainBaccarat.privateTooltip");
        this.privateKey.showTooltip(tooltip);
    }

    onClickCopy(event, customEventData) {
        this.onHideTooltips();
        const nodes = {
            hashValue: this.serialNumber,
            rawValue: this.privateKey,
            verifiedValue: this.verifiedSerial
        };

        const copyNode = nodes[customEventData];
        copyNode.onCopy();
    }
}
