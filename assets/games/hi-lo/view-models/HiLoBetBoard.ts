import SnappedScrollView from "../../../common/bet-chips/view-models/SnappedScrollView";
import GameUtils from "../../../common/GameUtils";
import GameBase from "../../_base/GameBase";
import HiLo from "./HiLo";
import HiLoBetChipItem from "./HiLoBetChipItem";

const { ccclass, property } = cc._decorator;
type OnChangedBet = (bet: string) => void;

@ccclass
export default class HiLoBetBoard extends cc.Component {
    @property(cc.Node)
    betAmounts: cc.Node = null;

    @property(cc.Node)
    prevButton: cc.Node = null;

    @property(cc.Node)
    nextButton: cc.Node = null;

    @property(cc.Prefab)
    numberBetPrefab: cc.Prefab = null;

    @property(SnappedScrollView)
    snappedScrollView: SnappedScrollView = null;

    @property
    movingStep = 1;

    @property
    displaySize = 6;

    public onChanged: OnChangedBet = (bet) => {};
    public chipValues: number[] = [];

    private selectedIndex = 0;
    private chipList: cc.Node[] = [];
    private currentBetValue = "1";
    private gameConfigs = {
        chips: [1, 5, 10, 20, 50, 100, 500],
        maxBet: 2000,
        minBet: 1
    };

    public init(onChanged: OnChangedBet) {
        this.onChanged = onChanged;
    }

    onLoad() {
        this.prevButton.active = false;
        this.snappedScrollView.onScrollEnded = () => {
            const min = this.snappedScrollView.getMinDisplayIndex();

            if (this.selectedIndex < min) {
                this.selectedIndex = min;
                this.selectedIndex = Math.min(this.selectedIndex, this.chipList.length - this.displaySize);
            } else if (this.selectedIndex > min + this.displaySize - 1) {
                this.selectedIndex = min + this.displaySize - 1;
            }

            this.updateArrowVisibility();
            this.updateSelectedChipValue();
        };
        this.setChipValues(this.gameConfigs);
    }

    setChipValues(gameConfigs: any) {
        if (gameConfigs.chips.length === 0) {
            return;
        }
        // this.gameConfigs = gameConfigs;
        // this.configValues = gameConfigs.chips;
        this.updateChips();
    }

    updateChips() {
        //this.chipValues = GameUtils.getFilterValuesByStakeLevel(this.configValues, this.gameConfigs);
        this.chipValues = this.gameConfigs.chips;
        this.createChips();

        const currentBet =
            this.chipValues.findIndex((value) => parseInt(value.toString()) === parseInt(this.currentBetValue)) !== -1
                ? this.currentBetValue
                : this.chipValues[0].toString();
        const needResetScrollOffset = currentBet !== this.currentBetValue;
        this.setCurrentBet(currentBet);
        this.snappedScrollView.initCalculatedPercent();
        if (needResetScrollOffset) {
            this.snappedScrollView.scroll.scrollToPercentHorizontal(0, 0.1);
        }
    }

    createChips() {
        this.chipList.forEach((chip) => chip.destroy());
        this.chipList = [];
        this.chipValues.forEach((value) => {
            const node = cc.instantiate(this.numberBetPrefab);
            node.getComponent(HiLoBetChipItem).renderBetChipItem(value);
            this.betAmounts.addChild(node);
            node.on("click", this.onClickBet.bind(this));
            this.chipList.push(node);
        });

        const layout = this.betAmounts.getComponent(cc.Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;
    }

    public onClickBet(target) {
        const betControl = target.node.getComponent(HiLoBetChipItem);
        const bet = betControl.number.string;
        let i = 0;
        for (; i < this.chipList.length; i++) {
            if (this.chipList[i].getComponent(HiLoBetChipItem).number.string === bet) {
                break;
            }
        }
        this.selectedIndex = i;
        this.scrollToSelectedIndex();
    }

    private scrollToSelectedIndex() {
        this.updateArrowVisibility();

        const min = this.snappedScrollView.getMinDisplayIndex();
        if (this.selectedIndex <= min) {
            this.snappedScrollView.scrollTo(min > 0 ? min - 1 : 0);
        }
        if (this.selectedIndex >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(min + 1);
        }
        this.updateSelectedChipValue();
    }

    public onClickPrevButton() {
        this.selectedIndex -= this.movingStep;
        this.scrollToSelectedIndex();
    }

    public onClickNextButton() {
        this.selectedIndex += this.movingStep;
        this.scrollToSelectedIndex();
    }

    private updateArrowVisibility() {
        this.prevButton.active = true;
        this.nextButton.active = true;
        if (this.selectedIndex <= 0) {
            this.selectedIndex = 0;
            this.prevButton.active = false;
        } else if (this.selectedIndex >= this.chipList.length - 1) {
            this.selectedIndex = this.chipList.length - 1;
            this.nextButton.active = false;
        }
    }

    private updateSelectedChipValue() {
        if (this.chipList.length === 0) {
            return;
        }
        const item = this.chipList[this.selectedIndex];
        this.setCurrentBet(item);
    }

    public setCurrentBet(bet: cc.Node) {
        const control = bet.getComponent(HiLoBetChipItem);
        this.currentBetValue = control.number.string;
        control.selectedBg.node.active = true;
        //this.updateSelectedBet(bet);
        this.onChanged(control.number.string);
    }

    private updateSelectedBet(targetName: string) {
        this.betAmounts.children.forEach((chip) => {
            if (chip.name === targetName) {
                chip.getComponent(HiLoBetChipItem).setSelectedBg();
            }
        });
    }
}
