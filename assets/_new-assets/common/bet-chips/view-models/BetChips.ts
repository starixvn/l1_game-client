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

    @property(cc.AudioSource)
    betChipClickAudio: cc.AudioSource = null;

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
    public readonly chipFlyingTime: number = 0.7;
    public readonly loginUserChipFlyingTime: number = 0.5;
    public readonly chipDelayFlyingTime: number = 0.5;

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
        this.betChipClickAudio.play();
        this.onChanged(bet);
    }

    public setCurrentBet(bet: string) {
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public moveChips(chipsBox: cc.Node, destBox: cc.Node, hideOnDestBox: boolean = true) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var destBoxInChipBoxSpacePosition = chipsBox.convertToNodeSpaceAR(destBoxPosition);

        _.forEach(chipsBox.children, chip => {
            this.startMoveChip(chip, destBoxInChipBoxSpacePosition, hideOnDestBox);
        });
    }

    public moveChipsWithRandomAmount(chipsBox: cc.Node, destBox: cc.Node, maxChips: number = 3, hideOnDestBox: boolean = true) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var cloneChipsBox = cc.instantiate(chipsBox);
        cloneChipsBox.destroyAllChildren();
        chipsBox.parent.addChild(cloneChipsBox);

        var destBoxInChipBoxSpacePosition = cloneChipsBox.convertToNodeSpaceAR(destBoxPosition);
        var chipsCount = _.round(_.random(1, maxChips));

        for (var i = 0; i < chipsCount; i++) {
            var chip = chipsBox.children[i];

            if (chip) {
                var cloneChip = cc.instantiate(chip);
                cloneChipsBox.addChild(cloneChip);
                chipsBox.removeChild(chip);
                this.startMoveChip(cloneChip, destBoxInChipBoxSpacePosition, hideOnDestBox);
            }
        }

        setTimeout(() => cloneChipsBox.destroy(), this.chipFlyingTime * 3000)
    }

    public payChipsToWinningBetItem(chipBox: cc.Node, dealerBox: cc.Node) {
        var dealerBoxPosition = dealerBox.parent.convertToWorldSpaceAR(dealerBox.position);
        var dealerBoxInChipBoxSpacePosition = chipBox.convertToNodeSpaceAR(dealerBoxPosition);
        this.playMultiChipsSound();

        _.forEach(chipBox.children, chip => {
            var cloneChip = cc.instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            const xDest = _.random(0, chipBox.width + 1);
            const yDest = _.random(0, chipBox.height + 1);
            chipBox.addChild(cloneChip);

            cloneChip.runAction(this.moveChipTo(cc.v2(xDest, yDest)));
        });
    }

    public placeChipBet(bet: number, destNode: cc.Node, startNode: cc.Node = null) {
        var chipPosition: cc.Vec2;
        var isLoginUserPlaceBet = startNode == null;

        if (startNode) {
            chipPosition = startNode.parent.convertToWorldSpaceAR(startNode.position);
        }
        else {
            var chip = this.chips.children.filter(child => child.name === bet.toString())[0];
            chipPosition = chip.parent.convertToWorldSpaceAR(chip.position);
        }

        chipPosition = destNode.convertToNodeSpaceAR(chipPosition);
        var chipNode = this.createChip(chipPosition, bet);

        const xDest = _.random(0, destNode.width + 1);
        const yDest = _.random(0, destNode.height + 1);

        destNode.addChild(chipNode.node);
        isLoginUserPlaceBet && this.playSingleChipsSound();
        chipNode.node.runAction(
            this.moveChipTo(cc.v2(xDest, yDest), isLoginUserPlaceBet ? this.loginUserChipFlyingTime : this.chipFlyingTime));
    }

    public initChips(chipsData: any, chipsBox: cc.Node) {
        var chipBets = Object.keys(chipsData);

        _.forEach(chipBets, (chipBet) => {
            var chipCountOfBet = chipsData[chipBet];
            for (var i = 0; i < chipCountOfBet; i++) {
                const xDest = _.random(0, chipsBox.width + 1);
                const yDest = _.random(0, chipsBox.height + 1);
                var chip = this.createChip(new cc.Vec2(xDest, yDest), chipBet);
                chipsBox.addChild(chip.node);
            }
        })
    }

    public playMultiChipsSound() {
        cc.RedT.isSoundGame() && this.multiChipAudio.play();
    }

    public playSingleChipsSound() {
        cc.RedT.isSoundGame() && this.singleChipAudio.play();
    }

    private startMoveChip(chip: cc.Node, destBoxInChipBoxSpacePosition: cc.Vec2, hideOnDestBox: boolean) {
        if (hideOnDestBox) {
            chip.runAction(cc.spawn(
                this.moveChipTo(destBoxInChipBoxSpacePosition),
                cc.fadeTo(this.chipFlyingTime * 3, 0)));
        }
        else {
            chip.runAction(this.moveChipTo(destBoxInChipBoxSpacePosition));
        }

        setTimeout(() => this.destroyChip(chip), this.chipFlyingTime);
    }

    private moveChipTo(position: cc.Vec2, time: number = this.chipFlyingTime): cc.ActionInterval {
        return cc.moveTo(time, position).easing(cc.easeSineOut());
    }

    private createChip(position: cc.Vec2, bet): cc.Sprite {
        var chip = new cc.Node();
        var chipSprite = chip.addComponent(cc.Sprite);
        chipSprite.spriteFrame = this['chip' + bet];
        chipSprite.node.position = position;
        return chipSprite;
    }

    private destroyChip(chip: cc.Node) {
        setTimeout(() => {
            chip.destroy();
        }, this.chipFlyingTime * 1000);
    }

    private updateSelectedBet(targetName: string) {
        this.chips.children.map((chip) => {
            if (chip.name == targetName) {
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
