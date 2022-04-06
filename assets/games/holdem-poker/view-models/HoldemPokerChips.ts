import BetChips from "../../../common/bet-chips/view-models/BetChips";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import GameUtils from "../../../common/GameUtils";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";
import HoldemPokerChoices from "../event-models/HoldemPokerChoices";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPoker from "./HoldemPoker";
import HoldemPokerBettingArea from "./HoldemPokerBettingArea";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HoldemPokerChips extends cc.Component {
    private readonly chipScaleX = 0.5;
    private readonly chipScaleY = 0.75 * this.chipScaleX;
    updateChipStackTween: cc.Tween;
    winningEffect: cc.Node;
    chipThick = 10;

    public createChip(betChips: BetChips, amount: number): cc.Node {
        return betChips.createSmallChip(amount, 1, true);
    }

    public convertAndCreateChipStack(betAmount: number, betChips: BetChips, shadowFrame: cc.SpriteFrame) {
        const values = this.convertChips(betAmount, betChips.chipValues);
        return this.createChipStack(values, betChips, shadowFrame);
    }

    convertChips(betAmount, chipValues) {
        return GameUtils.getChipQuantity(betAmount, chipValues);
    }

    createChipStack(chipQuantity, betChips: BetChips, shadowFrame: cc.SpriteFrame): cc.Node {
        const node = new cc.Node();
        node.scaleX = this.chipScaleX;
        node.scaleY = this.chipScaleY;

        const chipStack = node.addComponent(ChipStack);
        chipStack.chipSize = 26;
        chipStack.thickness = this.chipThick;

        const keys = Object.keys(chipQuantity).sort((a, b) => +b - +a);
        let firstChip = true;
        keys.forEach((chip) => {
            if (+chip > 0) {
                const count = chipQuantity[chip];
                for (let i = 0; i < count; i++) {
                    const chipNode = this.createChip(betChips, +chip);
                    chipStack.addChip(chipNode);

                    if (firstChip && i === 0) {
                        firstChip = false;
                        const shadow = new cc.Node();
                        shadow.addComponent(cc.Sprite).spriteFrame = shadowFrame;
                        chipNode.addChild(shadow);
                    }
                }
            }
        });

        return node;
    }

    public flyChipToBetPlace(betChips: BetChips, destNode: cc.Node, shadowChip: cc.SpriteFrame, betAmount: number, totalAmount: number) {
        if (!betAmount) {
            return;
        }
        const chipNode = this.createChip(betChips, betAmount);
        chipNode.scaleX = this.chipScaleX;
        chipNode.scaleY = this.chipScaleY;
        const startNode = betChips.getChipNode(betAmount) || betChips.node;
        chipNode.position = cc.v3(destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v2(0, 0))));
        destNode.addChild(chipNode);

        let destPosition = cc.v2(0, 0);
        const isHasAnyChip = destNode.childrenCount > 0;
        if (isHasAnyChip) {
            const stack = destNode.getComponentInChildren(ChipStack);
            const stackCount = stack ? stack.getChipNumber() : 0;
            const chipNumber = stack ? stackCount + destNode.childrenCount - 2 : destNode.childrenCount - 1;
            destPosition = cc.v2(0, chipNumber * this.chipThick * this.chipScaleY);
        }

        const jumpChipDuration = 0.3;

        chipNode.runAction(cc.jumpTo(jumpChipDuration, destPosition, 50, 1));
        this.updateChipStackTween && this.updateChipStackTween.stop();
        this.updateChipStackTween = cc
            .tween(this)
            .delay(jumpChipDuration)
            .call(() => {
                const chipsQuantity = this.convertChips(totalAmount, betChips.chipValues);
                this.updateChipStack(betChips, destNode, shadowChip, chipsQuantity);
            })
            .start();
    }

    public updateChipStack(betChips: BetChips, destNode: cc.Node, shadowChip: cc.SpriteFrame, chipsQuantity: []) {
        destNode.destroyAllChildren();
        const chipStack = this.createChipStack(chipsQuantity, betChips, shadowChip);
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);
    }

    public showWinningOption(
        gameData: HoldemPokerGameData<HoldemPokerChoices>,
        bettingAreas: HoldemPokerBettingArea[],
        betChips: BetChips,
        main: HoldemPoker,
        choicesConst: any
    ) {
        const winningHands = gameData.finishModel.settlementResult;
        let totalWin = 0;
        let totalBet = 0;

        for (const [key, value] of Object.entries(winningHands)) {
            const betAmount = gameData.placeBetModel.choices[choicesConst[key]] ?? 0;
            totalBet += betAmount;
            const bettingArea = bettingAreas.filter((a) => a.betChoice === key)[0];
            const jumpTime = 0.65;
            const delayBeforeFly = 0.1;
            if (value > 0) {
                totalWin += +value;
                if (+value > betAmount) {
                    const winAmount = value - betAmount;
                    const destNode = bettingArea.chipNode;
                    const chipStack = this.convertAndCreateChipStack(winAmount, betChips, main.shadowChip);
                    destNode.addChild(chipStack);
                    this.handleChipStack(chipStack, main, destNode, betChips, value, jumpTime, delayBeforeFly);
                    bettingArea.handleWinningAmount(value, true);
                    main.playStartGameAudio();
                }
            } else {
                const bettingArea = bettingAreas.filter((a) => a.betChoice === key)[0];
                this.flyChipToDealer(bettingArea, main.dealerChipTray, jumpTime, delayBeforeFly);
                main.playStartGameAudio();
            }
        }

        this.playerWinningAffectAction(totalWin, totalBet, gameData, main);
        main.getConfigs();
    }

    private handleChipStack(
        chipStack: cc.Node,
        main: HoldemPoker,
        destNode: cc.Node,
        betChips: BetChips,
        value: any,
        jumpTime: number,
        delayBeforeFly: number
    ) {
        const startPos = chipStack.parent.convertToNodeSpaceAR(main.dealerChipTray.convertToWorldSpaceAR(cc.v2(0, 0)));
        chipStack.position = cc.v3(startPos.x, startPos.y, 0);

        let destPosition = cc.v2(0, 0);
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight());
            }
        }
        chipStack.scale = this.chipScaleX;

        chipStack.runAction(
            cc.sequence(
                cc.jumpTo(jumpTime, destPosition, 100, 1),
                cc.delayTime(delayBeforeFly),
                cc.callFunc(() => {
                    destNode.children.length && destNode.destroyAllChildren();

                    const chipStack = this.convertAndCreateChipStack(value, betChips, main.shadowChip);
                    destNode.addChild(chipStack);
                })
            )
        );
    }
    private playerWinningAffectAction(
        totalWin: number,
        totalBet: number,
        gameData: HoldemPokerGameData<HoldemPokerChoices>,
        main: HoldemPoker
    ) {
        const isWin = totalWin > totalBet;
        totalWin > 0 && main.showWinningBet(totalWin);
        isWin && this.playWinningEffect(main, main.userAvatar.node.parent, 5);
        main.updateUserBalance();
        main.pokerCardScript.unFocusPlayerCard();
        gameData.finishModel.finishAnimationWinning();
    }

    private flyChipToDealer(bettingArea: HoldemPokerBettingArea, dealerLocation: cc.Node, jumpTime: number, delayBeforeFly: number) {
        const clonedChip = cc.instantiate(bettingArea.chipNode);
        bettingArea.node.addChild(clonedChip);
        bettingArea.chipNode.destroyAllChildren();
        const destPos = clonedChip.parent.convertToNodeSpaceAR(dealerLocation.convertToWorldSpaceAR(cc.v2(0, 0)));
        clonedChip.runAction(
            cc.sequence(
                cc.spawn(cc.jumpTo(jumpTime, destPos, 100, 1), cc.scaleTo(0.8, 0.5)),
                cc.delayTime(delayBeforeFly),
                cc.fadeOut(0.3),
                cc.callFunc(() => {
                    clonedChip.destroy();
                })
            )
        );
    }

    playWinningEffect(mainRoomGame: WebSocketTableGameBase, playerNode: cc.Node, duration = 5.4) {
        this.winningEffect = cc.instantiate(mainRoomGame.winningPlayerEffectPrefab);
        playerNode.addChild(this.winningEffect);
        const animation = this.winningEffect.getComponent(cc.Animation);

        this.winningEffect.runAction(
            cc.sequence(
                cc.callFunc(() => {
                    animation.play();
                }),
                cc.delayTime(duration),
                cc.callFunc(() => {
                    this.stopWinningEffect();
                })
            )
        );
    }

    stopWinningEffect() {
        if (this.winningEffect && this.winningEffect.isValid) {
            this.winningEffect.destroy();
        }
    }
}
