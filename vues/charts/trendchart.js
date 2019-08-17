(function(){

    let _echartsOptions = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: false,
            top: '0',
            right: '0',
            //data: ['Fakes', 'Rights'] //!!!should be populated from model
        },
        grid: {
            left: '10px',
            right: '20px',
            bottom: '10px',
            top: '10px',
            containLabel: true
        },
        toolbox: {
            feature: {
                //saveAsImage: {}
            }
        },
        xAxis: {
            //type: 'category',     //!!!should be configured via viewModel
            //boundaryGap: false,   //!!!should be configured via viewModel
            axisLabel: {
                color: 'rgba(51,51,51,.4)',
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#EAEAEA'
                }
            },
            //data: ['03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10']     //!!!should be populated from model
        },
        yAxis: {
            //type: 'value',        //!!!should be configured via viewModel
            axisLabel: {
                color: 'rgba(51,51,51,.4)',
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#EAEAEA',
                }
            }
        },
    };

    let _baseSeriesOptions = {
        type: 'line',
        smooth: true,
        symbolSize: 4,
        lineStyle: {
            normal: {
                //color: 'rgb(114,144,242)',        //!!!according to settings come with model data
                width: 2,
            },
        },
        itemStyle: {
            normal: {
                //color: 'rgb(114,144,242)',        //!!!according to settings come with model data
            },
            emphasis: {
                //color: 'rgb(114,144,242)',        //!!!according to settings come with model data
                borderColor: '#fff'
            }
        },
    };

    let _makeSeriesOptions = function(series){
        return _.merge({}, _baseSeriesOptions, {
            name: series.name,
            data: series.data,
            lineStyle : {
                normal: {
                    color: series.color
                }
            },
            itemStyle: {
                normal: {
                    color: series.color
                },
                emphasis: {
                    color: series.color
                }
            }
        });
    };

    let _makeChartOptions = function(model, viewModel, locale){
        let sropts = [];
        let legend = [];
        
        if ((true !== wna.IsNullOrEmpty(model)) && (true !== wna.IsNullOrEmpty(model.series))){
            legend = _.map(model.series, (s) => {
                sropts.push(_makeSeriesOptions(s));
                return s.name;
            });
        }
        let opts = _.merge({}, _echartsOptions, viewModel.xAxis, viewModel.yAxis, {
            legend: {
                data: legend
            },
            series: sropts,
            xAxis: {
                data: ((true !== wna.IsNullOrEmpty(model)) && (true !== wna.IsNullOrEmpty(model.x))) ? model.x : []
            }
        });

        console.log('------- trend chart options: ', opts);
        return opts;
    };

    /*
        model = {
            x: [], //will be copied to opts.xAxis.data,
            series: [
                {
                    color: '',
                    name: 'Apple',
                    data: []
                },
                {
                    color: '',
                    name: 'Banana',
                    data: []
                }
            ]
        }

        viewModel = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
            }
        }
     */
    Vue.component('vc-trend-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-trend">
                    <!--
                    <div class="trendbox" ref="trendbox" v-if="(true !== wna.IsNullOrEmpty(model))"></div>
                    <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    //-->
                    <div class="trendbox" ref="trendbox">
                        <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    </div>
                </div>
            </div>
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    trendChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                    thisvue.viewState.trendChart.setOption(chartopts, true);
                }
            }
        },
        mounted: function(){
            let thisvue = this;
            console.log('-------- trend-chart mounted');

            /*
            if (true === wna.IsNullOrEmpty(thisvue.model)){
                return;
            }
            */
            let trendchart = echarts.init(thisvue.$refs.trendbox);

            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            trendchart.setOption(chartopts);

            thisvue.viewState.trendChart = trendchart;
            
            $(window).resize(function () {
                trendchart.resize();
            });

            
        }

    });
})();