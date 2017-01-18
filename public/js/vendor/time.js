/*global document*/
'use strict';

function checkTime(i) {
    if (i < 10) {
        i = '0' + i;
    }  // add zero in front of numbers < 10
    return i;
}
(function startTime() {
    var today = new Date(),
        y = today.getFullYear(),
        mo = today.getMonth(),
        d = today.getDay(),
        h = today.getHours(),
        mi = today.getMinutes(),
        s = today.getSeconds(),
        day = Math.round((new Date().setHours(23) - new Date(new Date().getYear()+1900, 0, 1, 0, 0, 0))/1000/60/60/24),
        t,
        part = 'AM';

    if (h >= 12) {
        part = 'PM';
        if (h > 12) {
          h = h - 12;
        }
    }

    mi = checkTime(mi);
    s = checkTime(s);

    switch (mo) {
        case 0:
            mo = 'Jan';
            break;
        case 1:
            mo = 'Feb';
            break;
        case 2:
            mo = 'Mar';
            break;
        case 3:
            mo = 'Apr';
            break;
        case 4:
            mo = 'May';
            break;
        case 5:
            mo = 'Jun';
            break;
        case 6:
            mo = 'Jul';
            break;
        case 7:
            mo = 'Aug';
            break;
        case 8:
            mo = 'Sep';
            break;
        case 9:
            mo = 'Oct';
            break;
        case 10:
            mo = 'Nov';
            break;
        default:
            mo = 'Dec';
    }

    switch (d) {
        case 0:
            d = 'Sunday';
            break;
        case 1:
            d = 'Monday';
            break;
        case 2:
            d = 'Tuesday';
            break;
        case 3:
            d = 'Wednesday';
            break;
        case 4:
            d = 'Thursday';
            break;
        case 5:
            d = 'Friday';
            break;
        default:
            d = 'Saturday';
    }

    document.getElementById('day').innerHTML = d + ' ' + mo + ' ' + day + ', ' + y;
    document.getElementById('clock').innerHTML = h + ':' + mi + ':' + s + ' ' + part + ' EST';

    t = setTimeout(startTime, 500);
})();
