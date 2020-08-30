import React, { useState, useContext } from "react";
import "./FriendList.scss";
import UserContext from "../../utils/UserContext";
import AlertContext from "../../utils/AlertContext";
import request from "../../utils/request";

const FriendList = (props) => {
    const userContext = useContext(UserContext);
    const alertContext = useContext(AlertContext);
    const activeUser = userContext.globalUserState.user;

    const acceptFriend = async (received_friend) => {
        const res = await request(
            "patch",
            `http://localhost:8000/users/${received_friend._id}/acceptFriend`,
            null,
            true
        );

        if (res.data.status === "success") {
            userContext.setGlobalUserState({ user: res.data.user });
            alertContext.setAlertActive(
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
            userContext.setGlobalUserState({ user: res.data.user });
            alertContext.setAlertActive(
                true,
                `${received_friend.name}'s friend request has been ignored!`
            );
        }
    };

    let friends = null;
    let received = null;
    if (activeUser) {
        friends = activeUser.friends.map((f) => {
            return (
                <div className="person" key={f._id}>
                    <img
                        src={require(`../../../../backend/static/users/${f.photo}`)}
                        alt="avatar"
                    />
                    <p>{f.name}</p>
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
    }

    return (
        <div id="FriendList" className={props.className}>
            <h1 className="title">Friends</h1>
            {activeUser && activeUser.receivedFriendRequests.length > 0 && (
                <p className="title small-title">Received requests</p>
            )}
            <div className="received-box">{received}</div>
            {activeUser &&
                activeUser.friends > 0 &&
                activeUser.receivedFriendRequests > 0 && (
                    <p className="title small-title">Your friends</p>
                )}
            {friends}
            {activeUser &&
                activeUser.friends.length === 0 &&
                activeUser.receivedFriendRequests.length === 0 && (
                    <p className="title small-title empty-title">
                        Nothing to show...
                    </p>
                )}
        </div>
    );
};

export default FriendList;
