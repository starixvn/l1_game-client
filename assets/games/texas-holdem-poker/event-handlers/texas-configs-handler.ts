import TexasConfigsModel from "../event-models/texas-configs-model";
import TexasEventHandler from "./texas-event-handler";

export type ConfigsType<Choices> = {
    gameConfigs: {
        maxBet: number;
        minBet: number;
        odds: Choices;
        maxBetPerChoices: Choices;
        chips: any;
    };
};

export default class TexasConfigsHandler<Choices> extends TexasEventHandler<ConfigsType<Choices>, Choices> {
    protected verifyEvent(event: ConfigsType<Choices>) {
        return event.gameConfigs != null;
    }

    protected handle(event: ConfigsType<Choices>) {
        const configs = this.transformToGameConfigs(event);
        this.gameData.configs.change(configs);
    }

    private transformToGameConfigs(event: ConfigsType<Choices>): TexasConfigsModel {
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
