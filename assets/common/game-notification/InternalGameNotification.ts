import NotificationItem from "./NotificationItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InternalGameNotification extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property
    movingOffset = 50;

    readonly queue = [];
    readonly showDuration = 2;

    addNotification(data: any) {
        this.queue.push(data);
        this.checkShowNext();
    }

    protected displayNotification(data: any) {
        const node = cc.instantiate(this.itemPrefab);
        this.content.addChild(node);
        const item = node.getComponent(NotificationItem);
        item.setData(data);

        node.opacity = 0;
        cc.tween(node)
            .to(0.3, { opacity: 255 })
            .delay(this.showDuration)
            .to(0.1, { opacity: 0 })
            .call(() => {
                node.destroy();
                this.checkShowNext();
            })
            .start();
    }

    protected checkShowNext() {
        const validChildren = this.content.children.filter((child) => child.isValid);
        if (validChildren.length < 2) {
            this.showNext();
        }
    }

    protected showNext() {
        if (this.queue.length < 1) {
            return;
        }
        const duration = this.moveOtherItems();
        this.scheduleOnce(() => {
            const data = this.queue.shift();
            this.displayNotification(data);
        }, duration);
    }

    protected moveOtherItems() {
        const validChildren = this.content.children.filter((child) => child.isValid);
        const duration = 0.3;
        validChildren.forEach((child) => {
            cc.tween(child)
                .by(duration, { y: this.movingOffset })
                .call(() => {
                    if (child.y > 2 * this.movingOffset) {
                        child.destroy();
                    }
                })
                .start();
        });

        return validChildren.length > 0 ? duration : 0;
    }
}
