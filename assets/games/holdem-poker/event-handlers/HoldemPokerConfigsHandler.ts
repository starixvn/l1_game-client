import { HoldemPokerConfigs } from "../event-models/HoldemPokerConfigs";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type ConfigsType<Choices> = {
    gameConfigs: {
        maxBet: number;
        minBet: number;
        odds: Choices;
        maxBetPerChoices: Choices;
        chips: any;
    };
};

export default class HoldemPokerGameRoomConfigsHandler<Choices> extends HoldemPokerEventHandler<ConfigsType<Choices>, Choices> {
    protected verifyEvent(event: ConfigsType<Choices>) {
        return event.gameConfigs != null;
    }

    protected handle(event: ConfigsType<Choices>) {
        const configs = this.transformToGameConfigs(event);
        this.gameData.configs.change(configs);
    }

    private transformToGameConfigs(event: ConfigsType<Choices>): HoldemPokerConfigs {
        const { maxBet, minBet, odds, maxBetPerChoices, chips } = event.gameConfigs;

        return Object.assign(
            {},
            this.gameData.configs,
            {
                maxBet,
                minBet,
                odds,
                chips,
                maxBetPerChoices
            },
            maxBetPerChoices && {
                maxBetChoices: { ...maxBetPerChoices }
            }
        );
    }
}
