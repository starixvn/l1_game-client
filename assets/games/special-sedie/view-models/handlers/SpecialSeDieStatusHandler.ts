import { GameBaseStatusHandler } from "../../../_base/handlers/GameBaseStatusHandler";
import SpecialSeDie from "../SpecialSeDie";

export default class SpecialSeDieStatusHandler extends GameBaseStatusHandler {
  constructor(protected readonly main: SpecialSeDie) {
    super(main);
  }

  handle(data: any): boolean {
    if (data.status) {
      this.currentStatusData = data.status;
    }

    return true;
  }
}
