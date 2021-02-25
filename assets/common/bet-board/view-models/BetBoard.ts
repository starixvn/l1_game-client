import BetBoardConfig from "./BetBoardConfig";
import { nFormatter } from "../../../common/helpers/NumberHelper";
import { lazyInject } from "../../../Application";

const { ccclass, property } = cc._decorator;

export interface BetInfo {
    choice: string;
    bet: number;
    betItem: cc.Node;
    maxBet: number;
}

@ccclass
export default class BetBoard extends cc.Component {
    @property(cc.Button)
    okButton: cc.Button = null;

    @property(cc.Node)
    itemContainer: cc.Node = null;

    @lazyInject(BetBoardConfig)
    private readonly config: BetBoardConfig;

    public info: BetInfo = null;

    public callback = {
        acceptedBet: (info: BetInfo) => {},
        changedBet: (info: BetInfo) => {},
        cancel: (info: BetInfo) => {},
        getPreset: () => 0
    };

    onLoad(): void {
        this.updateItems();
    }

    updateItems() {
        const listItem = this.config.items;
        this.itemContainer.children.forEach((child, index) => {
            const label = child.children[0].getComponent(cc.Label);
            let value = listItem[index];

            child.name = value;
            if (value !== "MAX") {
                value = `+${nFormatter(value)}`;
            }
            label.string = value;
        });
    }

    public onAcceptBet() {
        cc.RedT.audio.playClick();
        this.callback.acceptedBet(this.info);
        this.node.active = false;
        this.info = null;
    }

    public onCloseClick() {
        cc.RedT.audio.playClick();
        this.close();
    }

    public onClearClick() {
        cc.RedT.audio.playClick();
        this.info.bet = 0;
        this.betChanged();
    }

    public close() {
        this.node.active = false;
        this.info && this.callback.cancel(this.info);
        this.info = null;
    }

    public show(info: BetInfo) {
        if (this.info) {
            if (info.choice === this.info.choice) {
                return;
            }
            this.callback.cancel(this.info);
        }

        this.info = info;
        this.info.bet = info.bet || this.callback.getPreset();
        this.info.bet = Math.min(this.info.bet, this.info.maxBet);
        this.node.active = true;
        this.betChanged();
    }

    public onItemBetClicked(e) {
        cc.RedT.audio.playClick();
        const amount = parseInt(e.target.name) || this.info.maxBet;
        this.info.bet += amount;
        this.info.bet = Math.min(this.info.bet, this.info.maxBet);
        this.betChanged();
    }

    private betChanged() {
        this.callback.changedBet(this.info);
        this.okButton.interactable = this.info.bet > 0;
    }
}
