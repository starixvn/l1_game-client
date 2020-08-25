import * as _ from "lodash";
const { ccclass, property } = cc._decorator;

export enum LuckyWheelColor {
    Yelllow = "yellow",
    Green = "green",
    Red = "red",
    Black = "black",
    Orange = "orange",
    Blue = "blue"
}

@ccclass
export default class LuckyWheel extends cc.Component {

    @property(cc.Node)
    wheel: cc.Node = null;

    @property(cc.Node)
    indicator: cc.Node = null;

    @property(cc.Button)
    button: cc.Button = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Label)
    availSpinsLbl: cc.Label = null;

    @property(cc.Label)
    totalScoinLbl: cc.Label = null;

    @property(cc.Node)
    wheelPieces: cc.Node = null;

    @property(cc.Node)
    piece: cc.Node = null;

    @property(cc.SpriteFrame)
    blackPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    yellowPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    orangePiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    greenPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    redPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    bluePiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    defaultPiece: cc.SpriteFrame = null;

    //scoinPresents: any[] = [10, 1, 2, 5, 3, 20, 0, 10, 1, 2, 5, 3, 20, 0, 10, 1, 2, 5, 3, 20, 0, 10, 1, 2, 5, 3, 20, 0, 10, 1];
    scoinPresents: number[] = [];
    defaultAngle: number = 12;
    gameTime: number = 6;
    currentRotation: number = 0;
    lastRotation: number = 0;
    progress: number = 0;
    ratioWheel: number = 0;

    availSpins: number = 0;
    totalScoin: number = 0;

    timeTween: cc.Tween;
    indicatorTween: cc.Tween;

    private dataObserverKey = "LuckyWheel";

    colorDictionary = {
        0: LuckyWheelColor.Black,
        1: LuckyWheelColor.Orange,
        2: LuckyWheelColor.Yelllow,
        5: LuckyWheelColor.Green,
        10: LuckyWheelColor.Red,
        20: LuckyWheelColor.Blue
    }

    onLoad() {
        this.addDataObserver();
    }

    addDataObserver() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    }

    onDestroy() {
        this.removeDataObserver();
    }

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
    }

    receivedData(data) {
        if (data['luckyWheel']) {
            this.onData(data['luckyWheel']);
        }
    }

    get_data() {
        cc.RedT.send({ g: { ['luckyWheel']: { playSpin: true } } });
    }

    onData(data: any) {
        if (data.coins) {
            this.spin(data.coins);
        }
    }

    shakeIndicator() {
        this.progress = 0;

        this.timeTween?.stop();
        this.indicatorTween?.stop();

        this.timeTween = cc.tween(this).to(0.26, { progress: 0.26 }).start();
        this.indicatorTween = cc.tween(this.indicator)
            .to(0.13, { angle: -10 }, {
                easing: t => {
                    return this.customizeBezierAnimation(t);
                }
            })
            .to(0.13, { angle: 3 }, {
                easing: t => {
                    return this.customizeBezierAnimation(t);
                }
            })
            .start();
    }

    updateData(availSpins, totalCoins) {
        this.availSpins = availSpins;
        this.totalScoin = totalCoins;
        this.availSpinsLbl.string = availSpins.toString();
        this.totalScoinLbl.string = `${totalCoins}$`;
    }

    initWheel(choices) {
        choices.forEach(coin => {
            this.scoinPresents.push(coin);
        })

        this.createWheel();
    }

    onPressedSpin() {
        this.get_data();
    }

    spin(coin: number) {
        this.button.interactable = false;

        const indexList = [];
        this.scoinPresents.forEach((value, index) => value === coin && indexList.push(index));// this.find(this.scoinPresents, coin);
        console.log(indexList);
        const resultIndex = indexList[_.random(indexList.length - 1, 0)];
        this.resultLabel.string = coin.toString();

        let randomPosition = _.random(-3, 3);
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        const rotateResult = (resultIndex * this.defaultAngle) + (8 * 360) + offsetAngleResult - randomPosition;

        this.shakeIndicator();
        cc.tween(this.wheel)
            .by(this.gameTime, { angle: rotateResult }, {
                progress: (start, end, current, ratio) => {
                    this.ratioWheel = ratio;
                    this.currentRotation = this.wheel.angle;
                    const tolerance = this.currentRotation - this.lastRotation;
                    const temp = Math.round(this.currentRotation) % (360 / this.scoinPresents.length);
                    if (temp <= tolerance) {
                        if (this.progress > 0.2) {
                            this.shakeIndicator();
                        }
                    }
                    this.lastRotation = this.currentRotation;
                    return start + (end - start) * ratio;
                },
                easing: t => {
                    return this.customizeBezierAnimation(t);
                },
            })
            .call(() => {
                this.button.interactable = true;

                this.totalScoin += coin;
                this.availSpins -= 1;
                this.updateData(this.availSpins, this.totalScoin);
                // if (this.availSpins == 0) {
                //     this.node.active = false;
                // }
            })
            .start();
    }

    customizeBezierAnimation(time) {
        const point1 = 0, point2 = 0.69, point3 = 0.99999999, point4 = 1;
        return (Math.pow(1 - time, 3) * point1 + 3 * time * (Math.pow(1 - time, 2)) * point2 + 3 * Math.pow(time, 2) * (1 - time) * point3 + Math.pow(time, 3) * point4);
    }

    createWheel() {
        this.scoinPresents.forEach((scoin, index) => {
            const pieceNode = cc.instantiate(this.piece);
            const spriteComponent = pieceNode.getComponent(cc.Sprite);
            const angle = index == 0 ? 0 : index * this.defaultAngle + 0.2;
            pieceNode.active = true;
            pieceNode.angle = -angle;

            const color = _.get(this.colorDictionary, scoin);
            let sprite: cc.SpriteFrame = null;

            switch (color) {
                case LuckyWheelColor.Black:
                    sprite = this.blackPiece;
                    break;
                case LuckyWheelColor.Blue:
                    sprite = this.bluePiece;
                    break;
                case LuckyWheelColor.Yelllow:
                    sprite = this.yellowPiece;
                    break;
                case LuckyWheelColor.Orange:
                    sprite = this.orangePiece;
                    break;
                case LuckyWheelColor.Green:
                    sprite = this.greenPiece;
                    break;
                case LuckyWheelColor.Red:
                    sprite = this.redPiece;
                    break;
                default:
                    sprite = this.defaultPiece;
                    break;
            }
            spriteComponent.spriteFrame = sprite;

            pieceNode.getChildByName("scoin").getComponent(cc.Label).string = scoin == 0 ? "CHÚC MAY MẮN" : `${scoin}$`;

            this.wheelPieces.addChild(pieceNode);
        })
    }

    showLuckyWheel() {
        cc.RedT.audio.playClick();

        const dialog = this.node.getComponent("CommonDialog");
        dialog.showDialog();
    }
}
