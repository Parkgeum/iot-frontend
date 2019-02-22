(function () {
    'use strict';

    angular.module('BlurAdmin').service('httpService', httpService);


    /** @ngInject */
    function httpService($http, API_URL, AuthTokenFactory, $q, $state) {


        /* User List*/
        this.getUserList = function (page, size, sort, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/users?page=" + page + "&size=" + size,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get User */
        this.getUser = function (uuid, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/users/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Add User */
        this.addUser = function (user, token) {
            return ($http({
                method: 'POST',
                url: API_URL + "/users",
                data: user,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Update User */
        this.updateUser = function (user, token) {
            return ($http({
                method: 'PUT',
                url: API_URL + "/users/" + user.uuid,
                data: user,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Delete User */
        this.deleteUser = function (uuid, token) {
            return ($http({
                method: 'DELETE',
                url: API_URL + "/users/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Gateway List*/
        this.getGatewayList = function (page, size, sort, token) {
            var user_id = window.sessionStorage.getItem('id');
            return ($http({
                method: 'GET',
                url: API_URL + "/gateways?page=" + page + "&size=" + size,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Gateway List By UserId*/
        this.getGatewayListByUserid = function (page, size, sort, user, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/gateways?page=" + page + "&size=" + size + "&user=" + user,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Gateway */
        this.getGateway = function (uuid, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/gateways/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Add Gateway */
        this.addGateway = function (center, token) {
            return ($http({
                method: 'POST',
                url: API_URL + "/gateways",
                data: center,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Update Gateway */
        this.updateGateway = function (center, token) {
            return ($http({
                method: 'PUT',
                url: API_URL + "/gateways/" + center.uuid,
                data: center,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Delete Gateway */
        this.deleteGateway = function (uuid, token) {
            return ($http({
                method: 'DELETE',
                url: API_URL + "/gateways/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Operation List*/
        this.getOperationList = function (page, size, sort, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/operations?page=" + page + "&size=" + size,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Operation */
        this.getOperation = function (uuid, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/operations/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Add Operation */
        this.addOperation = function (node, token) {
            return ($http({
                method: 'POST',
                url: API_URL + "/operations",
                data: node,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Update Operation */
        this.updateOperation = function (node, token) {
            return ($http({
                method: 'PUT',
                url: API_URL + "/operations/" + node.uuid,
                data: node,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Delete Operation */
        this.deleteOperation = function (uuid, token) {
            return ($http({
                method: 'DELETE',
                url: API_URL + "/operations/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Device List*/
        this.getDeviceList = function (page, size, sort, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/devices?page=" + page + "&size=" + size,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Device List By Type*/
        this.getDeviceListByType = function (page, size, sort, type, gatewayMac, token) {
            var queryUrl = "";
            if (gatewayMac == "Select Gateway")
                queryUrl = "/devices?page=" + page + "&size=" + size + "&type=" + type;
            else if (gatewayMac == "All")
                queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type;
            else
                queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&gatewayMac=" + gatewayMac;
            return ($http({
                method: 'GET',
                url: API_URL + queryUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* DeviceListByGateway List*/
        this.getDeviceListByGateway = function (gateway, page, size, sort, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/devices?gatway=" + gateway + "&page=" + page + "&size=" + size,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Get Device */
        this.getDevice = function (uuid, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/devices/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Add Device */
        this.addDevice = function (device, token) {
            return ($http({
                method: 'POST',
                url: API_URL + "/devices",
                data: device,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Update Device */
        this.updateDevice = function (device, token) {
            return ($http({
                method: 'PUT',
                url: API_URL + "/devices/" + device.uuid,
                data: device,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Delete Device */
        this.deleteDevice = function (uuid, token) {
            return ($http({
                method: 'DELETE',
                url: API_URL + "/devices/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Status List*/
        this.getStatusList = function (page, size, sort, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&sort" + sort,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Status */
        this.getStatus = function (uuid, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        /* Add Status */
        this.addStatus = function (message, token) {
            return ($http({
                method: 'POST',
                url: API_URL + "/statuses",
                data: message,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Update Status */
        this.updateStatus = function (message, token) {
            return ($http({
                method: 'PUT',
                url: API_URL + "/statuses/" + message.uuid,
                data: message,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Delete Status */
        this.deleteStatus = function (uuid, token) {
            return ($http({
                method: 'DELETE',
                url: API_URL + "/statuses/" + uuid,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        this.getTypeStatus = function (page, size, sort, type, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&type=" + type,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        this.getDeviceStatus = function (page, size, sort, excludeType, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&excludeType=" + excludeType,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Device By Gateway*/
        this.getSensor = function (page, size, sort, type, gatewayMac, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&gatewayMac=" + gatewayMac,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };
        /* Get one Sensor */
        this.getOneSensor = function (page, size, sort, type, gatewayMac, mac, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&gatewayMac=" + gatewayMac + "&mac=" + mac,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Device By Gateway*/
        this.getDeviceByGateway = function (page, size, sort, gatewayMac, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&gatewayMac=" + gatewayMac,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get status By DeviceType By Gateway By device*/
        this.getStatusBy = function (page, size, sort, type, gatewayMac, mac, token) {

            var queryUrl = "";
            if ((gatewayMac == "All") || (gatewayMac == "Select Gateway")) {
                if ((mac == "All") || (mac == "Select Device")) {
                    queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type;
                } else {
                    queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&mac=" + mac;
                }
            } else {
                if ((mac == "All") || (mac == "Select Device")) {
                    queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&gatewayMac=" + gatewayMac;
                } else {
                    queryUrl = "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&mac=" + mac + "&gatewayMac=" + gatewayMac;
                }
            }

            return ($http({
                method: 'GET',
                url: API_URL + queryUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };

        /* Get Device By Gateway By timeRange*/
        this.getDeviceByGatewayBytimeRange = function (page, size, sort, type, gatewayMac, timeRange, token) {
            return ($http({
                method: 'GET',
                url: API_URL + "/statuses?page=" + page + "&size=" + size + "&type=" + type + "&gatewayMac=" + gatewayMac + "&timeRange=" + timeRange,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };


        this.getMinewdbData = function (gatewayMac, mac, startTime, endTime, token) {
            var influxDBUrl = "http://iot.beaconyun.com:8080/query?"
            // var influxDBUrl = "http://192.168.0.132:8080/query?"
            var timeBy = Math.floor((startTime - endTime) / 100);
            if ((startTime - endTime) >= 1800) {
                timeBy = 10;
            }
            if ((startTime - endTime) >= 3600) {
                timeBy = Math.floor((startTime - endTime) / 300);
            }
            if ((startTime - endTime) >= 7 * 3600) {
                timeBy = Math.floor((startTime - endTime) / 600);
            }

            startTime = startTime + "s";
            endTime = endTime + "s";
            gatewayMac = "'" + gatewayMac + "'";
            mac = "'" + mac + "'";
            // var url = influxDBUrl + "&q=SELECT MEAN(temperature),MEAN(humidity),MEAN(battery)  FROM sensor WHERE gatewayMac=" + gatewayMac + "AND mac="+ mac + "AND time >= '2017-07-10T05:00:00Z' AND time <= '2017-07-10T06:00:00Z' GROUP BY time(100s)";
            var url = influxDBUrl + "&q=SELECT MEAN(temperature),MEAN(humidity),MEAN(battery)  FROM sensor WHERE gatewayMac=" + gatewayMac + " AND mac=" + mac + " AND time > now() - " + startTime + " AND time < now() - " + endTime + " GROUP BY time(" + timeBy + "s)";
            // console.log(url);
            return ($http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };
        
        this.getMinewdbData2 = function (gatewayMac, mac, startTime, endTime, token) {
            var influxDBUrl = "http://iot.beaconyun.com:8080/query?"
            // var influxDBUrl = "http://192.168.0.132:8080/query?"

            var timeBy = Math.floor((startTime - endTime) / 100);
            
            if ((startTime - endTime) > 1800) {
                timeBy = 10;
            }
            if ((startTime - endTime) >= 3600) {
                timeBy = Math.floor((startTime - endTime) / 300);
            }
            if ((startTime - endTime) >= 7 * 3600) {
                timeBy = Math.floor((startTime - endTime) / 600);
            }

            startTime = startTime + "s";
            endTime = endTime + "s";
            gatewayMac = "'" + gatewayMac + "'";
            mac = "'" + mac + "'";
            var url = influxDBUrl + "&q=SELECT MEAN(battery), MEAN(rssi)  FROM iBeacon WHERE gatewayMac=" + gatewayMac + " AND mac=" + mac + " AND time > now() - " + startTime + " AND time < now() - " + endTime + " GROUP BY time(" + timeBy + "s)";
            if(startTime == 10+'s' || startTime==120+'s'){
                console.log("ss");
                url = influxDBUrl + "&q=SELECT MEAN(battery), MEAN(rssi)  FROM iBeacon WHERE gatewayMac=" + gatewayMac + " AND mac=" + mac + " AND time > now() - " + startTime + " AND time < now() - " + endTime + " GROUP BY time(" + 1 + "s)"; 
            }
            console.log(url);
            return ($http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }));
        };
        // SELECT MEAN(temperature),MEAN(humidity),MEAN(battery) FROM beacon WHERE "Name"='S1' AND "MAC"='AC:23:3F:A0:00:05' AND time>now() - 300s GROUP BY "MAC",time(5s)

        this.httpStatusCode = function (status) {
            if(status === 401)
                $state.go('user.login');
            else
                return;
        };
    }
})();