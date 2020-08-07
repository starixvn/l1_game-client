const { ccclass, property } = cc._decorator;
import * as _ from 'lodash';
import SnappedScrollView from './SnappedScrollView';
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

    @property(cc.SpriteAtlas)
    chipAltas: cc.SpriteAtlas = null;

    @property()
    defaultChip = "1";

    @property(SnappedScrollView)
    snappedScrollView: SnappedScrollView = null;

    @property(cc.Node)
    leftButton: cc.Node = null;

    @property(cc.Node)
    rightButton: cc.Node = null;

    @property
    displaySize = 6;

    @property
    movingStep = 1;

    public onChanged: OnChangedBet = (bet) => { };
    public readonly chipFlyingTime: number = 0.8;
    public readonly loginUserChipFlyingTime: number = 0.5;
    public readonly chipDelayFlyingTime: number = 1.25;
    private selectedIndex = 0;
    private chipList: cc.Node[] = [];

    onLoad() {
        this.leftButton.active = false;
        this.chipList = [...this.chips.children];
        this.snappedScrollView.onScrollEnded = () => {
            var min = this.snappedScrollView.getMinDisplayIndex();
            if (this.selectedIndex < min) {
                this.selectedIndex = min;
            } else if (this.selectedIndex > min + this.displaySize - 1) {
                this.selectedIndex = min + this.displaySize - 1;
            }
            this.updateArrowVisibility();

            var item = this.chipList[this.selectedIndex].name;
            this.setCurrentBet(item);
        };
    }

    onEnable() {
        this.selectedIndex = 0;
        this.snappedScrollView.scrollTo(0);
        this.scrollToSelectedIndex();
    }

    public init(onChanged: OnChangedBet) {
        this.onChanged = onChanged;
        this.setCurrentBet(this.defaultChip);
    }

    public onPrevious() {
        cc.RedT.audio.playClick();
        this.selectedIndex -= this.movingStep;
        this.scrollToSelectedIndex();
    }

    public onNext() {
        cc.RedT.audio.playClick();
        this.selectedIndex += this.movingStep;
        this.scrollToSelectedIndex();
    }

    private updateArrowVisibility() {
        this.leftButton.active = true;
        this.rightButton.active = true;
        if (this.selectedIndex <= 0) {
            this.selectedIndex = 0;
            this.leftButton.active = false;
        } else if (this.selectedIndex >= this.chipList.length - 1) {
            this.selectedIndex = this.chipList.length - 1;
            this.rightButton.active = false;
        }
    }

    private scrollToSelectedIndex() {
        this.updateArrowVisibility();

        var min = this.snappedScrollView.getMinDisplayIndex();
        if (this.selectedIndex <= min && min > 0) {
            this.snappedScrollView.scrollTo(min - 1);
        }
        if (this.selectedIndex >= min + this.displaySize - 1) {
            this.snappedScrollView.scrollTo(min + 1);
        }
        var item = this.chipList[this.selectedIndex].name;
        this.setCurrentBet(item);
    }

    public onClickBet(event) {
        var bet = event.target.name;
        this.betChipClickAudio.play();
        var i = 0;
        for (; i < this.chipList.length; i++) {
            if (this.chipList[i].name == bet) {
                break;
            }
        }
        this.selectedIndex = i;
        this.scrollToSelectedIndex();
    }

    public setCurrentBet(bet: string) {
        this.updateSelectedBet(bet);
        this.onChanged(bet);
    }

    public moveChips(chipsBox: cc.Node, destBox: cc.Node, hideOnDestBox: boolean = true) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var destBoxInChipBoxSpacePosition = chipsBox.convertToNodeSpaceAR(destBoxPosition);

        _.forEach(chipsBox.children, chip => {
            this.startMoveChip(chip, destBoxInChipBoxSpacePosition);
        });
    }

    public moveChipsWithRandomAmount(
        chipsBox: cc.Node,
        destBox: cc.Node,
        flyTime: number = this.chipFlyingTime,
        randomAmount: number = 3) {
        var destBoxPosition = destBox.parent.convertToWorldSpaceAR(destBox.position);
        var cloneChipsBox = cc.instantiate(chipsBox);
        cloneChipsBox.destroyAllChildren();
        chipsBox.parent.addChild(cloneChipsBox);

        var destBoxInChipBoxSpacePosition = cloneChipsBox.convertToNodeSpaceAR(destBoxPosition);
        var chipsCount = _.round(_.random(1, randomAmount));

        for (var i = 0; i < chipsCount; i++) {
            var chip = chipsBox.children[i];

            if (chip) {
                var cloneChip = cc.instantiate(chip);
                cloneChipsBox.addChild(cloneChip);
                // chip.destroy();
                this.startMoveChip(cloneChip, destBoxInChipBoxSpacePosition, flyTime);
            }
        }

        this.node.runAction(cc.sequence(
            cc.delayTime(flyTime * 1.5),
            cc.callFunc(() => cloneChipsBox.destroy())
        ));
    }

    public payChipsToWinningBetItem(chipBox: cc.Node, dealerBox: cc.Node) {
        var dealerBoxPosition = dealerBox.parent.convertToWorldSpaceAR(dealerBox.position);
        var dealerBoxInChipBoxSpacePosition = chipBox.convertToNodeSpaceAR(dealerBoxPosition);
        chipBox.children.length > 0 && this.playMultiChipsSound();

        _.forEach(chipBox.children, chip => {
            var cloneChip = cc.instantiate(chip);
            cloneChip.position = dealerBoxInChipBoxSpacePosition;
            chipBox.addChild(cloneChip);
            var randomPosition = this.getRandomPositionChip(cloneChip, chipBox);
            cloneChip.runAction(this.moveChipTo(randomPosition));
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

        var randomPosition = this.getRandomPositionChip(chipNode.node, destNode);
        destNode.addChild(chipNode.node);

        if (isLoginUserPlaceBet) {
            this.playSingleChipsSound();
        }

        chipNode.node.runAction(
            this.moveChipTo(randomPosition, isLoginUserPlaceBet ? this.loginUserChipFlyingTime : this.chipFlyingTime));
    }

    public placeChipBetRoulette(bet: number, destNode: cc.Node, startNode: cc.Node = null, onComplete = () => { }, delayDestroy = 0, customDuration = 0) {
        var chipPosition: cc.Vec2;
        var isLoginUserPlaceBet = startNode == null;
        if (startNode) {
            chipPosition = startNode.parent.convertToWorldSpaceAR(startNode.position);
        }
        else {
            let chip = this.chips.children.filter(child => child.name === bet.toString())[0];
            if (!chip) {
                const chips = this.chips.children.filter(child => +child.name < bet).sort((b, a) => +a.name - +b.name);
                chip = chips[0];
                bet = +chip.name;
            }
            chipPosition = chip.parent.convertToWorldSpaceAR(chip.position);
        }

        chipPosition = destNode.convertToNodeSpaceAR(chipPosition);
        var chipNode = this.createChip(chipPosition, bet);

        destNode.addChild(chipNode.node);

        if (isLoginUserPlaceBet) {
            this.playSingleChipsSound();
        }

        const duration = customDuration > 0 ? customDuration : (isLoginUserPlaceBet ? this.loginUserChipFlyingTime : this.chipFlyingTime);

        chipNode.node.runAction(
            cc.sequence(
                this.moveChipTo(cc.v2(0, 0), duration),
                cc.delayTime(delayDestroy),
                cc.callFunc(() => {
                    chipNode.destroy();
                    onComplete();
                })
            )
        );
    }

    public initChips(chipsData: any, chipsBox: cc.Node) {
        if (!chipsData) {
            return;
        }

        var chipBets = Object.keys(chipsData);

        _.forEach(chipBets, (chipBet) => {
            var chipCountOfBet = chipsData[chipBet];
            for (var i = 0; i < chipCountOfBet; i++) {

                var chip = this.createChip(cc.v2(0, 0), chipBet);
                var randomPosition = this.getRandomPositionChip(chip.node, chipsBox);
                chip.node.position = randomPosition;
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

    private startMoveChip(chip: cc.Node, destBoxInChipBoxSpacePosition: cc.Vec2, flyTime: number = this.chipFlyingTime) {
        chip.runAction(this.moveChipTo(destBoxInChipBoxSpacePosition, flyTime));
        this.destroyChip(chip, flyTime);
    }

    private moveChipTo(position: cc.Vec2, time: number = this.chipFlyingTime): cc.ActionInterval {
        return cc.moveTo(time, position).easing(cc.easeSineOut());
    }

    private getRandomPositionChip(chip: cc.Node, box: cc.Node): cc.Vec2 {
        const xDest = _.random(Math.floor(chip.width / 4), Math.floor(box.width - chip.width / 2) + 1);
        const yDest = _.random(Math.floor(chip.height / 4), Math.floor(box.height - chip.height / 2) + 1);
        return cc.v2(xDest, yDest);
    }

    private createChip(position: cc.Vec2, bet): cc.Sprite {
        var chip = new cc.Node();
        var chipSprite = chip.addComponent(cc.Sprite);
        var name = `chip${bet}_small`;
        chipSprite.spriteFrame = this.chipAltas.getSpriteFrame(name);
        chipSprite.node.position = position;
        return chipSprite;
    }

    private destroyChip(chip: cc.Node, delayTime: number) {
        this.node.runAction(cc.sequence(
            cc.delayTime(delayTime * 1.5),
            cc.callFunc(() => chip.destroy())
        ));
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
