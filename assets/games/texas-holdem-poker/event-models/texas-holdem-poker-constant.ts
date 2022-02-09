export const TexasPokerMaxBetChoicesConst = {
    ante: "anteBet",
    call: "callBet"
};

export enum TexasHoldemPokerState {
    blank_new = 0,
    prepare_new,
    replay_new,
    ante_bet,
    calling_deal,
    dealing,
    dealt,
    calling_call,
    calling_called,
    calling_x2call,
    calling_fold,
    calling_turn,
    calling_turning,
    calling_turned,
    calling_river,
    calling_rivering,
    calling_check_turn,
    calling_check_river,
    settled
}

export enum CardAnimation {
    DealerToHand = "chia-bai",
    DropCard = "thu-bai",
    DealerCheckBlackJackFail = "dealer_check_blackjack_fail",
    DealerCheckBlackJackSuccess = "dealer_check_blackjack_success",
    DealerOpenCard = "dealer_open_card",
    DealerDrawingFaceDown = "dealer_drawing_face_down",
    PullCard = "pull_card"
}
