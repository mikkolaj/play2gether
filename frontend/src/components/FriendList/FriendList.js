import React, { useContext } from "react";
import "./FriendList.scss";
import UserContext from "../../utils/UserContext";
import PopupContext from "../../utils/PopupContext";
import ConvContext from "../../utils/ConvContext";
import request from "../../utils/request";

const FriendList = (props) => {
    const userContext = useContext(UserContext);
    const popupContext = useContext(PopupContext);
    const convContext = useContext(ConvContext);
    const activeUser = userContext.globalUserState.user;
    const privateConversations =
        userContext.globalUserState.privateConversations;
    const groupConversations = userContext.globalUserState.groupConversations;

    const acceptFriend = async (received_friend) => {
        const res = await request(
            "patch",
            `http://localhost:8000/users/${received_friend._id}/acceptFriend`,
            null,
            true
        );

        if (res.data.status === "success") {
            const convRes = await request(
                "get",
                "http://localhost:8000/conversations/private",
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.data,
                privateConversations: convRes.data.data,
            });
            popupContext.setAlertActive(
                true,
                `${received_friend.name} has been added to your friends!`
            );
        }
    };

    const ignoreFriend = async (received_friend) => {
        const res = await request(
            "patch",
            `http://localhost:8000/users/${received_friend._id}/ignoreFriend`,
            null,
            true
        );

        if (res.data.status === "success") {
            const convRes = await request(
                "get",
                "http://localhost:8000/conversations/private",
                null,
                true
            );
            userContext.updateGlobalUserState({
                user: res.data.user,
                privateConversations: convRes.data.data,
            });
            popupContext.setAlertActive(
                true,
                `${received_friend.name}'s friend request has been ignored!`
            );
        }
    };

    const openChat = async (conv) => {
        console.log(conv);
        const openedConvs = [...convContext.convState.openedConvs];
        if (openedConvs.filter((c) => c._id === conv._id).length > 0) {
            //this conv has been opened already
            const index = openedConvs.indexOf(conv);
            openedConvs.splice(index, 1);
        } else {
            openedConvs.push(conv);
        }
        convContext.updateConvState({ openedConvs });
    };

    let friends = null;
    let received = null;
    let groups = null;
    let content = null;
    if (activeUser) {
        if (!popupContext.group) {
            // loading private conversations
            // console.log(privateConversations);
            friends = privateConversations.map((conv) => {
                let friend;
                if (conv.user._id === activeUser._id) {
                    //correspondent to ten drugi
                    friend = conv.correspondent;
                } else {
                    //user to ten drugi
                    friend = conv.user;
                }
                return (
                    <div
                        className="person"
                        key={conv._id}
                        onClick={() => openChat(conv)}
                    >
                        <img
                            src={require(`../../../../backend/static/users/${friend.photo}`)}
                            alt="avatar"
                        />
                        <p>{friend.name}</p>
                        <div className="actions">
                            <img
                                src={require("../../assets/message.png")}
                                alt="button"
                                className="btn"
                            />
                        </div>
                    </div>
                );
            });

            received = activeUser.receivedFriendRequests.map((pf) => {
                return (
                    <div className="person received">
                        <img
                            src={require(`../../../../backend/static/users/${pf.photo}`)}
                            alt="avatar"
                        />
                        <p>{pf.name}</p>
                        <div className="actions received-actions">
                            <img
                                src={require("../../assets/accept.png")}
                                alt="button"
                                className="btn received-btn"
                                onClick={() => acceptFriend(pf)}
                            />
                            <img
                                src={require("../../assets/close.png")}
                                alt="button"
                                className="btn received-btn"
                                onClick={() => ignoreFriend(pf)}
                            />
                        </div>
                    </div>
                );
            });

            content = (
                <div>
                    <h1 className="title">Friends</h1>
                    {activeUser &&
                        activeUser.receivedFriendRequests.length > 0 && (
                            <p className="title small-title">
                                Received requests
                            </p>
                        )}
                    <div className="received-box">{received}</div>
                    {activeUser &&
                        activeUser.friends > 0 &&
                        activeUser.receivedFriendRequests > 0 && (
                            <p className="title small-title">Your friends</p>
                        )}
                    {friends}
                    {privateConversations.length === 0 &&
                        activeUser.receivedFriendRequests.length === 0 && (
                            <p className="title small-title empty-title">
                                Nothing to show...
                            </p>
                        )}
                </div>
            );
        } else {
            // loading group conversations
            groups = groupConversations.map((conv) => {
                return (
                    <div
                        className="person"
                        key={conv._id}
                        onClick={() => openChat(conv)}
                    >
                        <img
                            src={require(`../../assets/group.png`)}
                            alt="avatar"
                            className="group-avatar"
                        />
                        <p>Nazwa grupowej konfy</p>
                        <div className="actions">
                            <img
                                src={require("../../assets/message.png")}
                                alt="button"
                                className="btn"
                            />
                        </div>
                    </div>
                );
            });

            content = (
                <div>
                    <h1 className="title">Groups</h1>
                    {groups}
                    {groupConversations.length === 0 && (
                        <p className="title small-title empty-title">
                            Nothing to show...
                        </p>
                    )}
                </div>
            );
        }
    }

    return (
        <div id="FriendList" className={props.className}>
            <img
                src={require("../../assets/white_right_arrow.png")}
                alt="close"
                className="dialog-button close_arrow"
                onClick={() =>
                    popupContext.setFriendsOpened(!popupContext.friendsOpened)
                }
            />
            <img
                src={require("../../assets/switch.png")}
                alt="friends/group"
                className="dialog-button switch-arrows"
                onClick={() =>
                    popupContext.setFriendsOpened(
                        popupContext.friendsOpened,
                        !popupContext.group
                    )
                }
            />
            {content}
        </div>
    );
};

export default FriendList;
