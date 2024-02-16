import ClientSeedManualPopup from "../../_base/view-models/provably-fair/ClientSeedManualPopup";
import ProvablyFairComponent from "../../_base/view-models/provably-fair/ProvablyFairComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChineseBlackjackPFComponent extends ProvablyFairComponent {
    @property(cc.Button)
    btnClientSeedIncrease: cc.Button = null;

    @property(cc.Button)
    btnClientSeedDecrease: cc.Button = null;

    @property()
    clientSeedMin = 0;

    @property()
    clientSeedMax = 103;

    private readonly CLIENT_SEED_RANGE = "0-103";

    onLoad() {
        this.setRandomClientSeed();
        super.onLoad();
    }

    onClickDecrementClientSeed() {
        if (this.currentClientSeed === this.clientSeedMin) {
            this.currentClientSeed = this.clientSeedMax;
        } else {
            this.currentClientSeed = (this.currentClientSeed - 1 + this.clientSeedMax) % this.clientSeedMax;
        }

        this.setEditBoxLimit();
    }

    onClickIncreaseClientSeed() {
        if (this.currentClientSeed === this.clientSeedMax) {
            this.currentClientSeed = this.clientSeedMin;
        } else {
            this.currentClientSeed = (this.currentClientSeed + 1) % this.clientSeedMax;
        }
        this.setEditBoxLimit();
    }

    onChangeInputLimit(value: string) {
        let currentValue = +value;
        if (currentValue > 103) {
            currentValue = 103;
        } else if (currentValue < 0) {
            currentValue = 0;
        }

        this.currentClientSeed = currentValue;
        this.setEditBoxLimit();
    }

    protected setEditBoxLimit() {
        this.clientSeed.string = this.currentClientSeed.toString();
    }

    onClickRandomClientSeed() {
        const value = Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
        this.currentClientSeed = value;
        this.setEditBoxLimit();
    }

    private getRandomClientSeed() {
        return Math.floor(Math.random() * (this.clientSeedMax - this.clientSeedMin + 1)) + this.clientSeedMin;
    }

    setClientSeedUIState(isEnable: boolean) {
        this.btnClientSeedIncrease.interactable = isEnable;
        this.changeOpacity(this.btnClientSeedIncrease.node, isEnable);
        this.btnClientSeedDecrease.interactable = isEnable;
        this.changeOpacity(this.btnClientSeedDecrease.node, isEnable);
        this.clientSeed.enabled = isEnable;
    }

    setRandomClientSeed() {
        this.currentClientSeed = this.getRandomClientSeed();
        this.clientSeed.string = this.currentClientSeed.toString();
    }

    onClientSeedClick() {
        super.onClientSeedClick();
        const clientSeedManual = cc.instantiate(this.clientSeedManualPrefab);
        const clientSeedManualCpt = clientSeedManual.getComponent(ClientSeedManualPopup);
        clientSeedManualCpt.initClientSeedManualPopup({
            clientSeedRange: this.CLIENT_SEED_RANGE,
            clientSeed: this.clientSeed.string || ""
        });
        clientSeedManualCpt.provablyFairComponent = this;
        clientSeedManualCpt.callbackOpenGuide = () => {
            this.onGuideClick();
        };
        clientSeedManualCpt.callbackUpdateClientSeed = (value: string) => {
            console.log("callbackUpdateClientSeed-----------", value);
            this.updateClientSeed(value);
        };

        this.node.addChild(clientSeedManual);
    }
}
