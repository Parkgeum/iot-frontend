/**
 * @author wsl
 * created on 2017-02-14
 */
(function () {
    'use strict';

    var os = angular.module('BlurAdmin.theme');

    os.filter("beaconType", function () {
        return function (input) {
            input = input || '';
            if (!input) return '';

            var output = '';
            if (input == 1) {
                output = "iBeacon";
            } else if (input == 2) {
                output = "Eddystone";
            } else if (input == 3) {
                output = "Hybird";
            } else {
                output = " "
            }

            return output;
        };
    });

    os.filter("beaconStatus", function () {
        return function (input) {
            input = input || '';
            if (!input) return '';

            var output = '';
            if (input == 1) {
                output = "Active";
            } else if (input == 2) {
                output = "Inactive";
            } else {
                output = " "
            }

            return output;
        };
    });

    os.filter("bstFrameType", function () {
        //<!-- 1=UID;2=EID;3=TLM;4=URL;0=empty -->
        return function (input) {
            input += 1;
            input = input || '';
            if (!input) return '';

            var output = '';
            if (input == 1) {
                output = "empty";
            } else if (input == 2) {
                output = "UID";
            } else if (input == 3) {
                output = "EID";
            } else if (input == 4) {
                output = "TLM";
            } else if (input == 5) {
                output = "URL";
            } else {
                output = " "
            }

            return output;
        };
    });


    os.filter("applyStatusFilter", function () {
        //<!-- 1=UID;2=EID;3=TLM;4=URL;0=empty -->
        return function (input) {
            if (typeof(input) == 'undefined') {
                input = 0;
            }
            input += 1;
            input = input || '';
            if (!input) return '';

            var output = '';
            if (input == 1) {
                output = "未同步";
            } else if (input == 2) {
                output = "已同步";
            } else if (input == 3) {
                output = "已删除";
            } else {
                output = " "
            }

            return output;
        };
    });

})();
