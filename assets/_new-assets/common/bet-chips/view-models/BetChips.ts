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

    public onChanged: OnChangedBet = (bet) => { };

    public onClickBet(event) {
        var bet = event.target.name;
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public setCurrentBet(bet: string) {
        this.updateSelectedBet(bet);
    }

    public throwChip(bet, destNode: cc.Node, range: cc.Vec2) {
        var chip = this.chips.children.filter(child => child.name === bet)[0];
        var chipPosition = chip.parent.convertToWorldSpaceAR(chip.position);
        chipPosition = destNode.convertToNodeSpaceAR(chipPosition);
        var chipNode = this.createChip(chipPosition, bet);

        const xDest = _.random(0, range.x + 1);
        const yDest = _.random(0, range.y + 1);

        destNode.addChild(chipNode.node);

        cc.RedT.isSoundGame() && this.singleChipAudio.play();
        chipNode.node.runAction(
            cc.sequence(
                cc.moveTo(0.3, cc.v2(xDest, yDest)).easing(cc.easeOut(3)),
                cc.sequence(
                    cc.moveTo(0.1, cc.v2(xDest, yDest + 6)),
                    cc.moveTo(0.1, cc.v2(xDest, yDest))
                )
            ));
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
