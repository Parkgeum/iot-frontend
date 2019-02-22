/**
 * @author wsl
 * created on 2017-04-26
 */
(function () {
    'use strict';

    function analysisGaugeData(serie) {
        var t_gauge = {};
        var h_gauge = {};
        if (serie) {
            var t = serie.temperature;
            var h = serie.humidity;

            if (t != null) t = t.toFixed(2); //四舍五入，保留两位小数
            if (h != null) h = h.toFixed(2);
            if (t != null && h != null) {
                t_gauge = t;
                h_gauge = h;
            }
        }

        var arrAll = [];
        arrAll['t_gauge'] = t_gauge;
        arrAll['h_gauge'] = h_gauge;
        return arrAll;
    };

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

    angular.module('BlurAdmin.pages.sensors')
        .controller('sensorsCtrl', SensorsCtrl);

    /** @ngInject */
    function SensorsCtrl($scope, $echarts, $interval, $timeout, NgTableParams, $filter, httpService, $http, AuthTokenFactory) {
        var vm = this;

        vm.gateway = [];
        vm.sensor = [];
        vm.sensor_th = "";

        vm.t_gauge = {};
        vm.h_gauge = {};
        vm.th_line = {};

        vm.th_data = null;

        vm.startTime = 60 * 60;
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

                                    httpService.getSensor(page, size, sort, 'S1', gatewayMac, token)
                                        .success(function (resp) {
                                            // console.log(resp);
                                            if (resp.data.length > 0) {
                                                vm.sensor = resp.data[0];
                                                resp.data[0].selected = true;
                                                loadGaugeData();
                                                loadTH_lineData();
                                            } else {
                                                vm.sensor = [];
                                                loadGaugeData();
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
                    vm.startTime = 60 * 60;
                    vm.endTime = 0;
                    break;
                case 2:
                    vm.startTime = nowTime - Math.floor(Date.parse(new Date(new Date().format('yyyy/MM/dd'))) / 1000);
                    vm.endTime = 0;
                    break;
                case 3:
                    vm.startTime = 2 * oneDayTime;
                    vm.endTime = oneDayTime;
                    break;
                case 4:
                    vm.startTime = 7 * oneDayTime;
                    vm.endTime = 0;
                    break;
                case 5:
                    vm.startTime = 14 * oneDayTime;
                    vm.endTime = 0;
                    break;
                case 6:
                    vm.startTime = 30 * oneDayTime;
                    vm.endTime = 0;
                    break;
            }
            $('input[name="datefilter"]').val('yyyy-mm-dd to yyyy-mm-dd');
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
        vm.selectSensor = function (item, $data) {
            vm.sensor = item;

            angular.forEach($data, function (data) {
                data.selected = false;
                if (data.uuid == item.uuid) {
                    data.selected = true;
                }
            });
            loadGaugeData();
            loadTH_lineData();
        }

        // 指定图表的配置项和数据
        vm.t_gauge = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            // toolbox: {
            //     show: true,
            //     feature: {
            //         mark: {
            //             show: true
            //         },
            //         restore: {
            //             show: true
            //         },
            //         saveAsImage: {
            //             show: true
            //         }
            //     }
            // },
            dataLoaded: true,
            series: [{
                name: 'Temperature',
                type: 'gauge',
                min: -40,
                max: 80,
                splitNumber: 10,
                radius: '95%',
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            // [0.09, 'lime'],
                            // [0.82, '#1e90ff'],
                            // [1, '#ff4500']
                            [0.09, 'rgba(255, 255, 255, 0.54)'],
                            [0.82, 'rgba(255, 255, 255, 0.54)'],
                            [1, 'rgba(255, 255, 255, 0.54)']
                        ],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: { // 坐标轴小标记
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: { // 坐标轴小标记
                    length: 15, // 属性length控制线长
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: { // 分隔线
                    length: 25, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: { // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    width: 70,
                    height: 35,
                    // backgroundColor: 'rgba(30,144,255,0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.54)',
                    borderWidth: 0.5,
                    borderColor: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 2.5,
                    offsetCenter: [0, '80%'], // x, y，单位px
                    formatter: function (value) {
                        return value.toFixed(2) + "°C";
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 16
                    }
                },
                data: [{
                    value: 0,
                    name: '°C'
                }]
            }]
        };

        vm.h_gauge = {
            tooltip: {
                formatter: "{a} <br/>{c} {b}"
            },
            series: [{
                name: 'Humidity',
                type: 'gauge',
                min: 0,
                max: 100,
                splitNumber: 10,
                radius: '95%',
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            // [0.09, 'lime'],
                            // [0.82, '#1e90ff'],
                            // [1, '#ff4500']
                            [0.09, 'rgba(255, 255, 255, 0.54)'],
                            [0.82, 'rgba(255, 255, 255, 0.54)'],
                            [1, 'rgba(255, 255, 255, 0.54)']
                        ],
                        width: 3,
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisLabel: { // 坐标轴小标记
                    textStyle: { // 属性lineStyle控制线条样式
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                axisTick: { // 坐标轴小标记
                    length: 15, // 属性length控制线长
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: 'auto',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                splitLine: { // 分隔线
                    length: 25, // 属性length控制线长
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 3,
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                pointer: { // 分隔线
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 5
                },
                title: {
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    }
                },
                detail: {
                    width: 70,
                    height: 35,
                    // backgroundColor: '#FBA92F',
                    backgroundColor: 'rgba(255, 255, 255, 0.54)',
                    borderWidth: 0.5,
                    borderColor: '#fff',
                    shadowColor: '#fff', //默认透明
                    shadowBlur: 2.5,
                    offsetCenter: [0, '80%'], // x, y，单位px
                    formatter: function (value) {
                        return value.toFixed(2) + "%";
                    },
                    textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        color: '#fff',
                        fontSize: 16
                    }
                },
                data: [{
                    value: 0,
                    name: '%RH'
                }]
            }]
        };

        vm.th_line = {
            // title: {
            //     text: 'Temperature and humidity sensor',
            //     textAlign:'center',
            //     top:12,
            //     left:'40%',
            //     textStyle:{
            //         color:'#fff'
            //     }
            // },
            textStyle: {
                color: "#fff"
            },
            // toolbox: {
            //     show: true,
            //     feature: {
            //         mark: {
            //             show: true
            //         },
            //         restore: {
            //             show: true
            //         },
            //         saveAsImage: {
            //             show: true
            //         }
            //     }
            // },
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
                    x: 38,
                    y: 0,
                    width: '92%',
                    height: '40%'
                },
                {
                    x: 38,
                    y: '50%',
                    width: '92%',
                    height: '40%'
                },
            ],
            xAxis: [{
                    show: false,
                    gridIndex: 0,
                    splitNumber: 10,
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        formatter: function (value, index) {
                            // 格式化成月/日，只在第一个刻度显示年份
                            // var date = new Date(value);
                            // console.log(date);
                            // var texts = [(date.getMonth() + 1), date.getDate()];
                            // if (index === 0) {
                            //     texts.unshift(date.getYear());
                            // }
                            // return texts.join('/');
                            return "wsl ";
                        }
                    }
                },
                {
                    gridIndex: 1,
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis: [{
                    gridIndex: 0,
                    // scale:true,
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: true,
                        lineStyle: {
                            // 使用深浅的间隔色
                            type: 'dashed',
                            color: 'rgba(255,255,255,0.24)'
                        }
                    }
                },
                {
                    gridIndex: 1,
                    scale: true,
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
                    name: 'Temperature',
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
                },
                {
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    name: 'Humidity',
                    type: 'line',
                    showSymbol: false,
                    animation: false, // 关闭动画
                    hoverAnimation: false,
                    itemStyle: {
                        normal: {
                            color: '#FBA92F'
                        } // 自定义线条颜色
                    },
                    data: []
                }
            ]
        };

        $scope.GAUGE_1 = echarts.init(document.getElementById("GAUGE_1"));
        $scope.GAUGE_2 = echarts.init(document.getElementById("GAUGE_2"));
        $scope.LINE_1 = echarts.init(document.getElementById('LINE_1'));
        if (window.innerWidth <= 1024) {
            vm.t_gauge.series[0].title.textStyle.fontSize = 15;
            vm.h_gauge.series[0].title.textStyle.fontSize = 14;
        }
        //初始化，颜色为灰色
        $scope.LINE_1.setOption(vm.th_line);
        $scope.GAUGE_1.setOption(vm.t_gauge);
        $scope.GAUGE_2.setOption(vm.h_gauge);

        function setChart(allData) {
            if (!angular.equals({}, allData["t_gauge"])) {
                vm.t_gauge.series[0].data[0].value = allData["t_gauge"];
                //设置有数据的指针仪表盘颜色
                vm.t_gauge.series[0].axisLine.lineStyle.color[0][1] = "lime";
                vm.t_gauge.series[0].axisLine.lineStyle.color[1][1] = "#1e90ff";
                vm.t_gauge.series[0].axisLine.lineStyle.color[2][1] = "#ff4500";
                vm.t_gauge.series[0].detail.backgroundColor = "rgba(30,144,255,0.8)";

                $scope.GAUGE_1.setOption(vm.t_gauge);
            }
            if (angular.equals({}, allData["t_gauge"])) {
                vm.t_gauge.series[0].data[0].value = 0;
                //重置
                vm.t_gauge.series[0].axisLine.lineStyle.color[0][1] = "rgba(255, 255, 255, 0.54)";
                vm.t_gauge.series[0].axisLine.lineStyle.color[1][1] = "rgba(255, 255, 255, 0.54)";
                vm.t_gauge.series[0].axisLine.lineStyle.color[2][1] = "rgba(255, 255, 255, 0.54)";
                vm.t_gauge.series[0].detail.backgroundColor = "rgba(255, 255, 255, 0.54)";

                $scope.GAUGE_1.setOption(vm.t_gauge);
            }
            if (!angular.equals({}, allData["h_gauge"])) {
                vm.h_gauge.series[0].data[0].value = allData["h_gauge"];
                //设置有数据的指针仪表盘颜色
                vm.h_gauge.series[0].axisLine.lineStyle.color[0][1] = "lime";
                vm.h_gauge.series[0].axisLine.lineStyle.color[1][1] = "#1e90ff";
                vm.h_gauge.series[0].axisLine.lineStyle.color[2][1] = "#ff4500";
                vm.h_gauge.series[0].detail.backgroundColor = "#FBA92F";

                $scope.GAUGE_2.setOption(vm.h_gauge);
            }
            if (angular.equals({}, allData["h_gauge"])) {
                vm.h_gauge.series[0].data[0].value = 0;
                //重置
                vm.h_gauge.series[0].axisLine.lineStyle.color[0][1] = "rgba(255, 255, 255, 0.54)";
                vm.h_gauge.series[0].axisLine.lineStyle.color[1][1] = "rgba(255, 255, 255, 0.54)";
                vm.h_gauge.series[0].axisLine.lineStyle.color[2][1] = "rgba(255, 255, 255, 0.54)";
                vm.h_gauge.series[0].detail.backgroundColor = "rgba(255, 255, 255, 0.54)";

                $scope.GAUGE_2.setOption(vm.h_gauge);
            }
        }

        function setTH_line(data) {
            // console.log(data);
            if (!data) {
                $scope.LINE_1.setOption({
                    series: [{
                        data: []
                    }, {
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
                            name: "temperature",
                            value: [time, t]
                        });
                    }
                    if (h != null) {
                        h = h.toFixed(2);
                        h_line.push({
                            name: "humidity",
                            value: [time, h]
                        });
                    }
                    
                }

                var arrAll = [];
                arrAll['t_line'] = t_line;
                arrAll['h_line'] = h_line;
                // console.log(arrAll);
                $scope.LINE_1.setOption({
                    series: [{
                        data: arrAll["t_line"]
                    }, {
                        data: arrAll["h_line"]
                    }]
                });
            }

        }

 
        $scope.sil1 = null;
        $scope.sil2 = null;
        var loadGaugeData = function () {
            var page = 0;
            var size = 100;
            var sort = "";
            var token = AuthTokenFactory.getToken();
            if (vm.sensor.mac) {
                httpService.getOneSensor(page, size, sort, 'S1', vm.gateway.mac, vm.sensor.mac, token)
                    .success(function (resp) {
                        // console.log(resp);
                        if (resp.data.length > 0) {
                            vm.sensor_th = resp.data[0];
                            var allData = analysisGaugeData(vm.sensor_th);
                            setChart(allData);
                        } else {
                            vm.sensor_th = "";
                            var allData = analysisGaugeData(vm.sensor_th);
                            setChart(allData);
                        }
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            } else {
                vm.sensor_th = "";
                var allData = analysisGaugeData(vm.sensor_th);
                setChart(allData);
            }

        };

        var loadTH_lineData = function () {
            if (vm.sensor.mac) {
                var token = AuthTokenFactory.getToken();
                httpService.getMinewdbData(vm.gateway.mac, vm.sensor.mac, vm.startTime, vm.endTime, token)
                    .success(function (resp) {
                        // console.log(resp);
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

        $scope.sil1 = $interval(loadGaugeData, 5 * 1000);
        $scope.sil2 = $interval(loadTH_lineData, 5 * 1000);

        window.onresize = function () { //当窗口大小变化时
            $scope.LINE_1.resize();
            $scope.GAUGE_1.resize();
            $scope.GAUGE_2.resize();
        };

        /* 时间日历控件 */
        $('input[name="datefilter"]').daterangepicker({
            autoUpdateInput: false,
            cancelClass: '',
            locale: {
                cancelLabel: 'Clear'
            }
        });
        /* apply */
        $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
            // console.log(picker.startDate._d);
            // console.log(picker.endDate._d);
            var nowTime = Math.floor(new Date().getTime() / 1000);
            vm.startTime = nowTime - (Math.floor(Date.parse(new Date(picker.startDate.format('MM/DD/YYYY'))) / 1000) - 1);
            vm.endTime = nowTime - (Math.floor(Date.parse(new Date(picker.endDate.format('MM/DD/YYYY'))) / 1000) + 86400);
            $(this).val(picker.startDate.format('MM/DD/YYYY') + ' to ' + picker.endDate.format('MM/DD/YYYY'));
            $(this).removeClass('wsl-input');
            var div = $('#selectTime').find("a");
            for (var i = 0; i < div.length; i++) {
                $(div[i]).addClass("wsl-label-default-color");
                $(div[i]).removeClass("wsl-label-active-color");
            }

            loadTH_lineData();
        });
        /* clear */
        $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
            $(this).val('yyyy-mm-dd to yyyy-mm-dd');
        });

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sil1);
            $interval.cancel($scope.sil2);
        });

    }
})();