import logger from "./common/logger";
import LobbyMenuConfig from "./lobby/main/view-models/LobbyMenuConfig";

const sentryLogger = logger();

module.exports = {
    IS_LOGIN: false,
    GAME_IS_SHOWED: true,
    user: {},
    setting: {},
    util: {},

    userStakeLevel: {},

    init: function () {
        this.initPrototype();

        const menuConfig = new LobbyMenuConfig();
        this.user.offerGames = menuConfig.list;
    },
    initPrototype: function () {
        if (!String.format) {
            String.format = function (t) {
                var i = Array.prototype.slice.call(arguments, 1);
                return t.replace(/{(\d+)}/g, function (t, e) {
                    return void 0 !== i[e] ? i[e] : t;
                });
            };
        }
    },
    userData: function (data) {
        if (void 0 !== data.offerGames) {
            const offerGames = data.offerGames.map((game) => game.gameId);
            const menuConfig = new LobbyMenuConfig();
            const list = [];
            menuConfig.list.forEach((id) => {
                if (offerGames.includes(id)) {
                    list.push(id);
                }
            });
            this.user.offerGames = list;
            cc.sys.localStorage.setItem("latestOfferGames", JSON.stringify(list));
            cc.sys.localStorage.setItem("offerGames", JSON.stringify(offerGames));
        }
        if (data.rate) {
            this.user.rate = data.rate;
        }
        if (void 0 !== data.name) {
            this.user.name = data.name;
        }
        if (void 0 !== data.avatarId) {
            this.user.avatarId = data.avatarId;
        }
        if (void 0 !== data.red) {
            this.user.red = data.red;
        }
        if (void 0 !== data.UID) {
            this.user.UID = data.UID;
        }
        if (void 0 !== data.joinedOn) {
            this.user.joinedOn = data.joinedOn;
        }
        if (void 0 !== data.security) {
            this.user.security = data.security;
        }
        if (void 0 !== data.currency) {
            this.user.currency = data.currency;
        }
        if (void 0 !== data.availSpins) {
            this.user.availSpins = data.availSpins;
        }
        if (void 0 !== data.scoins) {
            this.user.scoins = data.scoins;
        }
    },
    userStakeLevelData: function (data) {
        if (this.userStakeLevel.minBet === data.minBet && this.userStakeLevel.maxBet === data.maxBet) {
            return false;
        }

        this.userStakeLevel.minBet = data.minBet;
        this.userStakeLevel.maxBet = data.maxBet;

        const scene = cc.director.getScene();
        const betChips = scene.getComponentsInChildren("BetChips");
        betChips.forEach((betChip) => betChip.updateChips());

        const balanceGames = scene.getComponentsInChildren("BalancedBettingPoolGameBase");
        balanceGames.forEach((balanceGame) => balanceGame.updateBetBoard());

        const miniKenos = scene.getComponentsInChildren("MiniKeno");
        miniKenos.forEach((keno) => keno.updateBetBoard());

        const kenoProViet = scene.getComponentInChildren("KenoProViet");
        kenoProViet && kenoProViet.updatePresetBet();

        return true;
    }
};
