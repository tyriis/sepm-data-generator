let limit = 1000
let occupancy = [
    {
        from: new Date('2018-02-01'),
        to: new Date('2018-03-01'),
        limit: limit * 0.6,
    },
    {
        from: new Date('2018-03-01'),
        to: new Date('2018-04-01'),
        limit: limit * 0.6,
    },
    {
        from: new Date('2018-04-01'),
        to: new Date('2018-05-01'),
        limit: limit * 0.7,
    },
    {
        from: new Date('2018-05-01'),
        to: new Date('2018-06-01'),
        limit: limit * 0.7,
    },
    {
        from: new Date('2018-06-01'),
        to: new Date('2018-07-01'),
        limit: limit * 0.6,
    },
    {
        from: new Date('2018-07-01'),
        to: new Date('2018-08-01'),
        limit: limit * 0.7,
    },
    {
        from: new Date('2018-08-01'),
        to: new Date('2018-09-01'),
        limit: limit,
    },
    {
        from: new Date('2018-09-01'),
        to: new Date('2018-10-01'),
        limit: limit * 0.85,
    },
    {
        from: new Date('2018-10-01'),
        to: new Date('2018-11-01'),
        limit: limit * 0.6,
    },
    {
        from: new Date('2018-11-01'),
        to: new Date('2018-12-01'),
        limit: limit * 0.5,
    },
    {
        from: new Date('2018-12-01'),
        to: new Date('2019-01-01'),
        limit: limit * 0.9,
    },
    {
        from: new Date('2019-01-01'),
        to: new Date('2019-02-01'),
        limit: limit * 0.4,
    },
    {
        from: new Date('2019-02-01'),
        to: new Date('2019-03-01'),
        limit: limit * 0.4,
    },
    {
        from: new Date('2019-03-01'),
        to: new Date('2019-04-01'),
        limit: limit * 0.3,
    },
    {
        from: new Date('2019-04-01'),
        to: new Date('2019-05-01'),
        limit: limit * 0.5,
    },
    {
        from: new Date('2019-05-01'),
        to: new Date('2019-06-01'),
        limit: limit * 0.5,
    },
    {
        from: new Date('2019-06-01'),
        to: new Date('2019-07-01'),
        limit: limit * 0.4,
    },
    {
        from: new Date('2019-07-01'),
        to: new Date('2019-08-01'),
        limit: limit,
    },
    {
        from: new Date('2019-08-01'),
        to: new Date('2019-09-01'),
        limit: limit * 0.1,
    },
    {
        from: new Date('2019-09-01'),
        to: new Date('2019-10-01'),
        limit: limit * 0.85,
    },
    {
        from: new Date('2019-10-01'),
        to: new Date('2019-11-01'),
        limit: limit * 0.6,
    },
    {
        from: new Date('2019-11-01'),
        to: new Date('2019-12-01'),
        limit: limit * 0.5,
    },
    {
        from: new Date('2019-12-01'),
        to: new Date('2020-01-01'),
        limit: limit * 0.2,
    },
    {
        from: new Date('2020-01-01'),
        to: new Date('2020-02-01'),
        limit: limit * 0.6,
    },
]



let roomCount = 140
let from = new Date('2019-02-01');
//let to = new Date(Date.now() + (1000 * 60 * 60 * 24 * 365))
let to = new Date('2019-03-01');
let maxDays = 21
let minDays = 1
let bookings = []
let minPrice = 5000
let maxPrice = 25000

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * @link https://stackoverflow.com/a/6274381
 */
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

let dayFrequency = [
    1,1,1,1,1,
    2,2,2,2,2,2,2,
    3,3,3,3,3,3,3,
    4,4,
    5,5,5,
    6,6,6,6,6,6,6,6,6,6,6,
    7,7,7,7,7,7,7,7,7,7,7,7,
    8,8,8,8,
    9,
    10,
    11,
    12,12,12,
    13,13,13,13,
    14,14,14,14,
    15,15,
    16,
    17,
    18,
    19,
    20,
    21
]

dayFrequency = shuffle(dayFrequency)

const DAY = 8.64e7
const fs = require('fs')

let rooms = []

for (let i = 0; i < roomCount; i++) {
    rooms[i] = {number: i+1, bookings: []}
}

const casual = require('casual')

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another))/DAY)
}

function getFromTo() {
    let fromTime = randomIntFromInterval(from.getTime(), to.getTime())
    let days = dayFrequency[randomIntFromInterval(0, dayFrequency.length -1)]
    let toTime = randomIntFromInterval(fromTime, (fromTime + (DAY * days)))
    let fromDate = new Date(fromTime)
    fromDate.setHours(0)
    fromDate.setMinutes(0)
    fromDate.setSeconds(1)
    fromDate.setMilliseconds(0)
    let toDate = new Date(toTime)
    toDate.setHours(0)
    toDate.setMinutes(0)
    toDate.setSeconds(0)
    toDate.setMilliseconds(0)
    return {from: fromDate, to: toDate}
}

function getBasePrice(roomId) {
    return randomIntFromInterval(minPrice, maxPrice)
}

function isAvailable(room, from, to) {
    let fromTime = from.getTime()
    let toTime = to.getTime()
    for (let booking of room.bookings) {
        if ((fromTime >= booking.from && fromTime <= booking.to) // fromTime between from and to
        || (toTime >= booking.from && toTime <= booking.to)
        || (fromTime <= booking.from && to >= booking.to)) {// toTime between from and to
            return false
        }
    }
    return true

}

function bookRoom(room, from, to) {
    room.bookings.push({from:from.getTime(), to:to.getTime()})
}

function getAvailableRoom(from, to) {
    let tested = new Set([])
    let candidates = Array.apply(null, {length: roomCount}).map(Number.call, Number)
    let room = null
    let i = 0
    while (room == null && i < roomCount) {
        i++
        candidates = candidates.filter(item => !tested.has(item))
        let index = randomIntFromInterval(0, candidates.length -1)
        let candidate = rooms[index]
        tested.add(index)
        if (isAvailable(candidate, from, to)) {
            room = candidate
        }
    }
    return room
}

function generateBookings(limit) {
    let breakLimit = 0
    for (let i = 1; i <= limit && breakLimit < 10; i++) {
        let loopCount = 0
        let room = null
        while (room == null && loopCount < 1000) {
            let {from, to} = getFromTo()
            let days = daysBetween(from, to)
            if (days < minDays) {
                continue
            }
            loopCount++
            room = getAvailableRoom(from, to)
            if (room == null) {
                continue
            }
            bookRoom(room, from, to)
            from.setSeconds(0)
            bookings.push({
                name: casual.full_name,
                from: from,
                to: to,
                days: days,
                room: room.number,
                price: parseInt((getBasePrice(room) * days) / 100) * 100
            })
            console.log(`booking ${bookings.length}: room find took ${loopCount} tries`)
        }
        if (room == null) {
            breakLimit++;
            console.log(`break after ${loopCount} iterations`)
        }
    }
    if (breakLimit > 10) {
        console.log(`breakLimit reached!!!`)
    }
}
for (let item of occupancy) {
    from = item['from']
    to = item['to']
    generateBookings(item['limit'])
}


function formatTwoChars(value) {
    if (value >= 10) {
        return `${value}`
    }
    return `0${value}`
}

function formatDate(date) {
    let year = date.getUTCFullYear()
    let month = formatTwoChars(date.getMonth() + 1)
    let day = formatTwoChars(date.getDate())
    return `${year}-${month}-${day} 00:00:00.0`
}
/*
let sql = "INSERT INTO BOOKING\n SELECT * FROM (\n    SELECT * FROM BOOKING WHERE FALSE\n"
let n = 0
for (booking of bookings) {
    n++
    sql = sql + `  UNION SELECT ${n}, ${2000+n}, NULL, ${booking.room}, '${booking.name}', NOW(), FALSE, '${formatDate(booking.from)}', '${formatDate(booking.to)}'\n`
}
sql += '  )\nWHERE NOT EXISTS(SELECT * FROM BOOKING)\n'
sql += '\nINSERT INTO BOOKING_POSTIONS\nSELECT  * FROM (\n    SELECT * FROM BOOKING_POSTIONS WHERE FALSE\n'
n = 0
for (booking of bookings) {
    n++
    sql += `   UNION SELECT ${n},'${booking.name}', ${booking.price}\n`
}
sql += ')\nWHERE NOT EXISTS(SELECT * FROM BOOKING_POSTIONS)'
*/
let sql = `DELETE FROM BOOKING_POSTIONS;\nDELETE FROM BOOKING;\nINSERT INTO BOOKING (ID, ROOM, GUEST_NAME, FROM_DATE, UNTIL_DATE, PAID)\n  VALUES`
let n = 1
for (booking of bookings) {
    sql +=  ` (${n++}, ${booking.room}, '${booking.name}', '${formatDate(booking.from)}', '${formatDate(booking.to)}', ${Date.now() > booking.to.getTime() ? "'" +formatDate(booking.to) +"'": 'NULL'}),\n         `
}
sql = sql.trim()
sql = sql.substring(0,sql.length -1)
sql += `;\nINSERT INTO BOOKING_POSTIONS (BOOKING, NAME, PRICE)\n  VALUES`
n = 1
for (booking of bookings) {
    sql +=  ` (${n++}, 'Zimmer ${booking.room} (${booking.days} Nächte)', ${booking.price}),\n         `
}
sql = sql.trim()
sql = sql.substring(0,sql.length -1)
sql += ';'

fs.writeFile("bookings.sql", sql, err => {
    if(err) {
        return console.log(err)
    }
    console.log("The file was saved!")
})