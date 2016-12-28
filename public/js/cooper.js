/* global firebase*/
/* jshint browser: true, node: false */

// Initialize Firebase
var config = {
        apiKey: 'AIzaSyB6T04_O2og_v5UUWAizCyhVs-TyDmHOUs',
        authDomain: 'squirrelly-319c4.firebaseapp.com',
        databaseURL: 'https://squirrelly-319c4.firebaseio.com',
        storageBucket: 'squirrelly-319c4.appspot.com',
        messagingSenderId: '741208836197'
    },
    database;

firebase.initializeApp(config);

database = firebase.database();

window.Cooper = {};

(function () {
    'use strict';

    function postMetrics(metrics, db) {
        metrics = metrics || {};

        if (window.debug) {
            console.log('Cooper posting metrics:');
            console.log(metrics);
        }
        var now = new Date(),
            ts = now.getTime(metrics);

        database.ref(db + ts).set(metrics);
    }

    window.Cooper.postMetrics = postMetrics;
})();
