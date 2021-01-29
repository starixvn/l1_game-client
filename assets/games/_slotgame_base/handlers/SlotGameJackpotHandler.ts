import DataHandler from "../../_base/handlers/DataHandler";
import SlotGameBase from "../SlotGameBase";

export default class SlotGameJackpotHandler implements DataHandler {
  constructor(protected readonly main: SlotGameBase) {}

  handle(data: any): boolean {
    if (data.jackpotPool) {
      this.main.updatePoolData(data.jackpotPool);
    }

    if (data.jackpotPools) {
      data.jackpotPools.forEach((pool: any) => this.main.updatePoolData(pool));
    }

    return true;
  }
}
