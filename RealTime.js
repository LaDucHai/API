const { getUserById } = require('./user');
const fs = require('fs');
const { getTiming } = require('./SupportFunction');
const { v4: uuidv4 } = require('uuid');


let arrUserOnline = []
let arrCallVideo = []


const SendFriendsFollowUsers = (idLogin, callBack) => {
    let arrFrendFollowed = []
    let pathMyFriends = `../data/Data/${getUserById(idLogin).userLogin}/friendfollow/myFriend.json`;
    let pathMyFollowed = `../data/Data/${getUserById(idLogin).userLogin}/friendfollow/myFollowed.json`;
    fs.exists(pathMyFriends, exists => {
        if(exists) {
            for(let i=0; i<require(pathMyFriends).myFriend.lenght; i++) {
                if(!arrFrendFollowed.includes(require(pathMyFriends).myFriend[i])) {
                    arrFrendFollowed.push(require(pathMyFriends).myFriend[i])
                }
            }
        }
    })
    fs.exists(pathMyFollowed, exists => {
        if(exists) {
            for(let i=0; i<require(pathMyFollowed).myFollowed.lenght; i++) {
                if(!arrFrendFollowed.includes(require(pathMyFollowed).myFollowed[i])) {
                    arrFrendFollowed.push(require(pathMyFollowed).myFollowed[i])
                }
            }
        }
    })
    callBack(arrFrendFollowed);
}
const GetFriendsFollowUsers = (callBack, socket) => {
    socket.on('clientServer-getOnline', id => {
        if(arrUserOnline.includes(id)) {
            callBack(id);
        }
    })
}


const RealTime = (io, socket) => {

    // User Online
    socket.on('clientServer-online', (idLogin, callBack) => {
        socket.join(idLogin)
        arrUserOnline.push(idLogin)

        // Send Friends and FollowUsers
        SendFriendsFollowUsers(idLogin, (arrFrendFollowed) => {
            io.to(arrFrendFollowed).emit('serverClient-sendOnline', idLogin);
        });

        // Get Friends and FollowUsers
        GetFriendsFollowUsers((id) => {
            socket.emit('serverClient-getOnline', id)  
        }, socket);

        let err = false
        if(err) return callBack();
    })

    // Chatting
    socket.on('clientServer-sendMessage', ({idSend, idReceive, messageContent}) => {
        let timestamp = getTiming();
        io.to([idSend, idReceive]).emit('serverClient-sendMessage', {idSend, idReceive, messageContent, timestamp})
    })

    // Call Video
    socket.on('clientServer-sendCallVideo', ({idSend, idReceive}) => {
        io.to([idSend, idReceive]).emit('serverClient-getCallVideo', {idSend, idReceive});
    })
    socket.on('clientServer-sendAcceptCallVideo', ({idSend, idReceive}) => {
        let callVideoRoom = `${getTiming()}&&${uuidv4()}`;
        arrCallVideo.push({
            'callVideoRoom': callVideoRoom,
            'joinUser': [idSend, idReceive]
        });
        io.to([idSend, idReceive]).emit('serverClient-getAcceptCallVideo', callVideoRoom);
    })
    socket.on('clientServer-sendCancelCallVideo', ({idSend, idReceive}) => {
        io.to([idSend, idReceive]).emit('serverClient-getCancelCallVideo');
    })
    socket.on('clientServer-sendSignalOfStreamVideo', ({callVideoRoom, signal}) => {
        let joinUserOfRoom = arrCallVideo.find(x => {
            return x.callVideoRoom === callVideoRoom;
        })
        socket.broadcast.to(joinUserOfRoom.joinUser).emit('serverClient-getSignalOfStreamVideo', signal);
        // io.to(joinUserOfRoom.joinUser).emit('serverClient-getSignalOfStreamVideo', signal);
    })

    // Notifications
    socket.on('clientServer-Notifications', ({idSend, idReceive, contentNotification}, callBack) => {
        io.to(idReceive).emit('serverClient-Notifications', {idSend, idReceive, contentNotification});
        io.to(idReceive).emit('serverClient-numberNotifications', true);
        let err = false
        if(err) return callBack();
    })

    // UserOffline
    socket.on('clientServer-offline', (idLogin, callBack) => {
        socket.on('disconnect', () => {
            arrUserOnline.splice(arrUserOnline.indexOf(idLogin), 1)

            // Send Friends and FollowUsers
            SendFriendsFollowUsers(idLogin, (arrFrendFollowed) => {
                io.to(arrFrendFollowed).emit('serverClient-sendOffline', idLogin);
            });

            // Get Friends and FollowUsers
            GetFriendsFollowUsers((id) => {
                socket.emit('serverClient-getOffline', id)  
            }, socket);

        }) 

        let err = false
        if(err) return callBack();
    }) 
}

module.exports = RealTime;