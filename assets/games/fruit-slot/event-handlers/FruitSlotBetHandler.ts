import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import FruitSlot from "../view-models/FruitSlot";
import GameUtils from "../../../common/GameUtils";
import * as _ from "lodash";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";

export class FruitSlotBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }

    private _betAmount = 0;

    handleChipInMainRoom(data: any) {
        const mainRoomGame = this.main as WebSocketTableGameBase;
        if (mainRoomGame && mainRoomGame.enablePlaceChips) {
            if (data.ownChip) {
                this.placeOwnChip(data);
            }
        }
    }

    handleDestPosition(destNode: any, destPosition: any) {
        if (destNode.childrenCount > 0) {
            const stack = destNode.children[0].getComponent(ChipStack);
            if (stack) {
                destPosition = cc.v2(0, stack.getCurrentHeight());
            }
        }

        return destPosition;
    }

    getBetAmount(): number {
        return this._betAmount;
    }

    placeOwnChip(data) {
        const chipFlyingDuration = 0.5;
        const betItem = _.find(this.main.betItems, (item) => item.node.name.toLowerCase() === data.ownChip.betChoice.toLowerCase());

        const chipNode = this.main.betChips.createBigChip(data.ownChip.amount);
        const destNode = betItem.chipNode;
        const startNode = this.main.betChips.getChipNode(data.ownChip.amount);
        chipNode.position = destNode.convertToNodeSpaceAR(startNode.convertToNodeSpaceAR(cc.v3(0, 0)));
        destNode.addChild(chipNode);

        let destPosition = cc.v2(0, 0);
        destPosition = this.handleDestPosition(destNode, destPosition);

        const betAmount = Object.values(data.ownBets).filter((obj) => {
            return obj;
        });
        console.log("betAmount", betAmount);

        chipNode.runAction(
            cc.sequence(
                cc.jumpTo(chipFlyingDuration, destPosition, 150, 1),
                cc.callFunc(() => {
                    destNode.destroyAllChildren();
                    const chipStack = GameUtils.createChipStack(
                        data.ownBets.betItem,
                        this.main.betChips,
                        this.main.shadowChip,
                        destNode.skewX
                    );
                    chipStack.zIndex = -1;
                    destNode.addChild(chipStack);
                })
            )
        );
    }
}
