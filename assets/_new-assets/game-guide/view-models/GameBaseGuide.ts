const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBaseGuide extends cc.Component {
    @property
    gameName: string = "";

    @property({ type: cc.Label })
    oddLabels: cc.Label[] = [];

    onLoad() {
        this.getOdds();
        this.gameName !== "" && cc.RedT.addDataObserver(`${this.gameName}_guide`, (data) => this.receivedData(data));
    }

    onDestroy() {
        this.gameName !== "" && cc.RedT.removeDataObserver(`${this.gameName}_guide`);
    }

    getOdds() {

    }

    receivedData(data) {
        const dataGame = data[this.gameName] || (data.mini && data.mini[this.gameName]);
        if (dataGame) {
            this.onData(dataGame);
        }
    }

    onData(data) {

    }

    updateOddLabels(odds) {
        odds.forEach((odd, index) => {
            this.oddLabels[index].string = odd;
        });
    }

    clearAllOddLabels() {
        this.oddLabels.forEach(label => label.string = '')
    }

    closeGuide() {
        this.node.active = false;
        this.node.destroy();
    }
}
