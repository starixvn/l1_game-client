import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import LobbyMenuConfig from "../../../lobby/main/view-models/LobbyMenuConfig";
import { appManager } from "../../../managers/AppManager";
import { uiManager } from "../../../managers/GameUIManager";
import { InternalEvents } from "../../../managers/InternalEvents";
import JackpotWinner from "../JackpotWinner";
import RoundTimerManager from "../RoundTimerManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PopupMinigames extends cc.Component {
    @property(cc.Node)
    list: cc.Node = null;
    @property(cc.Node)
    panel: cc.Node = null;
    @property(cc.Node)
    menuIcon: cc.Node = null;

    @property(cc.Node)
    jackPotContainer: cc.Node = null;

    @property(cc.Prefab)
    jackpotWinnerPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundTimer: cc.Node = null;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    private ttOffset = cc.v2(0, 0);
    private ttOffset2 = cc.v2(0, 0);
    private toggleRuning = false;
    public background: cc.Node = null;

    onLoad() {
        if (appManager.popupMiniGamesLastPosition) {
            this.node.position = appManager.popupMiniGamesLastPosition;
        }

        this.list.active = false;
        this.list.scale = 0;

        // init jackpot winner icon
        const jackpot = cc.instantiate(this.jackpotWinnerPrefab);
        const jackpotWinner = jackpot.getComponent(JackpotWinner);
        jackpotWinner.popupMiniGame = this;
        this.jackPotContainer.addChild(jackpot);
        this.jackPotContainer.active = false;
        RoundTimerManager.getInstance().initEvents();
        this.initDefaultGameRoundTimer();
    }

    async initDefaultGameRoundTimer() {
        const prefab = await GameUtils.loadMiniGameIcon(this.lobbyMenuConfig.roundTimerGame.main);
        const node = cc.instantiate(prefab);
        this.roundTimer.addChild(node);
        node.getChildByName("icon-game").active = false;
        RoundTimerManager.getInstance().requestAllGamesRoundTimer();
    }

    onDestroy() {
        this.unschedule(this.moveToEdge);
        RoundTimerManager.getInstance().removeEvents();
    }
    onEnable() {
        this.panel.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.panel.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.panel.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.panel.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        this.panel.on(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    }
    onDisable() {
        this.panel.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.panel.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.panel.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.panel.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        this.panel.off(cc.Node.EventType.MOUSE_ENTER, this.setTop, this);
    }
    eventStart(e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
        this.ttOffset2 = cc.v2(
            e.touch.getLocationX() - (e.touch.getLocationX() - this.node.position.x),
            e.touch.getLocationY() - (e.touch.getLocationY() - this.node.position.y)
        );
    }
    eventMove(e) {
        this.node.position = cc.v3(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y, 0);

        this.callMoveToEdge();
    }

    callMoveToEdge() {
        this.unschedule(this.moveToEdge);
        this.scheduleOnce(this.moveToEdge, 0.2);
    }

    getCurrentSize() {
        let listBox = this.list.getBoundingBox();

        if (!this.list.active && this.jackPotContainer.active) {
            listBox = this.jackPotContainer.getBoundingBox();
        }

        return cc.v2(Math.max(this.node.width, listBox.width), Math.max(this.node.height, listBox.height));
    }
    moveToEdge() {
        const width = this.node.parent.width;
        const height = this.node.parent.height;
        const fixTopPadding = 100;
        const size = this.getCurrentSize();
        const maxX = width / 2 - size.x / 2;
        const maxY = height / 2 - size.y / 2;
        const deltaWidth = maxX - Math.abs(this.node.x);
        const deltaHeight = maxY - Math.abs(this.node.y);

        let posX, posY;
        if (deltaWidth < deltaHeight) {
            posY = this.node.y;
            posY = Math.min(maxY, posY);
            posY = Math.max(-maxY, posY);
            posX = this.node.x < 0 ? -maxX : maxX;
        } else {
            posX = this.node.x;
            posX = Math.min(maxX, posX);
            posX = Math.max(-maxX, posX);
            posY = this.node.y < 0 ? -maxY : maxY;
        }

        posY = Math.min(maxY - fixTopPadding, posY);

        cc.tween(this.node).to(0.1, { x: posX, y: posY }, { easing: "sineOut" }).start();
        appManager.popupMiniGamesLastPosition = cc.v3(posX, posY);
    }

    eventEnd(e) {
        this.moveToEdge();
        const xChanger = this.ttOffset2.x - (e.touch.getLocationX() - this.ttOffset.x);
        const yChanger = this.ttOffset2.y - (e.touch.getLocationY() - this.ttOffset.y);
        if (xChanger < 5 && xChanger > -5 && yChanger < 5 && yChanger > -5) {
            this.toggle();
            this.callMoveToEdge();
        }
    }

    toggle() {
        AudioManager.getInstance().playClick();
        if (!this.toggleRuning) {
            this.toggleRuning = true;
            const menuAnimation = this.menuIcon.getComponent(cc.Animation);

            if (this.list.scale !== 0) {
                this.hideListGame();
                menuAnimation.play();
            } else {
                this.showListGame();
                menuAnimation.stop();
                this.menuIcon.getChildByName("icon").angle = 0;
            }
        }
    }
    showListGame() {
        this.background.active = true;
        cc.tween(this.background).to(0.1, { opacity: 224 }).start();
        this.list.scale = 1;

        cc.tween(this.node)
            .to(0.2, { scale: 0, opacity: 0 }, { easing: "sineOut" })
            .call(() => {
                this.list.active = true;
                cc.tween(this.menuIcon).to(0.2, { scale: 0.8 }, { easing: "sineOut" }).start();
            })
            .to(0.3, { scale: 1, opacity: 255 }, { easing: "sineIn" })
            .call(() => {
                this.toggleRuning = false;
                this.roundTimer.active = false;
                RoundTimerManager.getInstance().requestAllGamesRoundTimer();
            })
            .start();
    }

    hideListGame() {
        cc.tween(this.node)
            .to(0.2, { scale: 0, opacity: 0 }, { easing: "sineIn" })
            .call(() => {
                this.background.active = false;
                this.toggleRuning = false;
                this.list.active = false;
                this.list.scale = 0;
            })
            .to(0.2, { scale: 1, opacity: 255 }, { easing: "sineOut" })
            .call(() => {
                cc.tween(this.menuIcon).to(0.2, { scale: 0.9 }, { easing: "sineOut" }).start();
                uiManager.emitter.emit(InternalEvents.HIDE_POPUP_MINI_GAMES);
                this.roundTimer.active = true;
                RoundTimerManager.getInstance().requestAllGamesRoundTimer();
            })
            .start();

        this.callMoveToEdge();
    }

    setTop() {
        this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
    }
}
