const { ccclass, property } = cc._decorator;
import * as _ from 'lodash';
type OnChangedBet = (bet: string) => void;

@ccclass
export default class BetChips extends cc.Component {
    @property(cc.Node)
    chips: cc.Node = null;

    @property(cc.AudioSource)
    singleChipAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    multiChipAudio: cc.AudioSource = null;

    @property(cc.SpriteFrame)
    chip1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip5: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip10: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip50: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip100: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip200: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    chip500: cc.SpriteFrame = null;

    @property()
    defaultChip = "1";

    public onChanged: OnChangedBet = (bet) => { };

    onLoad() {
        this.setCurrentBet(this.defaultChip);
    }

    public init(onChanged: OnChangedBet) {
        this.onChanged = onChanged;
        this.setCurrentBet(this.defaultChip);
    }

    public onClickBet(event) {
        var bet = event.target.name;
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public setCurrentBet(bet: string) {
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public moveChips(chipsBox: cc.Node, destBox: cc.Node, enableRandomChipsCount: boolean = false) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var destBoxInChipBoxSpacePosition = chipsBox.convertToNodeSpaceAR(destBoxPosition);

        _.forEach(chipsBox.children, chip => {
            chip.runAction(this.moveChipTo(destBoxInChipBoxSpacePosition))
        });
    }

    public moveChipsWithRandomAmount(chipsBox: cc.Node, destBox: cc.Node) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var destBoxInChipBoxSpacePosition = chipsBox.convertToNodeSpaceAR(destBoxPosition);
        var chipsCount = _.round(_.random(1, 4));

        for (var i = 0; i < chipsCount; i++) {
            var chip = chipsBox.children[i];

            if (chip) {
                chip.runAction(this.moveChipTo(destBoxInChipBoxSpacePosition));
                setTimeout(() => {
                    chip.destroy();
                }, 800);
            }
        }
    }

    public payoutChips(chipBox: cc.Node, dealerBox: cc.Node, chipRange: cc.Vec2) {
        var dealerBoxPosition = dealerBox.parent.convertToWorldSpaceAR(dealerBox.position);
        var dealerBoxInChipBoxSpacePosition = chipBox.convertToNodeSpaceAR(dealerBoxPosition);
        cc.RedT.isSoundGame() && this.multiChipAudio.play();

        _.forEach(chipBox.children, chip => {
            var cloneChip = cc.instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            const xDest = _.random(0, chipRange.x + 1);
            const yDest = _.random(0, chipRange.y + 1);
            chipBox.addChild(cloneChip);

            cloneChip.runAction(this.moveChipTo(cc.v2(xDest, yDest)));
        });
    }

    public placeChipBet(bet: number, destNode: cc.Node, range: cc.Vec2, startNode: cc.Node = null) {
        var chipPosition: cc.Vec2;

        if (startNode) {
            chipPosition = startNode.parent.convertToWorldSpaceAR(startNode.position);
        }
        else {
            var chip = this.chips.children.filter(child => child.name === bet.toString())[0];
            chipPosition = chip.parent.convertToWorldSpaceAR(chip.position);
        }

        chipPosition = destNode.convertToNodeSpaceAR(chipPosition);
        var chipNode = this.createChip(chipPosition, bet);

        const xDest = _.random(0, range.x + 1);
        const yDest = _.random(0, range.y + 1);

        destNode.addChild(chipNode.node);

        cc.RedT.isSoundGame() && this.singleChipAudio.play();
        chipNode.node.runAction(
            cc.sequence(
                this.moveChipTo(cc.v2(xDest, yDest)),
                cc.sequence(
                    cc.moveTo(0.1, cc.v2(xDest, yDest + 6)),
                    cc.moveTo(0.1, cc.v2(xDest, yDest))
                )
            ));
    }

    private moveChipTo(position: cc.Vec2): cc.ActionInterval {
        return cc.moveTo(0.5, position).easing(cc.easeSineOut());
    }

    private createChip(position: cc.Vec2, bet): cc.Sprite {
        var chip = new cc.Node();
        var chipSprite = chip.addComponent(cc.Sprite);
        chipSprite.spriteFrame = this['chip' + bet];
        chipSprite.node.position = position;
        return chipSprite;
    }

    private updateSelectedBet(targetName: string) {
        this.chips.children.map((chip) => {
            if (chip.name == targetName) {
                console.log(chip);
                chip.children[0].active = true;
                chip.zIndex = 2;
                cc.tween(chip)
                    .to(0.2, {
                        scale: 1.15,
                        position: cc.v2(chip.position.x, 12)
                    })
                    .start();
            } else {
                chip.children[0].active = false;
                chip.zIndex = 1;
                cc.tween(chip)
                    .to(0.2, {
                        scale: 1,
                        position: cc.v2(chip.position.x, 0)
                    })
                    .start();
            }
        })
    }
}
