import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import MiniSedie from "../MiniSedie";

export default class MiniSedieLogsHandler extends GameBaseLogsHandler {

    constructor(protected readonly main: MiniSedie) {
        super(main);
    }

    buildLogs(dataLogs) {
        const redData = dataLogs.map(d => {
            let count = 0;
            const list = ["red1", "red2", "red3", "red4"];
            list.forEach(i => {
                if (d.result[i]) {
                    count++;
                }
            });
            return count;
        });
        this.main.roundHistory.setData(redData);
        this.main.miniRoundHistory.setData(redData);
    }
}