import { lodash } from "../../../ClientModules";
import BetChipsNew from "../../../common/bet-chips/view-models/BetChipsNew";
import ChipConfig from "../../../common/bet-chips/view-models/ChipConfig";
import ChipFlyConfig, { ChipParams } from "../../../common/bet-chips/view-models/ChipFlyConfig";
import ChipView from "../../../common/bet-chips/view-models/ChipView";
import ChipViewNew from "../../../common/bet-chips/view-models/ChipViewNew";
import FadeEffectButton from "../../../common/custom-button/FadeEffectButton";
import GameUtils from "../../../common/GameUtils";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJack, { BlackJackActionType } from "../../blackjack/view-models/BlackJack";
import IngameActionHandler from "../../blackjack/view-models/handlers/IngameActionHandler";
import HandPlace from "../../blackjack/view-models/HandPlace";
import PontoonDealHandler from "./handlers/PontoonDealHandler";
import PontoonFinishHandler from "./handlers/PontoonFinishHandler";
import PontoonInGameHandler from "./handlers/PontoonInGameHandler";

const { ccclass, property } = cc._decorator;

export const PontoonId = 72;

@ccclass
export default class Pontoon extends BlackJack {
    @property(cc.Label)
    fiveCardsOddsLabel: cc.Label = null;

    protected moveCardDuration = 0.35;
    chipJumpHeight = 250;
    betChips: BetChipsNew;

    constructor() {
        super();
        this.gameId = PontoonId;
    }

    public get chipFlyConfig() {
        return ChipFlyConfig.getInstance();
    }

    public get chipConfig() {
        return ChipConfig.getInstance();
    }

    setupSpecialHandler() {
        this.dealHander = new PontoonDealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new PontoonFinishHandler(this);
        this.ingameHander = new PontoonInGameHandler(this);
    }

    dealerOpenFirstCard(card: CardModel, duration: number) {
        this.dealerOpenCard(card, duration, 0);
    }

    updateOdds() {
        const pontoonOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.pontoon - 1, 2)}`;
        this.blackjackOddLabel.string = GameUtils.getText("pontoon.pontoon_pay", { odds: pontoonOdds }).toUpperCase();

        const fiveCardsOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.fiveCardTrick - 1, 2)}`;
        this.fiveCardsOddsLabel.string = GameUtils.getText("pontoon.five_card_pay", { odds: fiveCardsOdds }).toUpperCase();
    }

    onDoubleClick() {
        super.onDoubleClick();
        this.doubleButton.getComponent(FadeEffectButton).setDisabled(true);
    }

    throwChipAnim(destNode: cc.Node, startNode: cc.Node, handPlace: HandPlace) {
        const chipFlyingDuration = 0.5;
        const randomValue = lodash.random(0, 0);
        const chipFly = this.chipFlyConfig.getChipFlyConfig(randomValue);
        const chipNode = this.betChips.createChipFly(this.currentBet);
        const propertiesChip = chipNode.getComponent(ChipViewNew);
        propertiesChip.initChipValue(chipFly.rotationComp1, ChipParams.scaleX, ChipParams.scaleY, ChipParams.offset);
        let nodeTmp: cc.Node;
        if (destNode.childrenCount === 0) {
            nodeTmp = new cc.Node();
            destNode.addChild(nodeTmp);
        } else {
            nodeTmp = destNode.children[0];
        }

        chipNode.position = destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v3(0, 0)));

        nodeTmp.addChild(chipNode);
        let destPosition = cc.v2(0, 0);
        if (nodeTmp.childrenCount > 1) {
            const destY = (nodeTmp.childrenCount - 1) * (ChipParams.offset + ChipParams.offsetStack);
            destPosition = cc.v2(lodash.random(-2, 2), destY);
        }

        this.moveAndMergeChip(chipNode, chipFlyingDuration, destPosition, handPlace, nodeTmp);
        this.shakeChipAnim(propertiesChip, chipFly);
    }

    private shakeChipAnim(propertiesChip: ChipViewNew, chipFly: any) {
        cc.tween(propertiesChip)
            .to(0.2, {
                rotation: chipFly.rotationComp2,
                scaleX: chipFly.scaleX1,
                scaleY: chipFly.scaleY1,
                rotationNode: chipFly.rotationNode1
            })
            .to(0.2, { rotationNode: chipFly.rotationNode3, scaleX: chipFly.scaleX2, scaleY: chipFly.scaleY2 })
            //.to(0.1, { rotationNode: chipFly.rotationNode3 })

            .to(0.05, { skewY: -5 })
            .to(0.1, { skewY: 5 })
            .to(0.05, { skewY: 0 })
            .start();
    }

    private moveAndMergeChip(chipNode: cc.Node, chipFlyingDuration: number, destPosition: any, handPlace: HandPlace, nodeTmp: cc.Node) {
        chipNode.runAction(
            cc.sequence(
                cc.jumpTo(chipFlyingDuration, destPosition.x, destPosition.y, this.chipJumpHeight, 1),
                cc.delayTime(0.2),
                cc.callFunc(() => {
                    handPlace.updateDisplayBetValue();
                    this.gameStatus === BlackJackActionType.START_ROUND && (handPlace.clearBetButton.active = true);
                    this.updateTotalBetLabel();
                    const stackObj = GameUtils.isChipStack(handPlace.getBetAmount(), this.betChips, nodeTmp);
                    if (stackObj.isStack) {
                        const chipTotal = stackObj.chipTotal;
                        const nodeArr = [];
                        const values = stackObj.chipValues;
                        const keys = Object.keys(values).sort((a, b) => +b - +a);
                        keys.forEach((chip) => {
                            const count = values[chip];
                            for (let i = 0; i < count; i++) {
                                nodeArr.push(chip);
                            }
                        });
                        for (let i = 0; i < nodeTmp.childrenCount; i++) {
                            const chipCurr = nodeTmp.children[i];
                            if (i < chipTotal) {
                                const chipView = chipCurr.getComponent(ChipView);
                                chipView.setColor(this.chipConfig.getChipColor(nodeArr[i]));
                                chipView.setValue(nodeArr[i]);
                            } else {
                                chipCurr.destroy();
                            }
                        }
                    }
                })
            )
        );
    }

    createChipStack(betAmount: any, node: cc.Node) {
        const chipStack = GameUtils.createChipFlyStack(betAmount, this.betChips);
        node.addChild(chipStack);
        return chipStack;
    }
}
