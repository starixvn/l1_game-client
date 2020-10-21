import * as _ from 'lodash';
import GameUtils from '../../../common/GameUtils';

const { ccclass, property } = cc._decorator;

enum PageDirection {
    Left,
    Right
}

@ccclass
export default class GameAds extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property
    intervalChangeImage = 4;

    private dragThreshold = 0.5;
    private currentIndex = 0;
    private touchOffset = cc.v2(0, 0);
    private started = false;

    onLoad() {
        this.content.on(cc.Node.EventType.TOUCH_START, this.eventStart, this, true);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this, true);
        this.content.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this.handleReleaseTouch, this, true);
        this.currentIndex = this.content.childrenCount - 1; //show first page
    }

    start() {
        this.autoChange();
    }

    onDestroy() {
        this.unschedule(this.autoChange);
        this.content.off(cc.Node.EventType.TOUCH_START, this.eventStart, this, true);
        this.content.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this, true);
        this.content.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
        this.content.off(cc.Node.EventType.TOUCH_CANCEL, this.handleReleaseTouch, this, true);
    }

    handleReleaseTouch() {
        if (!this.started) {
            return;
        }
        this.started = false;
        const node = this.getCurrentPage();
        const delta = node.x - this.touchOffset.x;
        if (Math.abs(delta) >= this.node.width * this.dragThreshold) {
            if (delta > 0) {
                this.showPreviouPage();
            } else {
                this.showNextPage();
            }
        } else {
            this.moveToCenter(node, .3);
        }
    }

    eventEnd(e) {
        this.handleReleaseTouch();
        const delta = e.touch.getLocationX() - this.touchOffset.x;
        if (Math.abs(delta) > 10) {
            e.stopPropagation();
        }
    }

    eventMove(e) {
        if (!this.started) {
            return;
        }
        const delta = e.touch.getLocationX() - this.touchOffset.x;
        if (Math.abs(delta) >= this.node.width * this.dragThreshold) {
            if (delta > 0) {
                this.showPreviouPage();
            } else {
                this.showNextPage();
            }
        } else {
            const node = this.getCurrentPage();
            node.position = cc.v2(
                e.touch.getLocationX() - this.touchOffset.x,
                node.position.y
            );
        }
    }

    eventStart(e) {
        this.started = true;
        const node = this.getCurrentPage();
        this.touchOffset = cc.v2(
            e.touch.getLocationX() - node.position.x,
            node.position.y
        );
    }

    getCurrentPage(): cc.Node {
        return this.content.children[this.currentIndex];
    }

    autoChange() {
        this.showNextPage();
    }

    showNextPage() {
        const oldNode = this.getCurrentPage();
        this.currentIndex++;
        if (this.currentIndex >= this.content.childrenCount) {
            this.currentIndex = 0;
        }

        this.showPage(oldNode, this.currentIndex, PageDirection.Right);
    }

    showPreviouPage() {
        const oldPage = this.getCurrentPage();
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.content.childrenCount - 1;
        }

        this.showPage(oldPage, this.currentIndex, PageDirection.Left);
    }

    showPage(oldNode: cc.Node, index: number, pageDirection: PageDirection = PageDirection.Right) {
        this.unschedule(this.autoChange);
        this.started = false;

        const direction = pageDirection == PageDirection.Right ? 1 : -1;
        const distance = this.node.width * 1.3;

        oldNode.runAction(cc.sequence(
            cc.moveBy(0.3, cc.v2(-direction * distance, 0)),
            cc.callFunc(() => {
                oldNode.active = false;
            })
        ))
        const currentNode = this.content.children[index];
        currentNode.active = true;
        currentNode.position = cc.v2(direction * distance, currentNode.position.y);
        this.moveToCenter(currentNode, 0.6);
    }

    moveToCenter(node: cc.Node, duration: number) {
        node.stopAllActions();
        const move = cc.moveTo(0.6, cc.v2(0, 0));
        move.easing = cc.easeCubicActionInOut();
        node.runAction(cc.sequence(
            move,
            cc.callFunc(() => {
                this.scheduleOnce(this.autoChange, this.intervalChangeImage);
            })));
    }

    openGame(e, gameId) {
        cc.RedT.audio.playClick();
        GameUtils.openGame(+gameId, cc.RedT.MiniPanel);
    }
}
