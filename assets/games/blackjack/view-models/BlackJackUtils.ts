import ChipStack from "../../../common/chip-stack/views/ChipStack";
import GameUtils from "../../../common/GameUtils";

export default class BlackJackUtils {
    public static getValues(rank: string): number[] {
        switch (rank) {
            case "A":
                return [1, 11];
            case "J":
            case "Q":
            case "K":
                return [10];
            default:
                return [+rank];
        }
    }

    public static getTotal(cards: any[], cardNum: number): number[] {
        let total = 0;
        let hasAce = false;
        cards.forEach((card, index) => {
            if (index >= cardNum) {
                return;
            }
            if (card.rank === "A") {
                hasAce = true;
            }
            total += BlackJackUtils.getValues(card.rank)[0];
        });
        if (hasAce && total + 10 < 22) {
            return [total, total + 10];
        }
        return [total];
    }

    public static createChip(bet: number, chipAltas: cc.SpriteAtlas): cc.Node {
        const chip = new cc.Node();
        const chipSprite = chip.addComponent(cc.Sprite);
        const name = `chip${bet}`;
        chipSprite.spriteFrame = chipAltas.getSpriteFrame(name);
        return chip;
    }

    public static createChipStack(bet: number, chipAltas: cc.SpriteAtlas, options: number[], shadowFrame: cc.SpriteFrame, skewX: number) {
        const values = GameUtils.getChipValues(bet, options);
        const node = new cc.Node();
        const chipStack = node.addComponent(ChipStack);
        chipStack.chipSize = 26;
        chipStack.thickness = 10;
        chipStack.skewX = skewX;

        const keys = Object.keys(values).sort((a, b) => +b - +a);
        let firstChip = true;
        keys.forEach((chip, index) => {
            const count = values[chip];
            for (let i = 0; i < count; i++) {
                const chipNode = this.createChip(+chip, chipAltas);
                chipStack.addChip(chipNode);

                if (firstChip && i === 0) {
                    firstChip = false;
                    const shadow = new cc.Node();
                    shadow.addComponent(cc.Sprite).spriteFrame = shadowFrame;
                    chipNode.addChild(shadow);
                }
            }
        });
        return node;
    }
}
