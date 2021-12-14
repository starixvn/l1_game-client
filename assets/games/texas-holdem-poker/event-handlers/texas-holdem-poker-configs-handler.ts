import { TexasHoldemPokerConfigs } from "../event-models/texas-holdem-poker-configs";
import TexasHoldemPokerHandler from "./texas-holdem-poker-event-handler";

export type ConfigsType<Choices> = {
  gameConfigs: {
    maxBet: number;
    minBet: number;
    odds: Choices;
    maxBetChoices: Choices;
  };
};

export default class TexasHoldemPokerConfigsHandler<Choices> extends TexasHoldemPokerHandler<ConfigsType<Choices>, Choices> {
  protected verifyEvent(event: ConfigsType<Choices>) {
    return event.gameConfigs != null;
  }

  protected handle(event: ConfigsType<Choices>) {
    const configs = this.transformToGameConfigs(event);
    this.gameData.configs.change(configs);
  }

  private transformToGameConfigs(event: ConfigsType<Choices>): TexasHoldemPokerConfigs {
    const { maxBet, minBet, odds, maxBetChoices } = event.gameConfigs;

    return Object.assign(
      {},
      this.gameData.configs,
      {
        maxBet,
        minBet,
        odds,
      },
      maxBetChoices && {
        maxBetChoices: { ...maxBetChoices },
      }
    );
  }
}
