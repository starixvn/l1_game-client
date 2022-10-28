import MusicPlayer from "../../../common/audio/MusicPlayer";
import * as sessionManager from "../../../common/auth/SessionManager";
import GameUtils from "../../../common/GameUtils";
import { truncateFixedDecimals } from "../../../common/helpers/NumberHelper";
import UserProfile from "../../../common/user-profile/UserProfile";

export const loadMiniPanel = (game: any) => () => {
    if (!game.miniPanelPrefab) {
        return;
    }
    const miniPanel = cc.instantiate(game.miniPanelPrefab);
    game.currentMiniPanel = miniPanel.getComponent("MiniPanel");
    game.currentMiniPanel.currentGameRoomId = game.gameId;
    sessionManager.storeInRoomGameId(game.gameId);
    game.miniPanelContainer.addChild(miniPanel);
};

export const initMusicBackground = (game: any) => () => {
    const musicPlayer = MusicPlayer.getInstance();
    if (game.musicBg) {
        musicPlayer.joinRoomMusic = true;
        musicPlayer.decreaseVolumeAndStopBackgroundMusic();
    }
};

export const loadUserData = (game: any) => (user: any) => {
    if (!user) {
        return;
    }

    if (!game.isAlive()) {
        return;
    }

    if (void 0 !== user.name) {
        game.userProfile && game.userProfile.setUserName(user.name);
    }

    if (void 0 !== user.red) {
        game.userProfile && game.userProfile.setUserBalance(truncateFixedDecimals(user.red, 2));
    }

    if (void 0 !== user.avatarId) {
        GameUtils.getAvatarSprite(user.avatarId).then((frame) => {
            if (game?.node && frame) {
                game.userProfile && game.userProfile.setUserAvatar(frame);
            }
        });
    }
};

export const onUserProfileInitialized = (game: any) => (node: cc.Node) => {
    const userProfile = node.getComponent(UserProfile);
    if (userProfile) {
        game.userProfile = userProfile;
    }
};

export const outRoomGame = (game: any) => () => {
    return new Promise<void>((resolve) => {
        game.node.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.callFunc(() => {
                    game.socketIOController.closeMiniGameSockets();
                    game.stopGame();
                    resolve();
                })
            )
        );
    });
};

export const closeGame = (game: any) => () => {
    if (game.loading) {
        game.loading.active = true;
    }
    if (game.musicBg) {
        MusicPlayer.getInstance().handleIncreaseVolume();
    }
    game.outRoomGame().then(() => {
        cc.director.loadScene("MainGame");
    });
};

export const leaveGameRoom = (game: any) => () => {
    game.closeGame();
    sessionManager.removeInRoomGameId();
};
