import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import FruitSlot from "../view-models/FruitSlot";
import GameUtils from "../../../common/GameUtils";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";
import ChipView from "../../../common/bet-chips/view-models/ChipView";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import { lodash } from "../../../ClientModules";
import FruitSlotChipView from "../view-models/FruitSlotChipView";
import BetChips from "../../../common/bet-chips/view-models/BetChips";
import { updatePreviousBets } from "../../_base_new/actions/BetAction";

export class FruitSlotBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    private _betAmount = 0;
    private readonly chipScaleX = 0.3;
    private readonly chipScaleY = 0.22;

    handle(data: any) {
        if (this.main.isStopGame || this.main.isDisableGame) {
            return;
        }

        if (!this.main.isStopGame && !this.main.isDisableGame) {
            if (data.ownBets) {
                this.main.previousRoundBetChoices = lodash.cloneDeep(data.ownBets);
            }
        }

        if (!lodash.isEmpty(data.totalBets) || !lodash.isEmpty(data.ownBets)) {
            this.main.betItems.forEach((item) => {
                item.setData(data);
            });
        }

        this.handleEndBet(data);

        if (this.main.gameConfigs) {
            this.handleChipInMainRoom(data);
        }

        if (data.roundId) {
            this.main.roundId = data.roundId;
        }

        if (data.ownBets) {
            updatePreviousBets(this.main)(data.ownBets);
        }

        if (data.rebet) {
            this.handleRebet(data.rebet);
        }
    }

    handleChipInMainRoom(data: any) {
        const mainRoomGame = this.main as WebSocketTableGameBase;
        if (mainRoomGame && mainRoomGame.enablePlaceChips) {
            if (data.ownChip) {
                this.placeOwnChip(data.ownChip);
            }

            if (data.playerChip) {
                this.handlePlayerChipAction(data);
            }

            if (data.totalBets && data.gameConfigs && data.remainingTime < mainRoomGame.config.betTime) {
                this.placeTotalBets(data.totalBets);
            }
        }
    }

    handleDestPosition(destNode: any, destPosition: any) {
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight() * this.chipScaleY);
            }
        }
        return destPosition;
    }

    getBetAmount(): number {
        return this._betAmount;
    }

    placeOwnChip(data) {
        this.calculateTotalBetAmount(data.betChoice, data.amount);
        const startNode = this.main.betChips.getChipNode(data.amount);
        this.handleChipStack(data.amount, startNode, data.betChoice, true);
    }

    placePlayerChip(data) {
        const { betChoice, amount, rate } = data;
        this.calculateTotalBetAmount(betChoice, amount);
        let startNode: cc.Node;
        const playerSlot = this.main.playerHandler.getPlayerSlot(data.playerId);
        if (playerSlot) {
            this.updatePlayerSlotDataStorage(data, playerSlot);
            startNode = playerSlot.avatar.node;
        } else {
            startNode = this.main.otherPlayers;
            this.updateOtherDataStorage(data);
        }

        const chipValues = this.getChipValues(amount, rate, false);

        Object.keys(chipValues).forEach((chipValue) => {
            let count = chipValues[chipValue];
            for (; count > 0; count--) {
                this.handleChipStack(+chipValue, startNode, betChoice, false, rate);
            }
        });

        this.playerChips.pop();
    }

    placeTotalBets(totalBets: any) {
        Object.keys(totalBets).forEach((betChoice) => {
            const betItem = lodash.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
            this.main.gameData.totalBetAmount[betChoice] = totalBets[betChoice];
            this.addChipStack(betItem.chipNode, totalBets[betChoice], true);
        });
    }

    calculateTotalBetAmount(betChoice: string, amount: number) {
        this.main.gameData.totalBetAmount[betChoice] = (this.main.gameData.totalBetAmount[betChoice] || 0) + amount;
    }

    handleChipStack(betAmount: number, startNode: cc.Node, betChoice: string, isOwnBet = false, rate = 1) {
        const betItem = lodash.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
        const destNode = betItem.chipNode;
        this.main.betOptionsUI?.playSingleChipsSound(isOwnBet);
        const durationMoveChip = 0.7;
        const chipNode = this.main.betChips.createSmallChip(betAmount);
        if (!isOwnBet) {
            chipNode.scaleX = this.chipScaleX;
            chipNode.scaleY = this.chipScaleY;
        }
        chipNode.position = destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v3(0, 0)));
        destNode.addChild(chipNode);
        let destPosition = cc.v2(0, 0);
        destPosition = this.handleDestPosition(destNode, destPosition);

        const actionMove = isOwnBet
            ? cc.jumpTo(durationMoveChip, destPosition, 150, 1)
            : cc.moveTo(durationMoveChip, destPosition).easing(cc.easeSineOut());
        chipNode.runAction(
            cc.sequence(
                actionMove,
                cc.callFunc(() => {
                    chipNode.destroy();
                    this.addChipStack(destNode, this.main.gameData.totalBetAmount[betChoice], isOwnBet, rate);
                })
            )
        );
    }

    createChipStack(totalBet: number, betChips: BetChips, skewX: number, rate: number, isOwnBet: boolean) {
        const values = this.getChipValues(totalBet, rate, isOwnBet);
        const node = new cc.Node();
        const chipStack = node.addComponent(ChipStack);
        chipStack.chipSize = 26;
        chipStack.thickness = 18;
        chipStack.skewX = skewX;

        const keys = Object.keys(values).sort((a, b) => +b - +a);
        let firstChip = true;
        keys.forEach((chip) => {
            const count = values[chip];
            for (let i = 0; i < count; i++) {
                let chipNode: cc.Node;
                if (+chip === 0) {
                    chipNode = betChips.createLowValueChip();
                } else {
                    chipNode = betChips.createBigChip(+chip);
                }
                chipStack.addChip(chipNode);

                if (firstChip && i === 0) {
                    firstChip = false;
                    const shadow = new cc.Node();
                    shadow.addComponent(cc.Sprite).spriteFrame = this.main.shadowChip;
                    chipNode.addChild(shadow);
                }
            }
        });
        return node;
    }

    addChipStack(destNode: cc.Node, totalAmount: number, isOwnBet: boolean, rate = 1) {
        const nameChipStack = "chipStackNode";
        const chipStack = this.createChipStack(totalAmount, this.main.betChips, destNode.skewX, rate, isOwnBet);

        chipStack.zIndex = -1;
        chipStack.scaleX = this.chipScaleX;
        chipStack.scaleY = this.chipScaleY;

        chipStack.children.forEach((child) => {
            child.getComponent(FruitSlotChipView)?.applyForSmallChip();
            //console.log("chipStack.children", child);
        });
        const oldChipStack = destNode.getChildByName(nameChipStack);
        oldChipStack && destNode.removeChild(oldChipStack);
        oldChipStack?.destroy();
        destNode.addChild(chipStack, -1, nameChipStack);
    }

    getChipValues(amount: number, rate: number, isOwnBet: boolean) {
        const convertValue = GameUtils.getValueByCurrency(amount, rate);
        const betValue = isOwnBet ? amount : convertValue;
        const values = GameUtils.getChipQuantity(betValue, this.main.betChips?.chipValues);
        return values;
    }
}
