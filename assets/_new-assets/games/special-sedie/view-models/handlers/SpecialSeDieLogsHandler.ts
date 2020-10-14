import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import SpecialSeDie from "../SpecialSeDie";

export default class SpecialSeDieLogsHandler extends GameBaseLogsHandler {
  constructor(protected readonly main: SpecialSeDie) {
    super(main);
  }

  buildLogs(dataLogs) {
    this.main.updateRoundHistory();
    this.main.highlightLastResult();
  }
}
