import GameUtils from "../../../common/GameUtils";
import BannerItem from "./BannerItem";

const { ccclass, property } = cc._decorator;

enum PageDirection {
    Left,
    Right
}

@ccclass
export default class BannerController extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property
    intervalChangeImage = 4;

    protected dragThreshold = 0.25;
    private currentIndex = 0;
    private touchOffset = cc.v2(0, 0);
    private started = false;

    public menuLoop = false;
    public onEndingRound = () => {};

    onLoad() {
        this.enableTouch();
        // this.content.children.forEach((child) => {
        //     child.active = false;
        // });
    }

    enableTouch() {
        if (cc.sys.isMobile) {
            this.content.on(cc.Node.EventType.TOUCH_START, this.eventStart, this, true);
            this.content.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this, true);
            this.content.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
            this.content.on(cc.Node.EventType.TOUCH_CANCEL, this.handleReleaseTouch, this, true);
        } else {
            this.content.on(cc.Node.EventType.MOUSE_DOWN, this.eventStart, this, true);
            this.content.on(cc.Node.EventType.MOUSE_MOVE, this.eventMove, this, true);
            this.content.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
            this.content.on(cc.Node.EventType.MOUSE_LEAVE, this.handleReleaseTouch, this, true);
        }
    }

    onEnable() {
        this.started = false;
    }

    showFirstPage() {
        this.currentIndex = -1; //show first page
        this.showNextPage();
    }

    showLastPage() {
        this.currentIndex = this.content.childrenCount;
        this.showPreviouPage();
    }

    onDisable() {
        this.unschedule(this.autoChange);

        const distance = this.node.width * 1.3;
        this.content.children.forEach((child) => {
            child.active = false;
            child.position = cc.v2(distance, 0);
            child.stopAllActions();
        });
    }

    onDestroy() {
        this.unschedule(this.autoChange);
        if (cc.sys.isMobile) {
            this.content.off(cc.Node.EventType.TOUCH_START, this.eventStart, this, true);
            this.content.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this, true);
            this.content.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
            this.content.off(cc.Node.EventType.TOUCH_CANCEL, this.handleReleaseTouch, this, true);
        } else {
            this.content.off(cc.Node.EventType.MOUSE_DOWN, this.eventStart, this, true);
            this.content.off(cc.Node.EventType.MOUSE_MOVE, this.eventMove, this, true);
            this.content.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this, true);
            this.content.off(cc.Node.EventType.MOUSE_LEAVE, this.handleReleaseTouch, this, true);
        }
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
            this.unschedule(this.autoChange);
            this.moveToCenter(node, 0.3);
        }
    }

    eventEnd(e) {
        this.handleReleaseTouch();
        const location = e.getLocation();
        const delta = location.x - this.touchOffset.x;
        if (Math.abs(delta) > 10) {
            e.stopPropagation();
        }
    }

    eventMove(e) {
        if (!this.started) {
            return;
        }

        const location = e.getLocation();
        const delta = location.x - this.touchOffset.x;
        if (Math.abs(delta) >= this.node.width * this.dragThreshold) {
            if (delta > 0) {
                this.showPreviouPage();
            } else {
                this.showNextPage();
            }
        } else {
            const node = this.getCurrentPage();
            node.position = cc.v2(delta, node.position.y);
        }
    }

    eventStart(e) {
        this.started = true;
        const node = this.getCurrentPage();
        this.touchOffset = cc.v2(e.getLocation().x - node.position.x, node.position.y);
    }

    getCurrentPage(): cc.Node {
        return this.content.children[this.currentIndex];
    }

    autoChange() {
        this.showNextPage();
    }

    showNextPage() {
        this.unschedule(this.autoChange);

        const oldPage = this.getCurrentPage();
        this.currentIndex++;
        if (this.currentIndex >= this.content.childrenCount) {
            if (!this.menuLoop) {
                this.currentIndex = this.content.childrenCount - 1;
                this.onEndingRound();
                return;
            } else {
                this.currentIndex = 0;
            }
        }

        this.showPage(oldPage, this.currentIndex, PageDirection.Right);
    }

    showPreviouPage() {
        this.unschedule(this.autoChange);

        const oldPage = this.getCurrentPage();
        this.currentIndex--;
        if (this.currentIndex < 0) {
            if (!this.menuLoop) {
                this.currentIndex = 0;
                this.onEndingRound();
                return;
            } else {
                this.currentIndex = this.content.childrenCount - 1;
            }
        }

        this.showPage(oldPage, this.currentIndex, PageDirection.Left);
    }

    showPage(oldNode: cc.Node, index: number, pageDirection: PageDirection = PageDirection.Right) {
        this.started = false;

        const direction = pageDirection === PageDirection.Right ? 1 : -1;
        const distance = this.node.width * 1.3;

        if (oldNode) {
            oldNode.stopAllActions();
            cc.tween(oldNode)
                .to(0.3, { position: cc.v2(-direction * distance, 0) })
                .call(() => {
                    oldNode.active = false;
                })
                .start();
        }

        const currentNode = this.content.children[index];
        currentNode.active = true;
        currentNode.position = cc.v2(direction * distance, currentNode.position.y);

        this.intervalChangeImage = currentNode.getComponent(BannerItem).displayTime;
        this.moveToCenter(currentNode, 0.6);
    }

    moveToCenter(node: cc.Node, duration: number) {
        node.stopAllActions();
        cc.tween(node)
            .to(duration, { position: cc.v2(0, 0) }, { easing: "cubicInOut" })
            .call(() => {
                this.scheduleOnce(this.autoChange, this.intervalChangeImage);
            })
            .start();
    }

    openGame(e, gameId) {
        cc.RedT.audio.playClick();
        GameUtils.openGame(+gameId, cc.RedT.MiniPanel);
    }
}
