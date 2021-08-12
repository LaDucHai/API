const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 

const { getUserById, getUserByUserLogin } = require('./user');
const { getTiming, addNotifications } = require('./SupportFunction');

let allusertest = require('../data/Data/allusertest.json')

let manageuser = require('../data/Data/manageuser.json')
let alluser = require('../data/Data/alluser.json')
let data_billgate = require('../data/Data/billgate/posthome/posthome--41365464.json')
let data_elonmusk = require('../data/Data/elonmusk/posthome/posthome--41366464.json')
let data_jackma = require('../data/Data/jackma/posthome/posthome--41366964.json');

let allposthome = [data_billgate, data_elonmusk, data_jackma]

router.post('/getdataposthome', (req, res) => {
    if(req.body.homeapp) {
        res.send(allposthome)
    }
})

function timeFc() {
    let time = new Date()
    let seconds = time.getSeconds()
    let minutes = time.getMinutes()
    let hours = time.getHours()
    let year = time.getFullYear()
    let date = time.getDate()
    let month = time.getMonth() + 1
    let day = time.getDay() + 1
    let timeAll = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${day}`
    return timeAll
}

router.get('/', (req, res) => {
    res.send('get server is ip and running')
})

router.post('/', (req, res) => {
    res.send('server is ip and running')
})

router.get('/upload', (req, res) => {
    res.send('upload is ip and running')
})

router.post('/getUserById', (req, res) => {
    res.send(getUserById(req.body.id))
})

router.post('/postlike', (req, res) => {
    let getUserPost = alluser.alluser.find(function(x) {
        return x.id === req.body.idUserPost
    })
    let pathFilePost = `../data/Data/${getUserPost.userLogin}/posthome/posthome--${req.body.idPost}.json`
    let getDataPost = require(pathFilePost)
    if(req.body.like==='true') {
        getDataPost.data.likesNumberPost++
        if (!getDataPost.data.allUserLike.includes(req.body.idUserLike)) {
            getDataPost.data.allUserLike = [req.body.idUserLike].concat(getDataPost.data.allUserLike)
        }
    } else {
        getDataPost.data.likesNumberPost--
        if (getDataPost.data.allUserLike.includes(req.body.idUserLike)) {
            let arr = getDataPost.data.allUserLike
            arr.splice(arr.indexOf(req.body.idUserLike), 1); 
            console.log(arr)
        }
    }
    fs.writeFile(pathFilePost, JSON.stringify(getDataPost, null, 2), err => {
        if(err) console.error(err)
    })
})

router.post('/postdislike', (req, res) => {
    let getUserPost = alluser.alluser.find(function(x) {
        return x.id === req.body.idUserPost
    })
    let pathFilePost = `../data/Data/${getUserPost.userLogin}/posthome/posthome--${req.body.idPost}.json`
    let getDataPost = require(pathFilePost)
    if(req.body.disLike==='true') {
        getDataPost.data.disLikesNumberPost++
        if (!getDataPost.data.allUserDisLike.includes(req.body.idUserDisLike)) {
            getDataPost.data.allUserDisLike = [req.body.idUserDisLike].concat(getDataPost.data.allUserDisLike)
        }
    } else {
        getDataPost.data.disLikesNumberPost--
        if (getDataPost.data.allUserDisLike.includes(req.body.idUserDisLike)) {
            let arr = getDataPost.data.allUserDisLike
            arr.splice(arr.indexOf(req.body.idUserDisLike), 1); 
        }
    }
    fs.writeFile(pathFilePost, JSON.stringify(getDataPost, null, 2), err => {
        if(err) console.error(err)
    })
})

router.post('/postcomment', (req, res) => {
    let time = new Date()
    let getUserPost = alluser.alluser.find(function(x) {
        return x.id === req.body.idUserPost
    })
    let getUserComment = alluser.alluser.find(function(x) {
        return x.id === req.body.idUserComment
    })
    let pathFilePost = `../data/Data/${getUserPost.userLogin}/posthome/posthome--${req.body.idPost}.json`
    let pathFileComment = `../data/Data/${getUserPost.userLogin}/commenthome/commenthome--${req.body.idPost}.json`
    let getDataPost = require(pathFilePost)
    let getDataComment = require(pathFileComment)
    getDataPost.data.commentsNumberPost++
    getDataComment.data = [
        {
            "stt": getDataComment.data.length,
            "userComment": {
                "firstName": getUserComment.firstName,
                "lastName": getUserComment.lastName
            },
            "id": req.body.idUserComment,
            "define": "define",
            "contentComment": req.body.contentComment,
            "numbersReplyComment": null,
            "numbersLikeComment": null,
            "numbersDisLikeComment": null,
            "timeComment": time,
            "userReplyComment": "billgate123",
            "imageCommentPost": JSON.parse(req.body.imageComment).arrImg
        }
    ].concat(getDataComment.data)
    fs.writeFile(pathFileComment, JSON.stringify(getDataComment, null, 2), err => {
        if(err) console.error(err)
    })
    fs.writeFile(pathFilePost, JSON.stringify(getDataPost, null, 2), err => {
        if(err) console.error(err)
    })
    res.send({
        'userComment': getUserComment
    })
})

router.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
        // accessing the file
    const myFile = req.files.file; 
    let path = `/${req.body.idPost}&${timeFc()}&${myFile.name}`
    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public${path}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({name: myFile.name, path: path});
    });
})

router.post('/posthome', (req, res) => {
    let time = new Date()
    let seconds = time.getSeconds()
    let minutes = time.getMinutes()
    let hours = time.getHours()
    let year = time.getFullYear()
    let date = time.getDate()
    let month = time.getMonth() + 1
    let day = time.getDay() + 1
    let timeAll = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${day}`

    let getUserPost = alluser.alluser.find(function(x) {
        return x.id = req.body.idPost
    })

    let pathUserPost = `../data/Data/${getUserPost.userLogin}/posthome/posthome--${timeAll}.json`
    let pathUserComment = `../data/Data/${getUserPost.userLogin}/commenthome/commenthome--${timeAll}.json`
    let pathPostHomeArrId = `../data/Data/${getUserPost.userLogin}/posthome/posthomearrid.json`

    let arrImg = []
    let arrVideo = []
    let arrDataImgVideo = JSON.parse(req.body.dataImgVideo).arrDataImgVideo

    arrDataImgVideo.forEach((even, index) => {
        let allowedExtensions_img = /(\.jpg|\.jpeg|\.png|\.gif)$/i
        let allowedExtensions_video = /(\.mp4|\.webm)$/i
        if(allowedExtensions_img.exec(arrDataImgVideo[index].name)){
            arrImg.push(arrDataImgVideo[index].path)
        }   
        if(allowedExtensions_video.exec(arrDataImgVideo[index].name)) {
            arrVideo.push(arrDataImgVideo[index].path)
        }
    })

    let formDataPost = {
        "data": {
            "userInformationPost": {
              "id": getUserPost.id,
              "userLogin": getUserPost.userLogin,
              "firstName": getUserPost.firstName,
              "lastName": getUserPost.lastName,
              "avatar": getUserPost.avatar,
              "defineUserPost": "Define"
            },
            "idPost": timeAll,
            "timePost": timeAll,
            "contentPost": req.body.datatext,
            "imagePost": arrImg,
            "videoPost": arrVideo,
            "allUserLike": [],
            "likesNumberPost": 0,
            "allUserDisLike": [],
            "disLikesNumberPost": 0,
            "sharesNumberPost": 0,
            "commentsNumberPost": 0,
            "contentComment": []
          }
    }

    let formDataComment = {
        'data': []
    }

    let formDataArrIdPostHome = {
        'data': [
            timeAll
        ]
    }

    fs.exists(pathPostHomeArrId, exists => {
        if(exists) {
            let getArrIdPostHome = require(pathPostHomeArrId)
            getArrIdPostHome.data.unshift(timeAll)
            fs.writeFile(pathPostHomeArrId, JSON.stringify(getArrIdPostHome, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            fs.writeFile(pathPostHomeArrId, JSON.stringify(formDataArrIdPostHome, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    if(req.body.dialogposthome==='true') {
        fs.writeFile(pathUserPost, JSON.stringify(formDataPost, null, 2), err => {
            if(err) console.error(err)
        })
        fs.writeFile(pathUserComment, JSON.stringify(formDataComment, null, 2), err => {
            if(err) console.error(err)
        })
        res.send('POST SUCCESS')
    }
})

router.post('/getcomment', (req, res) => {
    let getUserPost = alluser.alluser.find((x) => {
        return x.id === req.body.idUserPost
    })
    let arrComments = require(`../data/Data/${getUserPost.userLogin}/commenthome/commenthome--${req.body.idPost}.json`)
    
    let getComment = arrComments.data.find((x) => {
        return x.stt === (arrComments.data.length - 1) - Number(req.body.numberCommentPost)
    })

    let setGetComment
    if(Number(req.body.numberCommentPost)<arrComments.data.length) {
        setGetComment = true
    } else {
        setGetComment = false
    }

    res.send({
        'getComment': setGetComment,
        'data': getComment
    })
})

router.post('/register', (req, res) => {
    let time = new Date()
    let seconds = time.getSeconds()
    let minutes = time.getMinutes()
    let hours = time.getHours()
    let year = time.getFullYear()
    let date = time.getDate()
    let month = time.getMonth() + 1
    let day = time.getDay() + 1
    let timeAll = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${day}`
    let uuid = uuidv4()
    
    let userRegister_manageuser = manageuser.manageuser.find((x) => {
        if(x.userLogin===req.body.userRegister) {
            return true
        } else {
            return false
        }
    })
    let userRegister_alluser = alluser.alluser.find((x) => {
        if(x.userLogin===req.body.userRegister) {
            return true
        } else {
            return false
        }
    })
    if(userRegister_manageuser && userRegister_alluser) {
        res.send('USER EXISTS')
    } else {
        if((req.body.userRegister!=="") && (req.body.passRegister!=="") && (req.body.firstName!=="") && (req.body.lastName!=="")) {
            manageuser.manageuser.unshift(
                {
                    "id": timeAll + "--" + uuid,
                    "userLogin": req.body.userRegister,
                    "password": [
                        req.body.passRegister
                    ]
                }
            )
            alluser.alluser.unshift(
                {
                    "id": timeAll + "--" + uuid,
                    "userLogin": req.body.userRegister,
                    "firstName": req.body.firstName,
                    "lastName": req.body.lastName,
                    "define": "undefine",
                    "avatar": ""
                }
            )
            fs.writeFile('../data/Data/manageuser.json', JSON.stringify(manageuser, null, 2), err => {
                if(err) console.error(err)
            })
            fs.writeFile('../data/Data/alluser.json', JSON.stringify(alluser, null, 2), err => {
                if(err) console.error(err)
            })
            fs.mkdir(`../data/Data/${req.body.userRegister}`, err => {
                if(err) console.error(err)
                fs.mkdir(`../data/Data/${req.body.userRegister}/posthome`, err => {
                    if(err) console.error(err)
                })
                fs.mkdir(`../data/Data/${req.body.userRegister}/commenthome`, err => {
                    if(err) console.error(err)
                })
                fs.mkdir(`../data/Data/${req.body.userRegister}/friendfollow`, err => {
                    if(err) console.error(err)
                })
            })
            
            // create ChatContainer
            let pathFolderChatContainer = `../data/Chat/ChatContainer/${req.body.userRegister}`
            let pathFileChatContainer = `../data/Chat/ChatContainer/${req.body.userRegister}/ChatContainer.json`
            let chatContainer = {
                "ChatContainer": []
            }
            fs.exists(pathFileChatContainer, exists => {
                if(!exists) {
                    fs.mkdir(pathFolderChatContainer, err => {
                        if(err) console.error(err)
                        fs.writeFile(pathFileChatContainer, JSON.stringify(chatContainer, null, 2), err => {
                            if(err) console.error(err)
                        })
                    })
                }
            })
            //

            // create Notifications
            let pathFolderNotifications = `../data/Notifications/${req.body.userRegister}`;
            let pathFileNotifications = `../data/Notifications/${req.body.userRegister}/Notifications.json`;
            let notifications = {
                'newNotifications': [],
                'allNotifications': []
            }
            fs.exists(pathFolderNotifications, exists => {
                if(!exists) {
                    fs.mkdir(pathFolderNotifications, err => {
                        if(err) console.error(err)
                        fs.writeFile(pathFileNotifications, JSON.stringify(notifications, null, 2), err => {
                            if(err) console.error(err)
                        })
                    })
                }
            })
            //

            // create ChatRooms
            let pathChatRoomsFolderOfIdSend = `../data/Chat/ChatRooms/${req.body.userRegister}`;
            let pathChatRoomsFileOfIdSend = `../data/Chat/ChatRooms/${req.body.userRegister}/ChatRooms.json`;
            let dataChatRoom = {
                'chatRooms': {
                    'joinUsers': [],
                    'chatRooms': []
                }
            }
            fs.exists(pathChatRoomsFileOfIdSend, exists => {
                if(!exists) {
                    fs.mkdir(pathChatRoomsFolderOfIdSend, err => {
                        if(err) console.error(err)
                        fs.writeFile(pathChatRoomsFileOfIdSend, JSON.stringify(dataChatRoom, null, 2), err => {
                            if(err) console.error(err)
                        })
                    })
                }
            })
            //

            res.send('register success')
        } 
    }
})

router.post('/login', (req, res) => {
    let getUserLogin = manageuser.manageuser.find((x) => {
        return x.userLogin===req.body.userLogin
    })

    let getUser = alluser.alluser.find((x) => {
        return x.userLogin===req.body.userLogin
    })

    if((getUserLogin.userLogin===req.body.userLogin) && (getUserLogin.password[0]===req.body.passLogin)) {

        // create ChatContainer
        let pathFolderChatContainer = `../data/Chat/ChatContainer/${getUserLogin.userLogin}`
        let pathFileChatContainer = `../data/Chat/ChatContainer/${getUserLogin.userLogin}/ChatContainer.json`
        let chatContainer = {
            "ChatContainer": []
        }
        fs.exists(pathFileChatContainer, exists => {
            if(!exists) {
                fs.mkdir(pathFolderChatContainer, err => {
                    if(err) console.error(err)
                    fs.writeFile(pathFileChatContainer, JSON.stringify(chatContainer, null, 2), err => {
                        if(err) console.error(err)
                    })
                })
            }
        })
        //

        // create Notifications
        let pathFolderNotifications = `../data/Notifications/${getUserLogin.userLogin}`;
        let pathFileNotifications = `../data/Notifications/${getUserLogin.userLogin}/Notifications.json`;
        let notifications = {
            'newNotifications': [],
            'allNotifications': []
        }
        fs.exists(pathFolderNotifications, exists => {
            if(!exists) {
                fs.mkdir(pathFolderNotifications, err => {
                    if(err) console.error(err)
                    fs.writeFile(pathFileNotifications, JSON.stringify(notifications, null, 2), err => {
                        if(err) console.error(err)
                    })
                })
            }
        })
        //

        // create ChatRooms
        let pathChatRoomsFolderOfIdSend = `../data/Chat/ChatRooms/${req.body.userLogin}`;
        let pathChatRoomsFileOfIdSend = `../data/Chat/ChatRooms/${req.body.userLogin}/ChatRooms.json`;
        let dataChatRoom = {
            'chatRooms': {
                'joinUsers': [],
                'chatRooms': []
            }
        }
        fs.exists(pathChatRoomsFileOfIdSend, exists => {
            if(!exists) {
                fs.mkdir(pathChatRoomsFolderOfIdSend, err => {
                    if(err) console.error(err)
                    fs.writeFile(pathChatRoomsFileOfIdSend, JSON.stringify(dataChatRoom, null, 2), err => {
                        if(err) console.error(err)
                    })
                })
            }
        })
        //

        res.send(
            {
                message: 'Login success',
                data: {
                    id: getUserLogin.id,
                    userLogin: getUserLogin.userLogin,
                    firstName: getUser.firstName,
                    lastName: getUser.lastName,
                    avatar: getUser.avatar
                }
            }
        )
    } else {
        res.send(
            {
                message: 'Login NOT success',
                data: ''
            }
        )
    }
})

router.post('/personalpagehome', (req, res) => {
    let getUser = alluser.alluser.find((x) => {
        return x.id === req.body.idLogin
    })

    if(req.body.request==='1') {
        let pathArrId = `../data/Data/${getUser.userLogin}/posthome/posthomearrid.json`
        let getArrId = require(pathArrId)
        let arrIdPostHome = getArrId.data
        res.send(arrIdPostHome)
    } else if(req.body.request==='2') {
        let pathPostHome = `../data/Data/${getUser.userLogin}/posthome/posthome--${req.body.idPostHome}.json`
        let getPostHome = require(pathPostHome)
        res.send(getPostHome)
    }
})

router.post('/personalpagevideo', (req, res) => {
    res.send('personalpagevideo')
})

router.post('/sendAvatar', (req, res) => {
    let getUser = alluser.alluser.find((x) => {
        return x.id === req.body.idPost
    })
    getUser.avatar = req.body.urlImg

    let getArrIdPost = require(`../data/Data/${getUser.userLogin}/posthome/posthomearrid.json`)
    for(let i=0; i<getArrIdPost.data.length; i++) {
        let pathPost = `../data/Data/${getUser.userLogin}/posthome/posthome--${getArrIdPost.data[i]}.json`
        let getPost = require(pathPost)
        getPost.data.userInformationPost.avatar = req.body.urlImg
        fs.writeFile(pathPost, JSON.stringify(getPost, null, 2), err => {
            if(err) console.error(err)
        })
    }

    fs.writeFile('../data/Data/alluser.json', JSON.stringify(alluser, null, 2), err => {
        if(err) console.error(err)
    })

    let sendDataLocalStorage = getUser

    res.send(sendDataLocalStorage)
})

router.post('/unFriend', (req, res) => {
    let pathMyFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/myFriend.json`;
    let pathOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/myFriend.json`;

    let pathNotificationsOfUserReceive = `../data/Notifications/${getUserById(req.body.idReceive).userLogin}/Notifications.json`;

    fs.exists(pathMyFriend, exists => {
        if(exists) {
            let myFriend = require(pathMyFriend)
            if(myFriend.myFriend.includes(req.body.idReceive)) {
                myFriend.myFriend.splice(myFriend.myFriend.indexOf(req.body.idReceive), 1)
            }
            fs.writeFile(pathMyFriend, JSON.stringify(myFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathOfUserReceive, exists => {
        if(exists) {
            let ofUserReceive = require(pathOfUserReceive)
            if(ofUserReceive.myFriend.includes(req.body.idSend)) {
                ofUserReceive.myFriend.splice(ofUserReceive.myFriend.indexOf(req.body.idSend), 1);
            }
            fs.writeFile(pathOfUserReceive, JSON.stringify(ofUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    addNotifications(pathNotificationsOfUserReceive, 'unFriend', req.body.idSend)

    res.send('unFriend')
})

router.post('/unSendAddFriend', (req, res) => {
    let pathMySentFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/mySentFriend.json`;
    let pathOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/myInvitatedFriend.json`;

    let pathNotificationsOfUserReceive = `../data/Notifications/${getUserById(req.body.idReceive).userLogin}/Notifications.json`;

    fs.exists(pathMySentFriend, exists => {
        if(exists) {
            let mySentFriend = require(pathMySentFriend)
            if(mySentFriend.mySentFriend.includes(req.body.idReceive)) {
                mySentFriend.mySentFriend.splice(mySentFriend.mySentFriend.indexOf(req.body.idReceive), 1)
            }
            fs.writeFile(pathMySentFriend, JSON.stringify(mySentFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathOfUserReceive, exists => {
        if(exists) {
            let ofUserReceive = require(pathOfUserReceive)
            if(ofUserReceive.myInvitatedFriend.includes(req.body.idSend)) {
                ofUserReceive.myInvitatedFriend.splice(ofUserReceive.myInvitatedFriend.indexOf(req.body.idSend), 1);
            }
            fs.writeFile(pathOfUserReceive, JSON.stringify(ofUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    addNotifications(pathNotificationsOfUserReceive, 'unSendAddFriend', req.body.idSend)

    res.send('unSendAddFriend')
})

router.post('/sendAddFriend', (req, res) => {
    let pathMySentFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/mySentFriend.json`;
    let pathOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/myInvitatedFriend.json`;

    let pathNotificationsOfUserReceive = `../data/Notifications/${getUserById(req.body.idReceive).userLogin}/Notifications.json`;

    fs.exists(pathMySentFriend, exists => {
        if(exists) {
            let mySentFriend = require(pathMySentFriend)
            if(!mySentFriend.mySentFriend.includes(req.body.idReceive)) {
                mySentFriend.mySentFriend.unshift(req.body.idReceive)
            }
            fs.writeFile(pathMySentFriend, JSON.stringify(mySentFriend, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            let mySentFriend = {
                'mySentFriend': [
                    req.body.idReceive
                ]
            }
            fs.writeFile(pathMySentFriend, JSON.stringify(mySentFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })
    
    fs.exists(pathOfUserReceive, exists => {
        if(exists) {
            let ofUserReceive = require(pathOfUserReceive)
            if(!ofUserReceive.myInvitatedFriend.includes(req.body.idSend)) {
                ofUserReceive.myInvitatedFriend.unshift(req.body.idSend)
            }
            fs.writeFile(pathOfUserReceive, JSON.stringify(ofUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            let ofUserReceive = {
                'myInvitatedFriend': [
                    req.body.idSend
                ]
            }
            fs.writeFile(pathOfUserReceive, JSON.stringify(ofUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    addNotifications(pathNotificationsOfUserReceive, 'sendAddFriend', req.body.idSend)

    res.send('sendAddFriend')
})

router.post('/agreeAddFriend', (req, res) => {
    let pathMyInvitatedFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/myInvitatedFriend.json`;
    let pathMyFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/myFriend.json`;

    let pathSentFriendOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/mySentFriend.json`;
    let pathFriendOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/myFriend.json`;

    let pathNotificationsOfUserReceive = `../data/Notifications/${getUserById(req.body.idReceive).userLogin}/Notifications.json`;

    let pathChatContainerOfUserSend = `../data/Chat/ChatContainer/${getUserById(req.body.idSend).userLogin}/ChatContainer.json`;
    let pathChatContainerOfUserReceive = `../data/Chat/ChatContainer/${getUserById(req.body.idReceive).userLogin}/ChatContainer.json`;

    fs.exists(pathMyFriend, exists => {
        if(exists) {
            let myFriend = require(pathMyFriend)
            if(!myFriend.myFriend.includes(req.body.idReceive)) {
                myFriend.myFriend.unshift(req.body.idReceive)
            }
            fs.writeFile(pathMyFriend, JSON.stringify(myFriend, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            let myFriend = {
                'myFriend': [
                    req.body.idReceive
                ]
            }
            fs.writeFile(pathMyFriend, JSON.stringify(myFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathMyInvitatedFriend, exists => {
        if(exists) {
            let myInvitatedFriend = require(pathMyInvitatedFriend)
            if(myInvitatedFriend.myInvitatedFriend.includes(req.body.idReceive)) {
                myInvitatedFriend.myInvitatedFriend.splice(myInvitatedFriend.myInvitatedFriend.indexOf(req.body.idReceive), 1)
            }
            fs.writeFile(pathMyInvitatedFriend, JSON.stringify(myInvitatedFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathSentFriendOfUserReceive, exists => {
        if(exists) {
            let sentFriendOfUserReceive = require(pathSentFriendOfUserReceive)
            if(sentFriendOfUserReceive.mySentFriend.includes(req.body.idSend)) {
                sentFriendOfUserReceive.mySentFriend.splice(sentFriendOfUserReceive.mySentFriend.indexOf(req.body.idSend), 1);
            }
            fs.writeFile(pathSentFriendOfUserReceive, JSON.stringify(sentFriendOfUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathFriendOfUserReceive, exists => {
        if(exists) {
            let friendOfUserReceive = require(pathFriendOfUserReceive)
            if(!friendOfUserReceive.myFriend.includes(req.body.idSend)) {
                friendOfUserReceive.myFriend.unshift(req.body.idSend)
            }
            fs.writeFile(pathFriendOfUserReceive, JSON.stringify(friendOfUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            let friendOfUserReceive = {
                'myFriend': [
                    req.body.idSend
                ]
            }
            fs.writeFile(pathFriendOfUserReceive, JSON.stringify(friendOfUserReceive, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    addNotifications(pathNotificationsOfUserReceive, 'agreeAddFriend', req.body.idSend)

    // Add chat Container
    fs.exists(pathChatContainerOfUserSend, exists => {
        if(exists) {
            let chatContainer = require(pathChatContainerOfUserSend)
            if(!chatContainer.ChatContainer.includes(req.body.idReceive)) {
                chatContainer.ChatContainer.push(req.body.idReceive)
            }
            fs.writeFile(pathChatContainerOfUserSend, JSON.stringify(chatContainer, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })
    fs.exists(pathChatContainerOfUserReceive, exists => {
        if(exists) {
            let chatContainer = require(pathChatContainerOfUserReceive)
            if(!chatContainer.ChatContainer.includes(req.body.idSend)) {
                chatContainer.ChatContainer.push(req.body.idSend)
            }
            fs.writeFile(pathChatContainerOfUserReceive, JSON.stringify(chatContainer, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    res.send('agreeAddFriend')
})

router.post('/unAgreeAddFriend', (req, res) => {
    let pathMyInvitatedFriend = `../data/Data/${getUserById(req.body.idSend).userLogin}/friendfollow/myInvitatedFriend.json`;
    let pathOfUserReceive = `../data/Data/${getUserById(req.body.idReceive).userLogin}/friendfollow/mySentFriend.json`;
    
    let pathNotificationsOfUserReceive = `../data/Notifications/${getUserById(req.body.idReceive).userLogin}/Notifications.json`;

    fs.exists(pathMyInvitatedFriend, exists => {
        if(exists) {
            let myInvitatedFriend = require(pathMyInvitatedFriend)
            if(myInvitatedFriend.myInvitatedFriend.includes(req.body.idReceive)) {
                myInvitatedFriend.myInvitatedFriend.splice(myInvitatedFriend.myInvitatedFriend.indexOf(req.body.idReceive), 1)
            }
            fs.writeFile(pathMyInvitatedFriend, JSON.stringify(myInvitatedFriend, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })

    fs.exists(pathOfUserReceive, exists => {
        if(exists) {
            let ofUserReceive = require(pathOfUserReceive)
            if(ofUserReceive.mySentFriend.includes(req.body.idSend)) {
                ofUserReceive.mySentFriend.splice(ofUserReceive.mySentFriend.indexOf(req.body.idSend), 1);
            }
            fs.writeFile(pathOfUserReceive, JSON.stringify(ofUserReceive, null, 2), err => {
                if(err) console.error(err);
            })
        }
    })
    addNotifications(pathNotificationsOfUserReceive, 'unAgreeAddFriend', req.body.idSend)

    res.send('unAgreeAddFriend')
})

router.post('/getInvitatedFriend', (req, res) => {
    let pathMyInvitatedFriend = `../data/Data/${getUserById(req.body.id).userLogin}/friendfollow/myInvitatedFriend.json`;
    fs.exists(pathMyInvitatedFriend, exists => {
        if(exists) {
            res.send(require(pathMyInvitatedFriend).myInvitatedFriend)
        } else {
            res.send('file_no_exists')
        }
    })
})

router.post('/getSentFriend', (req, res) => {
    let pathMySentFriend = `../data/Data/${getUserById(req.body.id).userLogin}/friendfollow/mySentFriend.json`
    fs.exists(pathMySentFriend, exists => {
        if(exists) {
            res.send(require(pathMySentFriend).mySentFriend)
        } else {
            res.send('file_no_exists')
        }
    })
})

router.post('/getMyFriend', (req, res) => {
    let pathMyFriend = `../data/Data/${getUserById(req.body.id).userLogin}/friendfollow/myFriend.json`
    fs.exists(pathMyFriend, exists => {
        if(exists) {
            res.send(require(pathMyFriend).myFriend)
        } else {
            res.send('file_no_exists')
        }
    })
})

router.post('/setMyFollow', (req, res) => {
    let pathMyFollow =`../data/Data/${getUserById(req.body.id1).userLogin}/friendfollow/myFollow.json`;
    let dataNewFollow = {
        'myFollow': [req.body.id2]
    }
    fs.exists(pathMyFollow, exists => {
        if(exists) {
            let getMyFollow = require(pathMyFollow)
            if((!getMyFollow.myFollow.includes(req.body.id2)) && (req.body.follow==='false')) {
                getMyFollow.myFollow.unshift(req.body.id2)
                res.send('follow')
            } else if((getMyFollow.myFollow.includes(req.body.id2)) && (req.body.follow==='true')) {
                getMyFollow.myFollow.splice(getMyFollow.myFollow.indexOf(req.body.id2), 1)
                res.send('NO follow')
            }
            fs.writeFile(pathMyFollow, JSON.stringify(getMyFollow, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            fs.writeFile(pathMyFollow, JSON.stringify(dataNewFollow, null, 2), err => {
                if(err) console.error(err)
            })
            res.send('follow')
        }
    })
})

router.post('/getMyFollow', (req, res) => {
    let pathMyFollow = `../data/Data/${getUserById(req.body.id).userLogin}/friendfollow/myFollow.json`
    fs.exists(pathMyFollow, exists => {
        if(exists) {
            res.send(require(pathMyFollow).myFollow)
        } else {
            res.send('file_no_exists')
        }
    })
})

router.post('/setMyFollowed', (req, res) => {
    let pathMyFollowed =`../data/Data/${getUserById(req.body.id2).userLogin}/friendfollow/myFollowed.json`;
    let dataNewFollowed = {
        'myFollowed': [req.body.id1]
    }
    fs.exists(pathMyFollowed, exists => {        
        if(exists) {
            let getMyFollowed = require(pathMyFollowed)
            if((!getMyFollowed.myFollowed.includes(req.body.id1)) && (req.body.follow==='false')) {
                getMyFollowed.myFollowed.unshift(req.body.id1)
                res.send('followed')
            } else if((getMyFollowed.myFollowed.includes(req.body.id1)) && (req.body.follow==='true')) {
                getMyFollowed.myFollowed.splice(getMyFollowed.myFollowed.indexOf(req.body.id1), 1)
                res.send('NO followed')
            }
            fs.writeFile(pathMyFollowed, JSON.stringify(getMyFollowed, null, 2), err => {
                if(err) console.error(err)
            })
        } else {
            fs.writeFile(pathMyFollowed, JSON.stringify(dataNewFollowed, null, 2), err => {
                if(err) console.error(err)
            })
            res.send('followed')
        }
    })
})

router.post('/getAllNotifications', (req, res) => {
    let path = `../data/Notifications/${getUserById(req.body.id).userLogin}/Notifications.json`;
    res.send(require(path))
})

router.post('/showAllNotifications', (req, res) => {
    let path = `../data/Notifications/${getUserById(req.body.id).userLogin}/Notifications.json`;
    let notifications = require(path);

    notifications.allNotifications = notifications.newNotifications.concat(notifications.allNotifications);
    notifications.newNotifications = []

    fs.writeFile(path, JSON.stringify(notifications, null, 2), err => {
        if(err) console.error(err)
    })

    res.send(require(path))
})

router.post('/seeNotifications', (req, res) => {
    let path = `../data/Notifications/${getUserById(req.body.id).userLogin}/Notifications.json`;
    let seeNotifications = require(path);
    let seeNotification = seeNotifications.allNotifications.find((x) => {
        return x.id === JSON.parse(req.body.notification).id
    })
    seeNotification.seen = true
    fs.writeFile(path, JSON.stringify(seeNotifications, null, 2), err => {
        if(err) console.error(err)
    })
    res.send('seeNotifications')
})

router.post('/createChatRoomName', (req, res) => {
    res.send(`${getTiming()}--${uuidv4()}`)
})

router.post('/getChatRooms', (req, res) => {
    let pathChatRoomsFileOfIdSend = `../data/Chat/ChatRooms/${getUserById(req.body.idSend).userLogin}/ChatRooms.json`;
    let pathChatRoomsFileOfIdReceive = `../data/Chat/ChatRooms/${getUserById(req.body.idReceive).userLogin}/ChatRooms.json`;

    let chatRoomsOfIdSend = require(pathChatRoomsFileOfIdSend);
    let chatRoomsOfIdReceive = require(pathChatRoomsFileOfIdReceive)

    let addRoomOfIdSend = {
        'joinUser': req.body.idReceive,
        'roomName': req.body.roomName
    }

    let addRoomOfIdReceive = {
        'joinUser': req.body.idSend,
        'roomName': req.body.roomName
    }

    if(!chatRoomsOfIdSend.chatRooms.joinUsers.includes(req.body.idReceive) && !chatRoomsOfIdReceive.chatRooms.joinUsers.includes(req.body.idSend)) {
        chatRoomsOfIdSend.chatRooms.joinUsers.push(req.body.idReceive);
        chatRoomsOfIdReceive.chatRooms.joinUsers.push(req.body.idSend);
        chatRoomsOfIdSend.chatRooms.chatRooms.push(addRoomOfIdSend);
        chatRoomsOfIdReceive.chatRooms.chatRooms.push(addRoomOfIdReceive);
        fs.writeFile(pathChatRoomsFileOfIdSend, JSON.stringify(chatRoomsOfIdSend, null, 2), err => {
            if(err) console.error(err)
        })
        fs.writeFile(pathChatRoomsFileOfIdReceive, JSON.stringify(chatRoomsOfIdReceive, null, 2), err => {
            if(err) console.error(err)
        })
        fs.mkdir(`../data/Chat/ChatContent/${req.body.roomName}`, err => {
            if(err) console.error(err)
        })
        res.send({'roomName': req.body.roomName});
    } else {
        let roomName = chatRoomsOfIdSend.chatRooms.chatRooms.find((x) => {
            return x.joinUser === req.body.idReceive
        }) 
        res.send({'roomName': roomName.roomName});
    }

})

router.post('/sendChatContent', (req, res) => {
    let pathChatRoom = `../data/Chat/ChatContent/${req.body.chatRoom}/ChatContent.json`;

    let newMessage = {
        'idSend': req.body.idSend,
        'idReceive': req.body.idReceive,
        'messageContent': req.body.chatContent,
        'timestamp': getTiming()
    }

    let firstMessage = {
        'chatContent': [
            newMessage
        ]
    }

    fs.exists(pathChatRoom, exists => {
        if(exists) {
            let chatRoom = require(pathChatRoom);
            chatRoom.chatContent.push(newMessage);
            fs.writeFile(pathChatRoom, JSON.stringify(chatRoom, null, 2), err => {
                if(err) console.error(err);
            })
        } else {
            fs.writeFile(pathChatRoom, JSON.stringify(firstMessage, null, 2), err => {
                if(err) console.error(err);
            })
        }
    })

    res.send('sendChatContent')
})

router.post('/getChatContent', (req, res) => {
    let pathRoomChat = `../data/Chat/ChatContent/${req.body.roomChat}/ChatContent.json`;

    fs.exists(pathRoomChat, exists => {
        if(exists) {
            let roomChat = require(pathRoomChat);
            res.send(roomChat.chatContent);
        } else {
            res.send([])
        }
    })
})

router.post('/chatContainer', (req, res) => {
    let pathChatContainer = `../data/Chat/ChatContainer/${getUserById(req.body.id).userLogin}/ChatContainer.json`;
    let chatContainer = require(pathChatContainer)
    res.send(chatContainer.ChatContainer)
})

module.exports = router;