import * as _ from "lodash";

import UmWarning from "../../../common/um-warning/UmWarning";
import LuckyWheelWinning from "./LuckyWheelWinning";

const { ccclass, property } = cc._decorator;

export enum LuckyWheelColor {
    Yellow = "yellow",
    Green = "green",
    Red = "red",
    Purple = "purple",
    Orange = "orange",
    Blue = "blue",
    Pink = "Pink"
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
    availSpinsLbl: cc.Label = null;

    @property(cc.Label)
    totalScoinLbl: cc.Label = null;

    @property(cc.Node)
    wheelPieces: cc.Node = null;

    @property(cc.Node)
    piece: cc.Node = null;

    @property(cc.SpriteFrame)
    pinkPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    yellowPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    orangePiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    greenPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    redPiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    purplePiece: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    defaultPiece: cc.SpriteFrame = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    gamGuidePrefab: cc.Prefab = null;

    @property(cc.Node)
    winningEffect: cc.Node = null;

    @property(cc.Prefab)
    winningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    goodLuckPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bannerPrefab: cc.Prefab = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    scoinPresents: number[] = [];
    defaultAngle: number = 12;
    gameTime: number = 6;
    currentRotation: number = 0;
    lastRotation: number = 0;
    progress: number = 0;
    ratioWheel: number = 0;

    timeTween: cc.Tween;
    indicatorTween: cc.Tween;
    currentScoin: number = 0;

    goodLuckMessage: string = "CHÚC MAY MẮN";

    private dataObserverKey = "LuckyWheel";

    colorDictionary = {
        0: LuckyWheelColor.Purple,
        2: LuckyWheelColor.Yellow,
        5: LuckyWheelColor.Pink,
        10: LuckyWheelColor.Green,
        15: LuckyWheelColor.Orange,
        20: LuckyWheelColor.Red
    }

    onLoad() {
        this.addDataObserver();
    }

    onEnable() {
        this.getData();
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

    playSpin() {
        cc.RedT.send({ g: { ['luckyWheel']: { playSpin: true } } });
    }

    getData() {
        cc.RedT.send({ g: { ['luckyWheel']: { getLogs: true } } });
    }

    onData(data: any) {
        if (data.choices) {
            this.initWheel(data.choices);
        }

        if (data.status) {
            this.spin(data.status);
        }

        if (data.notice) {
            this.showNotice(data.notice);
        }

        if (void 0 !== data.availSpins) {
            this.availSpinsLbl.string = data.availSpins.toString();
            this.button.interactable = data.availSpins > 0 ? true : false;
        }

        if (void 0 !== data.totalCoins) {
            this.totalScoinLbl.string = `${data.totalCoins}`;
        }

        if (data.um) {
            this.showUMWarning(data);
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

    initWheel(choices) {
        choices.forEach(coin => {
            this.scoinPresents.push(coin);
        })

        this.createWheel();
    }

    onPressedSpin() {
        this.button.interactable = false;
        this.playSpin();
    }

    spin(data) {
        this.winningEffect.active = false;
        this.availSpinsLbl.string = data.availSpins.toString();

        const indexList = [];
        this.scoinPresents.forEach((value, index) => value === data.coins && indexList.push(index));
        const resultIndex = indexList[_.random(indexList.length - 1, 0)];

        let randomPosition = _.random(-3, 3);
        let offsetAngleResult = 360 - (this.wheel.angle % 360);
        const rotateResult = (resultIndex * this.defaultAngle) + (8 * 360) + offsetAngleResult - randomPosition;

        this.shakeIndicator();
        cc.tween(this.wheel)
            .by(this.gameTime, { angle: rotateResult }, {
                progress: (start, end, current, ratio) => {
                    this.button.interactable = false;
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
                this.button.interactable = data.availSpins > 0 ? true : false;
                this.totalScoinLbl.string = `${data.totalCoins}`;
                if (data.coins === 0) {
                    this.handleGoodLuckEffect();
                } else {
                    this.handleWinningEffect(data.coins);
                    cc.RedT.send({ user: { updateCoin: true } });
                }
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
                case LuckyWheelColor.Purple:
                    sprite = this.purplePiece;
                    break;
                case LuckyWheelColor.Pink:
                    sprite = this.pinkPiece;
                    break;
                case LuckyWheelColor.Yellow:
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

            pieceNode.getChildByName("scoin").getComponent(cc.Label).string = scoin == 0 ? this.goodLuckMessage : `${scoin} Scoin`;

            this.wheelPieces.addChild(pieceNode);
        })
    }

    showLuckyWheel() {
        cc.RedT.audio.playClick();

        const dialog = this.node.getComponent("CommonDialog");
        dialog.showDialog();
    }

    closeLuckyWheel() {
        cc.RedT.audio.playClick();

        const dialog = this.node.getComponent("CommonDialog");
        dialog.closeDialog();
        this.winningEffect.active = false;
        if (cc.RedT.user.scoins) {
            const bannerNode = cc.instantiate(this.bannerPrefab);
            this.node.parent.addChild(bannerNode);
        }
    }

    onPressedHistory() {
        const history = cc.instantiate(this.historyPrefab);
        this.node.addChild(history);
    }

    onPressedGameGuide() {
        const gameGuide = cc.instantiate(this.gamGuidePrefab);
        this.node.addChild(gameGuide);
    }

    handleWinningEffect(scoin: number) {
        this.winningEffect.active = true;
        this.winningEffect.destroyAllChildren();

        const winning = cc.instantiate(this.winningPrefab);
        const component = winning.getComponent(LuckyWheelWinning);
        component.updateScoin(scoin);
        this.winningEffect.addChild(winning);
    }

    handleGoodLuckEffect() {
        this.winningEffect.active = true;
        this.winningEffect.destroyAllChildren();
        const goodLuck = cc.instantiate(this.goodLuckPrefab);
        this.winningEffect.addChild(goodLuck);
    }

    showUMWarning(data) {
        this.umNotice.show(data);
    }

    showNotice(message: string) {
        const noticeNode = cc.instantiate(this.noticePrefab);
        const notice = noticeNode.getComponent("mini_warning");
        notice.text.string = message;
        this.notice.addChild(noticeNode);
    }
}
