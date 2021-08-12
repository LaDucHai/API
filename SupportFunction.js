const fs = require('fs')

const sendNotifications = (idSend, idReceive) => {
    getNotifications(idReceive)
}

const getTiming = () => {
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

const addNotifications = (path, content,  id_interactiveObject) => {
    fs.exists(path, exists => {
        if(exists) {
            let notifications = require(path)
            let newNotifications = {
                'id': `${id_interactiveObject}${getTiming()}`,
                'interactiveObject': id_interactiveObject,
                'content': content,
                'time': getTiming(),
                'seen': false
            }
            notifications.newNotifications.unshift(newNotifications)
            fs.writeFile(path, JSON.stringify(notifications, null, 2), err => {
                if(err) console.error(err)
            })
        }
    })
}


module.exports = { sendNotifications, getTiming, addNotifications }