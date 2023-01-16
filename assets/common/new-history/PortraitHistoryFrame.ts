import HistoryFrame from "./HistoryFrame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PortraitHistoryFrame extends HistoryFrame {
    updateSizeFrame(widthContent: number, heightContent: number, autoScaleNodeWidth: number) {
        super.updateSizeFrame(widthContent, heightContent, autoScaleNodeWidth);

        this.backWrapper.height = this.mainFrame.children[0].height;
    }
}
