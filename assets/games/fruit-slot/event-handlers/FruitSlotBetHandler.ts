import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import FruitSlot from "../view-models/FruitSlot";
import GameUtils from "../../../common/GameUtils";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";
import ChipView from "../../../common/bet-chips/view-models/ChipView";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import { lodash } from "../../../ClientModules";

export class FruitSlotBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    private _betAmount = 0;
    private readonly chipScaleX = 0.3;
    private readonly chipScaleY = 0.25;

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
    }

    handleChipInMainRoom(data: any) {
        const mainRoomGame = this.main as WebSocketTableGameBase;
        if (mainRoomGame && mainRoomGame.enablePlaceChips) {
            if (data.ownChip) {
                this.placeOwnChip(data);
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
        this.calculateTotalBetAmount(data.betChoice, data.ownChip.amount);
        const startNode = this.main.betChips.getChipNode(data.ownChip.amount);
        this.handleChipStack(data.ownChip.amount, startNode, data.betChoice, this.main.gameData.totalBetAmount[data.betChoice], true);
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

        const convertValue = GameUtils.getValueByCurrency(amount, rate);
        const chipValues = GameUtils.getChipQuantity(convertValue, this.main.betChips.chipValues);

        Object.keys(chipValues).forEach((chipValue) => {
            let count = chipValues[chipValue];
            for (; count > 0; count--) {
                this.handleChipStack(+chipValue, startNode, betChoice, this.main.gameData.totalBetAmount[betChoice]);
            }
        });

        this.playerChips.pop();
    }

    placeTotalBets(totalBets: any) {
        Object.keys(totalBets).forEach((betChoice) => {
            const betItem = lodash.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
            this.main.gameData.totalBetAmount[betChoice] = totalBets[betChoice];
            this.addChipStack(betItem.chipNode, totalBets[betChoice]);
        });
    }

    calculateTotalBetAmount(betChoice: string, amount: number) {
        this.main.gameData.totalBetAmount[betChoice] = (this.main.gameData.totalBetAmount[betChoice] || 0) + amount;
    }

    handleChipStack(betAmount: number, startNode: cc.Node, betChoice: string, totalAmount: number, isOwnBet = false) {
        const betItem = lodash.find(this.main.betItems, (item) => item.node.name.toLowerCase() === betChoice.toLowerCase());
        const destNode = betItem.chipNode;
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
                    this.addChipStack(destNode, totalAmount);
                })
            )
        );
    }

    addChipStack(destNode: cc.Node, totalAmount: number) {
        const nameChipStack = "chipStackNode";
        const chipStack = GameUtils.createChipStack(totalAmount, this.main.betChips, this.main.shadowChip, destNode.skewX);
        chipStack.zIndex = -1;
        chipStack.scaleX = this.chipScaleX;
        chipStack.scaleY = this.chipScaleY;
        chipStack.children.forEach((child) => {
            child.getComponent(ChipView)?.applyForSmallChip();
        });
        const oldChipStack = destNode.getChildByName(nameChipStack);
        oldChipStack && destNode.removeChild(oldChipStack);
        oldChipStack?.destroy();
        destNode.addChild(chipStack, -1, nameChipStack);
    }
}
