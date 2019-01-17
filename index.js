let roomCount = 140
let from = new Date()
let to = new Date(Date.now() + (1000 * 60 * 60 * 24 * 365))
let maxDays = 21
let minDays = 1
let limit = 1000
let bookings = []
let minPrice = 5000
let maxPrice = 25000

const DAY = 8.64e7;
const fs = require('fs');

let rooms = []

for (let i = 0; i < roomCount; i++) {
    rooms[i] = {number: i+1, bookings: []}
}

const casual = require('casual')

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function daysBetween(one, another) {
    return Math.round(Math.abs((+one) - (+another))/DAY);
}

function getFromTo() {
    let fromTime = randomIntFromInterval(from.getTime(), to.getTime())
    let toTime = randomIntFromInterval(fromTime, (fromTime + (DAY * maxDays)));
    let fromDate = new Date(fromTime);
    fromDate.setHours(10);
    fromDate.setMinutes(0);
    fromDate.setSeconds(1);
    fromDate.setMilliseconds(0);
    let toDate = new Date(toTime);
    toDate.setHours(10);
    toDate.setMinutes(0);
    toDate.setSeconds(0);
    toDate.setMilliseconds(0);
    return {from: fromDate, to: toDate}
}

function getBasePrice(roomId) {
    return randomIntFromInterval(minPrice, maxPrice);
}

function isAvailable(room, from, to) {
    let fromTime = from.getTime()
    let toTime = to.getTime()
    for (let booking of room.bookings) {
        if ((fromTime >= booking.from && fromTime <= booking.to) // fromTime between from and to
        || (toTime >= booking.from && toTime <= booking.to)) {// toTime between from and to
            return false;
        }
    }
    return true;

}

function bookRoom(room, from, to) {
    room.bookings.push({from, to})
}

function getAvailableRoom(from, to) {
    let tested = new Set([]);
    let candidates = Array.apply(null, {length: roomCount}).map(Number.call, Number)
    let room = null;
    let i = 0;
    while (room == null && i < roomCount) {
        i++;
        candidates = candidates.filter(item => !tested.has(item));
        let index = randomIntFromInterval(0, candidates.length -1)
        let candidate = rooms[index];
        tested.add(index);
        if (isAvailable(candidate, from, to)) {
            room = candidate;
        }
    }
    return room;
}

for (let i = 1; i <= limit; i++) {
    let loopCount = 0;
    let room = null;
    while (room == null && loopCount < 1000) {
        loopCount++;
        let {from, to} = getFromTo()
        room = getAvailableRoom(from, to)
        if (room == null) {
            continue;
        }
        bookRoom(room, from, to);
        let days = daysBetween(from, to)
        bookings.push({
            name: casual.full_name,
            from: from,
            to: to,
            days: days,
            room: room.number,
            price: getBasePrice(room) * days
        });
        //console.log(`booking ${bookings.length}: room find took ${loopCount} tries`);
    }

}

function formatTwoChars(value) {
    if (value >= 10) {
        return `${value}`;
    }
    return `0${value}`;
}

function formatDate(date) {
    let year = date.getUTCFullYear()
    let month = formatTwoChars(date.getMonth() + 1)
    let day = formatTwoChars(date.getDate())
    return `${year}-${month}-${day} 00:00:00.0`
}

let sql = "INSERT INTO BOOKING\n SELECT * FROM (\n    SELECT * FROM BOOKING WHERE FALSE\n"
let n = 0
for (booking of bookings) {
    n++
    sql = sql + `  UNION SELECT ${n}, ${2000+n}, NULL, ${booking.room}, '${booking.name}', NOW(), FALSE, '${formatDate(booking.from)}', '${formatDate(booking.to)}'\n`
}
sql += '  )\nWHERE NOT EXISTS(SELECT * FROM BOOKING);\n'
sql += '\nINSERT INTO BOOKING_POSTIONS\nSELECT  * FROM (\n    SELECT * FROM BOOKING_POSTIONS WHERE FALSE\n'
n = 0;
for (booking of bookings) {
    n++
    sql += `   UNION SELECT ${n},'${booking.name}', ${booking.price}\n`
}
sql += ')\nWHERE NOT EXISTS(SELECT * FROM BOOKING_POSTIONS);'

fs.writeFile("bookings.sql", sql, err => {
  if(err) {
     return console.log(err)
  }
  console.log("The file was saved!");
});