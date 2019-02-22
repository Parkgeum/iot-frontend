/**
 * @author wsl
 * created on 2017-04-26
 */
(function () {
    'use strict';

    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                    date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    angular.module('BlurAdmin.pages.ibeacons')
        .controller('ibeaconCtrl', iBeaconCtrl);

    /** @ngInject */
    function iBeaconCtrl($scope, $echarts, $interval, $timeout, NgTableParams, $filter, httpService, $http, AuthTokenFactory) {
        var vm = this;

        vm.gateway = [];
        vm.sensor = [];
        vm.sensor_th = "";

        vm.th_line = {};

        vm.th_data = null;

        vm.startTime = 60 * 2;
        // vm.startTime = 10;
        vm.endTime = 0;

        vm.tableParamsGateway = new NgTableParams({
            page: 1,
            count: 100
        }, {
            filterDelay: 300,
            counts: [],
            getData: function ($defer, params) {

                var filter = params.filter();
                var size = params.count();
                var page = params.page() - 1;
                var sort = "";
                var token = AuthTokenFactory.getToken();

                httpService.getGatewayList(page, size, sort, token)
                    .success(function (resp) {
                        if (resp.data.length > 0) {
                            vm.gateway = resp.data[0];
                            resp.data[0].selected = true;

                            vm.tableParamsSensor = new NgTableParams({
                                page: 1,
                                count: 100
                            }, {
                                filterDelay: 300,
                                counts: [],
                                getData: function ($defer, params) {
                                    var filter = params.filter();
                                    var gatewayMac = filter.gatewayMac;
                                    var size = params.count();
                                    var page = params.page() - 1;
                                    var sort = "";
                                    var token = AuthTokenFactory.getToken();
                                    if (gatewayMac === undefined)
                                        gatewayMac = vm.gateway.mac;

                                    httpService.getSensor(page, size, sort, 'iBeacon', gatewayMac, token)
                                        .success(function (resp) {
                                            // console.log(resp);
                                            if (resp.data.length > 0) {
                                                vm.sensor = resp.data[0];
                                                resp.data[0].selected = true;
                                                loadTH_lineData();
                                            } else {
                                                vm.sensor = [];
                                                loadTH_lineData();
                                            }
                                            params.total(resp.totalItems);
                                            $defer.resolve(resp.data);
                                        }).error(function (resp, status) {
                                            console.log(resp);
                                            httpService.httpStatusCode(status);
                                        });
                                }
                            });
                        }
                        params.total(resp.totalItems);
                        $defer.resolve(resp.data);
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        });
        //选择时间
        vm.selectTime = function ($event, t) {
            // console.log(Date.parse());
            var div = $event.target.parentElement.parentElement,
                children = div.children,
                a_s = [];
            for (var i = 0; i < children.length; i++) {
                a_s.push(children[i].children[0]);
                $(children[i].children[0]).addClass("wsl-label-default-color");
                $(children[i].children[0]).removeClass("wsl-label-active-color");
            }

            $($event.target).removeClass("wsl-label-default-color");
            $($event.target).addClass("wsl-label-active-color");

            var oneDayTime = 24 * 60 * 60;
            var nowTime = Math.floor(new Date().getTime() / 1000);
            switch (t) {
                case 1:
                    vm.startTime = 10;
                    vm.endTime = 0;
                    break;
                case 2:
                    vm.startTime = 60 * 2;
                    vm.endTime = 0;
                    break;
                case 3:
                    vm.startTime = 60 * 60;
                    vm.endTime = 0;
                    break;
                case 4:
                    vm.startTime = nowTime - Math.floor(Date.parse(new Date(new Date().format('yyyy/MM/dd'))) / 1000);
                    vm.endTime = 0;
                    break;
            }
            loadTH_lineData();
        }
        //选择网关
        vm.selectGateway = function (item, $data) {
            vm.gateway = item;
            angular.forEach($data, function (data) {
                data.selected = false;
                if (data.uuid == item.uuid) {
                    data.selected = true;
                }
            });

            vm.tableParamsSensor.filter({
                gatewayMac: vm.gateway.mac
            });
        }
        //选择设备传感器
        vm.selectiBeacon = function (item, $data) {
            vm.sensor = item;

            angular.forEach($data, function (data) {
                data.selected = false;
                if (data.uuid == item.uuid) {
                    data.selected = true;
                }
            });
            loadTH_lineData();
        }

        vm.th_line = {
            textStyle: {
                color: "#fff"
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var param = params[0];
                    var name = param.seriesName;
                    var value = param.value;
                    //鼠标显示的数据
                    return name + '<br/>' + 'Time : ' + $filter('date')(new Date(value[0]), 'yyyy-MM-dd HH:mm:ss') + '<br/>' + 'Value : ' + value[1];
                }
            },
            grid: [{
                    x: 45,
                    y: 5,
                    width: '95%',
                    height: '92%'
                }
            ],
            xAxis: [
                {
                    gridIndex: 0,
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    gridIndex: 0,
                    scale: true,
                    interval: 5,
                    max: -10,
                    min: -100,
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: true,
                        lineStyle: {
                            // 使用深浅的间隔色
                            type: 'dashed',
                            color: 'rgba(255,255,255,0.24)'
                        }
                    },
                    axisLabel: {
                        formatter: function (value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            return value.toFixed(1);
                        }
                    }
                }
            ],
            series: [{
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    name: 'Rssi',
                    type: 'line',
                    showSymbol: false,
                    animation: false, // 关闭动画
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            color: 'rgba(30,144,255,0.8)'
                        } // 自定义线条颜色
                    },
                    data: []
                }
            ]
        };

        $scope.LINE_2 = echarts.init(document.getElementById('LINE_2'));
        //初始化，颜色为灰色
        $scope.LINE_2.setOption(vm.th_line);

        function setTH_line(data) {
            // console.log(data);
            if (!data) {
                $scope.LINE_2.setOption({
                    series: [{
                        data: []
                    }]
                });
            } else {
                var Values = data[0].values;
                var k = Values.length;
                var t_line = [];
                var h_line = [];
                for (var i = 0; i < k; i++) {
                    var value = Values[i];
                    var time = value[0],
                        t = value[1],
                        h = value[2];

                    if (t != null) {
                        t = t.toFixed(2);
                        t_line.push({
                            name: "battery",
                            value: [time, t]
                        });
                    }
                    if (h != null) {
                        h = h.toFixed(2);
                        h_line.push({
                            name: "rssi",
                            value: [time, h]
                        });
                    }

                }

                var arrAll = [];
                arrAll['t_line'] = t_line;
                arrAll['h_line'] = h_line;
                // console.log(arrAll);
                $scope.LINE_2.setOption({
                    series: [{
                        data: arrAll["h_line"]
                    }]
                });
            }

        }


        $scope.sil1 = null;
        $scope.sil2 = null;

        var loadTH_lineData = function () {
            if (vm.sensor.mac) {
                var token = AuthTokenFactory.getToken();
                httpService.getMinewdbData2(vm.gateway.mac, vm.sensor.mac, vm.startTime, vm.endTime, token)
                    .success(function (resp) {
                        console.log(resp);
                        if (resp.data[0].series != null) {
                            vm.th_data = resp.data[0].series;
                            setTH_line(vm.th_data);
                        } else {
                            vm.th_data = null;
                            setTH_line(vm.th_data);
                        }
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            } else {
                vm.th_data = null;
                setTH_line(vm.th_data);
            }

        };

        $scope.sil2 = $interval(loadTH_lineData, 1 * 1000);

        window.onresize = function () { //当窗口大小变化时
            $scope.LINE_2.resize();
        };

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sil1);
            $interval.cancel($scope.sil2);
        });

    }
})();