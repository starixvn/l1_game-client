import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import SpecialSeDie from "../SpecialSeDie";

export default class SpecialSeDieLogsHandler extends GameBaseLogsHandler {
  constructor(protected readonly main: SpecialSeDie) {
    super(main);
  }

  handle(data: any): boolean {
    if (data.roundHistory && data.roundHistory[0] && data.roundHistory[0].result) {
      this.main.setDots(data.roundHistory[0].result);
    }

    return super.handle(data);
  }

  buildLogs(dataLogs) {
    this.main.updateRoundHistory();
    this.main.highlightLastResult();
  }
}
