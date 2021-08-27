import SlotBoard from "../../_slotgame_base/SlotBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LineView extends cc.Component {
    @property(cc.Prefab)
    linePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    lightPrefab: cc.Prefab = null;

    @property(SlotBoard)
    board: SlotBoard = null;

    @property(cc.Node)
    label: cc.Node = null;

    @property
    isLabelLeft = true;

    private light: cc.Node = null;
    private initialized = false;

    init() {
        if (this.initialized || this.board.linePositons.length === 0) {
            return;
        }
        this.initialized = true;
        const labelPos = this.label.convertToWorldSpaceAR(cc.v2(0, 0));
        const index = +this.node.name;
        const linePositions = this.board.linePositons[index - 1];
        const positions = [];
        const offset = this.label.width / 2;
        if (this.isLabelLeft) {
            positions.push(cc.v2(labelPos.x + offset, labelPos.y), ...linePositions);
        } else {
            positions.push(...linePositions, cc.v2(labelPos.x - offset, labelPos.y));
        }
        this.createLines(positions);

        this.light = cc.instantiate(this.lightPrefab);
        this.light.active = false;
    }

    onEnable() {
        this.init();
        this.playLightAnimation();
    }

    onDisable() {
        this.stopAnimationLight();
    }

    stopAnimationLight() {
        this.node.stopAllActions();
        this.light.stopAllActions();
        this.light.active = false;
    }

    runLightOnLine(index: number) {
        const child = this.node.children[index];
        const speed = 800;
        const duration = child.width / speed;

        this.light.removeFromParent();
        const mask = child.getChildByName("mask");
        mask.addChild(this.light);
        this.light.position = cc.v3(-this.light.width);

        let nextIndex = index + 1;
        if (nextIndex > this.node.children.length - 1) {
            nextIndex = 0;
        }
        cc.tween(this.light)
            .to(duration, { x: child.width })
            .call(() => {
                this.runLightOnLine(nextIndex);
            })
            .start();
    }

    playLightAnimation() {
        this.light.active = true;
        this.runLightOnLine(0);
    }

    createLines(positions: cc.Vec2[]) {
        let lastNode: cc.Node;
        for (let i = 0; i < positions.length - 1; i++) {
            const start = cc.v2(positions[i]);
            const end = cc.v2(positions[i + 1]);
            const angle = this.calculateAngle(start, end);
            const width = start.sub(end).len();
            if (lastNode !== undefined && Math.abs(lastNode.angle - angle) < 2) {
                lastNode.width += width;
                lastNode.angle = angle;
                continue;
            }

            const node = this.createSubLine();
            lastNode = node;

            node.angle = this.calculateAngle(start, end);
            node.position = cc.v3(this.node.convertToNodeSpaceAR(positions[i]));
            node.width = width;
        }
    }

    createSubLine(): cc.Node {
        const node = cc.instantiate(this.linePrefab);
        node.anchorX = 0;
        node.anchorY = 0.5;
        this.node.addChild(node);

        const mask = new cc.Node();
        mask.anchorX = 0;
        mask.name = "mask";
        const widget = mask.addComponent(cc.Widget);
        widget.isAlignLeft = true;
        widget.left = 0;
        widget.isAlignRight = true;
        widget.right = 0;
        mask.height = 100;
        mask.addComponent(cc.Mask);
        node.addChild(mask);
        return node;
    }

    calculateAngle(start: cc.Vec2, end: cc.Vec2): number {
        const dy = end.y - start.y;
        const dx = end.x - start.x;
        if (dx === 0) {
            return dy > 0 ? 90 : -90;
        }

        const rad = Math.atan(dy / dx);
        return cc.misc.radiansToDegrees(rad);
    }
}
