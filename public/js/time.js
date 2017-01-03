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
        h = today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds(),
        t,
        part = 'AM';

    if (h >= 12) {
        part = 'PM';
        if (h > 12) {
          h = h - 12;
        }
    }

    m = checkTime(m);
    s = checkTime(s);

    document.getElementById('clock').innerHTML = h + ':' + m + ':' + s + ' ' + part + ' EST';

    t = setTimeout(startTime, 500);
})();
