// import UserClientCommunicator from "../../UserClient";
import { UserHandler } from "../view-models/UserHandler";

export const getBalance = async (userHandler: UserHandler) => {
    // const { userManager } = UserClientCommunicator.getUserClientInstance();
    // const result = await userManager.getUserBalance();
    // if (result) {
    //     !result.isSuccessful && userHandler.emit(UserEvent.GET_BALANCE_ERROR, result.message);
    //     return result;
    // }
    // userHandler.emit(UserEvent.API_ERROR);
};

export const getUserInfo = async (userHandler: UserHandler) => {
    // const { userManager } = UserClientCommunicator.getUserClientInstance();
    // const result = await userManager.getUserDetail();
    // if (result) {
    //     !result.isSuccessful && userHandler.emit(UserEvent.GET_INFO_ERROR, result.message);
    //     return result.isSuccessful && result;
    // }
    // userHandler.emit(UserEvent.API_ERROR);
};

export const changeAvatar = async (userHandler: UserHandler, newAvatarId: number) => {
    // const { userManager } = UserClientCommunicator.getUserClientInstance();
    // const result = await userManager.changeAvatar(newAvatarId);
    // if (result) {
    //     !result.isSuccessful && userHandler.emit(UserEvent.CHANGE_AVATAR_ERROR, result.message);
    //     return result.isSuccessful && result;
    // }
    // userHandler.emit(UserEvent.API_ERROR);
};
