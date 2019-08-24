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
(function(){
    let _echartsOptions = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            show: true,
            orient: 'vertical',
            //data: ['A', 'B', 'C', 'D', 'E'],      //!!! should be populated from model
            formatter: '{name}',
            itemWidth: 10,
            itemHeight: 10,
            verticalAlign: 'middle',
            align: 'left',
            right: 6,
            top: 'middle'
        },
        series: [
            {
                //name: 'TEst',                     //!!! should be populated from model
                type: 'pie',
                center: ['28%', '50%'],
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        rich: {
                            totalCount: {
                                color: 'black',
                                fontSize: 20,
                                fontWeight: 'bold'
                            },
                            caption: {
                                color: '#323759',
                                fontSize: 14,
                                fontWeight: 'normal'
                            }
                        }
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '15',
                            fontWeight: 'bold'
                        },
                        //formatter: "{d}%\n__CAPTION_TOTAL__: __TOTAL__"     //!!! should replace the placeholders (caption_total, total) with actual values
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    /*
                    { value: 335, name: 'A' },
                    { value: 310, name: 'B' },
                    { value: 234, name: 'C' },
                    { value: 135, name: 'D' },
                    { value: 1548, name: 'E' }
                    */
                ]
            }
        ],
        color: ['#F47373', '#7290F2', '#24CCB8', '#8D7CED', '#F49256', '#F4C36F',  '#CED2EB', '#E8EAF6']
    };

    /*
        model = {
            'A': valueA,
            'B': valueB,
            ...
        }
        viewModel = {

        }
     */
    let _makeChartOptions = function(model, viewModel, locale){
        let chartdata = [];
        let legends = [];
        let values = [];
        let total = null;

        let opts = {};

        if (true !== wna.IsNullOrEmpty(model)){
            values = _.values(model);
            legends = _.keys(model);

            total = _.sum(values);
        }

        opts = _.merge({}, _echartsOptions, {
            legend: {
                data: legends
            }
        });

        _.merge(opts.series[0], {
            name: locale.title,
            label: {
                /*
                emphasis: {
                    formatter: "{d}%\n" + locale.total + ":" + total
                }
                */
               normal: {
                   formatter: "{totalCount|" + total + "}\n{caption|" + locale.total + "}"
               }
            },
            data: _.map(legends, (n, i) => {
                return {name: n, value: values[i]};
            })
        });
        //console.log('-------------------- pie chart options: ', opts);

        return opts;
    };

    Vue.component('vc-pie-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-pie">
                    <span v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</span>
                    <div class="piebox" ref="piebox">
                    </div>
                </div>
            </div>								
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    pieChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    if (true !== wna.IsNullOrUndefined(thisvue.viewState.pieChart)){
                        let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                        thisvue.viewState.pieChart.setOption(chartopts, true);
                    }
                }
            }
        },
        mounted: function(){
            let thisvue = this;
                        
            let piechart = echarts.init(thisvue.$refs.piebox);
            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            //console.log('-------------------- pie chart options: ', chartopts, thisvue.model);

            piechart.setOption(chartopts);
            thisvue.viewState.pieChart = piechart;

            $(window).resize(function () {
                piechart.resize();
            });
        }

    });
})();
(function(){
    let _echartsOptions = {
        //color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',                     //!!! may be configured via viewModel
                //boundaryGap: false,                   
                axisLabel: {
                    color: 'rgba(51,51,51,.4)',
                },
                axisTick: {
                    //show: false,
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#EAEAEA'
                    }
                },
                //data: ['京东', '考拉', '淘宝', '天猫'],       //!!! should be loaded from model
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    color: 'rgba(51,51,51,.4)',
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#EAEAEA',
                    }
                }
            }
        ],
        series: [                           //!!! should be loaded from model
            /* 
            {
                name: '低',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '中',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '中高',
                type: 'bar',
                barWidth: '10%',
                data: [10, 52, 200, 334],
            },
            {
                name: '高',
                type: 'bar',
                barGap: '100%',
                barWidth: '10%',
                data: [30, 72, 230, 334],
            }
            */
        ],
        color: ['#C7CBE8', '#7290F2', '#24CCB8', '#F47373']
        //color: ['#7290F2', '#F47373', '#7290F2', '#F49256', '#F4C36F', '#8D7CED', '#CED2EB', '#D9D9D9']
    };

    /*
        model: {
            categories: ['JD', 'TB', ...],
            series: [
                {
                    name: '低',
                    data: []
                },
                {
                    name: '中',
                    data: []
                }
            ]
        }
     */
    let _makeChartOptions = function(model, viewModel, locale){
        let legends = [];
        let series = [];
        let opts = {};

        if (true !== wna.IsNullOrEmpty(model)){
            series = _.map(model.series, (val) => {
                legends.push(val.name);
                return _.merge(val, {
                    type: 'bar',
                    barGap: '100%',
                    barWidth: '10%',
                });
            });
        }

        opts = _.merge(opts, _echartsOptions, {
            series: series,
            legend: {
                data: legends,
                itemWidth: 10,
                itemHeight: 10,
                left: 'left'
            }
        });

        opts.xAxis[0].data = (true !== wna.IsNullOrEmpty(model)) ? model.categories : [];
        return opts;
    };

    Vue.component('vc-bar-chart', {
        template: `
        <div>
            <div class="chartbox">
                <div class="charttitle">
                    <h3>{{locale.title}}</h3>
                </div>
                <div class="chart-bar">
                    <div v-if="(true === wna.IsNullOrEmpty(model))">{{locale.common.empty}}</div>
                    <div class="barbox" ref="barbox""></div>
                </div>
            </div>
        </div>
        `,
        props: ['model', 'viewModel', 'locale'],
        data: function(){
            return {
                viewState: {
                    barChart: null
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    if (true !== wna.IsNullOrUndefined(thisvue.viewState.barChart)){
                        let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
                        thisvue.viewState.barChart.setOption(chartopts, true);
                    }
                }
            }
        },
        mounted: function(){
            let thisvue = this;
            let barchart = echarts.init(thisvue.$refs.barbox);

            let chartopts = _makeChartOptions(thisvue.model, thisvue.viewModel, thisvue.locale);
            //console.log('-------------------- bar chart options: ', chartopts, thisvue.model);
            barchart.setOption(chartopts);

            thisvue.viewState.barChart = barchart;

            $(window).resize(function () {
                barchart.resize();
            });
        }
    });
})();
var Helpers = (function (){
    return {
        toDateTimeString: function(value){
            return (true !== wna.IsNullOrEmpty(value)) ? moment(value).utc().format('YYYY/MM/DD HH:mm:ss') : value;
        }
    }    
})();

/*
 *  model = [
        {
            id: null //or the the unique id within the entire tree of the instance
            title: {
                cn: '选项',
                en: 'item',
                zh: '選項'
            },
            target: null //or the id of the associated action
            submenu: [
                //list of sidemenu model
            ]
        }
    ]
 */
(function(){
    Vue.component('vc-vertmenu', {
        template: `
            <ul v-if="(true !== wna.IsNullOrEmpty(model))">
                <li v-for="en in model">
                    <span class="sidebar-icon" v-bind:class="en.id" v-if="(true === wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</span>
                    <router-link class="sidebar-icon" v-bind:class="en.id" v-bind:to="'/' + en.target" v-if="(true === wna.IsNullOrEmpty(en.submenu)) &&  (true !== wna.IsNullOrUndefined(en.target))">{{locale[en.id]}}</router-link>
                    <vc-vertmenu v-if="(true !== wna.IsNullOrEmpty(en.submenu))" :model="en.submenu" :locale="locale"></vc-vertmenu>
                </li>
            </ul>
        `,
        props: ['model', 'locale']
    });
})();
(function(){
    Vue.component('vc-tablix', {
        template: `
            <table :id="id" class="table table-striped" v-if="true !== wna.IsNullOrEmpty(viewModel.cols)">
                <thead>
                    <tr>
                        <td v-if="true === viewModel.multiselect">
                            <!--
                            <input type="checkbox" ref="checkall" :id="'tablix_checkall_' + id" v-on:change="onCheckAllChange" /><label :for="'tablix_checkall_' + id">&nbsp;</label>
                            //-->
                        </td>
                        <td v-for="c in viewModel.cols" v-on:click="onSort(c.fieldid)"><span>{{locale.fields[c.fieldid]}}</span><div class="sortable-col-head-icon">&nbsp;</div></td>
                    </tr>
                </thead>
                <tbody id="" v-if="(true !== wna.IsNullOrEmpty(model))">
                    <tr v-for="(r, i) in _.slice(sortedModel, pageStartIndex, pageEndIndex)">
                    <!-- //-->
                        <td v-if="true === viewModel.multiselect"><input type="checkbox" :ref="rowId(i)" :id="rowId(i)" :value="r[viewModel.primaryKey]" v-model="viewState.selectedRows" ><label :for="rowId(i)">&nbsp;</label></td>
                        <td v-for="c in viewModel.cols" v-html="(true === wna.IsFunction(c.transform)) ? (c.transform(r[c.fieldid], r)) : (r[c.fieldid])"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td :colspan="((true === viewModel.selectable) || (true === viewModel.multiselect)) ? viewModel.cols.length + 1: viewModel.cols.length">
                            <div>
                                <div class="total">{{locale.total_head}} {{ (true !== wna.IsNullOrEmpty(model)) ? model.length : '0' }} {{locale.total_tail}}</div>
                                <div class="paginator" v-if="(true !== wna.IsNullOrUndefined(viewState.totalPages)) && (viewState.totalPages > 1)">
                                    <button name="pagefrst" v-on:click="onPageChange(0)"></button>
                                    <button name="pageprev" v-on:click="onPageChange(null, -1)"></button>
                                    <button name="pagejump" v-on:click="onPageChange(j)" v-for="j in pageJumps" :disabled="(true === wna.IsNullOrUndefined(j))" v-bind:class="[(j === viewState.currentPage) ? 'active' : '']">{{ (true !== wna.IsNullOrUndefined(j)) ? (j + 1) : '...'}}</button> 
                                    <button name="pagenext" v-on:click="onPageChange(null, 1)"></button>
                                    <button name="pagelast" v-on:click="onPageChange(lastPageStartIndex)"></button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    selectedRows: [],
                    currentPage: null,
                    totalPages: 0,
                    needSort: false,
                    sorting: [],
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let vwstate = thisvue.viewState;
                    let vwmodel = thisvue.viewModel;
                    let data = thisvue.model;
        
                    if (true !== wna.IsNullOrUndefined(vwmodel.rowsPerPage)){
                        if (true === wna.IsNullOrEmpty(data)){
                            thisvue.viewState.totalPages = 0;
                            thisvue.viewState.currentPage = null;
                        }else{
                            thisvue.viewState.totalPages = Math.ceil(data.length / vwmodel.rowsPerPage);
                            thisvue.viewState.currentPage = 0;
                        }
                        console.log('###--- Tablix beforeUpdate: re-calculate pagination : ', vwstate.currentPage, vwstate.totalPages);
                    }

                    //new data comes, reset the sorting
                    if (true !== wna.IsNullOrEmpty(vwstate.sorting)){
                        vwstate.sorting.length = 0;
                    }
                    vwstate.needSort = true;
                }
            }
        },
        computed: {
            sortedModel: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;
                let data = thisvue.model;

                if (true === vwstate.needSort){
                    if (true !== wna.IsNullOrEmpty(vwstate.sorting)) {
                        let sort_fields = _.map(vwstate.sorting, 'fieldid');
                        let sort_orders = _.map(vwstate.sorting, 'order');
        
                        _.reverse(sort_fields);
                        _.reverse(sort_orders);
        
                        //console.log('-------- sorting: ', sort_fields, sort_orders);
                        data = _.orderBy(data, sort_fields, sort_orders);
                        console.log('###--- Tablix beforeUpdate: sorting by : ', vwstate.sorting);
                    }else{
                        data = _.orderBy(data, [vwmodel.primaryKey], ['desc']);
                    }

                    vwstate.currentPage = 0;
                    vwstate.needSort = false;
                }


                return data;
            },
            pageStartIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = vwstate.currentPage * vwmodel.rowsPerPage;
                    console.log('------ pageStartIndex: ', ret);
                    return ret;
                }
                return 0;
            },
            pageEndIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = (vwstate.currentPage + 1) * vwmodel.rowsPerPage;
                    console.log('------ pageEndIndex: ', ret);
                    return ret;
                }
                return (thisvue.sortedModel || []).length;
            },
            lastPageStartIndex: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                if (vwstate.totalPages > 1){
                    let ret = (vwstate.totalPages - 1) * vwmodel.rowsPerPage;
                    console.log('------ lastPageStartIndex: ', ret);
                    return ret;
                }
                return 0;
            },
            pageJumps: function(){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let ret;

                do {
                    if (vwstate.totalPages > 5){
                        if (vwstate.currentPage >= vwstate.totalPages - 3){
                            ret = [0, undefined, vwstate.totalPages - 3, vwstate.totalPages - 2, vwstate.totalPages - 1];
                            break;
                        }else {
                            if (vwstate.currentPage > 0){
                                ret = [vwstate.currentPage - 1, vwstate.currentPage, vwstate.currentPage + 1, undefined, vwstate.totalPages -1];
                            }else{
                                ret = [vwstate.currentPage, vwstate.currentPage + 1, vwstate.currentPage + 2, undefined, vwstate.totalPages -1];
                            }
                            break;
                        }
                    }else {
                        //##2019.07.31 - fixes the bug if the number of total pages is less than 5 but the page jumps show 5 pages
                        ret = _.times(thisvue.viewState.totalPages, (i) => i);
                        break;
                    }
                }while(false);

                console.log('------ page jumps: ', ret);
                return ret;
            },
        },
        //### Methods
        methods: {
            rowId: function(i){
                return 'tr_' + this.id + '_' + i;
            },
            onSort: function(fieldid){
                let thisvue = this;
                let vwstate = thisvue.viewState;
 
                /*
                 sorting : [
                     {
                         'fieldid': 'fieldid1',
                         'order': 'desc' //or 'asc'
                     },
                     ...
                 }
                 */
                let sort = _.remove(vwstate.sorting, { fieldid: fieldid });
                if (true !== wna.IsNullOrEmpty(sort)){
                    sort = sort[0];
                    sort.order = ('desc' === sort.order) ? 'asc' : 'desc';
                }else{
                    sort = {
                        fieldid: fieldid,
                        order: 'desc'
                    };
                 }
                
                vwstate.sorting.push(sort);
                vwstate.needSort = true;
            },
            onPageChange: function(index, incr){
                let thisvue = this;
                let vwstate = thisvue.viewState;
 
                if ((true !== wna.IsNullOrUndefined(index)) && (true === wna.IsNumber(index))){
                    if ((index >= 0) && (index < vwstate.totalPages)){
                        vwstate.currentPage = index;
                    }
                }else{
                    if ((true !== wna.IsNullOrUndefined(incr) && (true === wna.IsNumber(incr)))){
                        let target_page = vwstate.currentPage + incr;
                        vwstate.currentPage = (target_page < 0) ? 0 : (target_page >= vwstate.totalPages) ? vwstate.totalPages - 1 : target_page;
                    }
                }

                //reset the row selection after page change
                vwstate.selectedRows.length = 0;
                
                //console.log('----- onPageChange : ', index, incr);
            },
            getCurrentSelectedRows: function(){
                let thisvue = this;
                return _.clone(thisvue.viewState.selectedRows);
            }
        },
        //### Lifecycle Hooks
        mounted: function(){
            
        },
        beforeUpdate: function(){

        }

    });
})();

(function(){
    Vue.component('vc-tablix-with-tools', {
        template: `
            <div :id="id">
                <div class="tabletools">
                    <div class="filtertools" v-if="(true !== wna.IsNullOrEmpty(viewModel.filters))">
                        <div class="toolsgroup" v-for="f in viewModel.filters" >
                            <label>{{locale.fields[f.fieldid]}}</label>
                            <select :name="f.fieldid" v-model="viewState.filters[f.fieldid]" v-on:change="onFilterChange($event, f.fieldid)">
                                <option value='-------'>{{locale.common.option_all}}</option>
                                <option v-for="o in f.options" v-if="(true !== wna.IsNullOrEmpty(o))" :value="o">{{o}}</option>
                            </select>							
                        </div>
                    </div>
                    <div class="toolsgroup buttongroup">
                        <!--
                        <button type="button" v-for="b in viewModel.buttons" v-bind:value="b.id" v-on:click="onButtonClick" v-bind:class="[((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]">{{locale.buttons[b.id]}}</button>
                        //-->
                        <!-- removed from button declaration: v-if="(true === wna.IsNullOrUndefined(b.visibleInTabs)) || (_.includes(b.visibleInTabs, viewState.selectedTab))" //-->
                        <!-- removed from button declaration:  //-->
                        <button type="button" v-for="b in viewModel.buttons" 
                            v-bind:data-toggle="(true !== wna.IsNullOrEmpty(b.toggleModal)) ? 'modal' : ''"
                            v-bind:data-target="(true !== wna.IsNullOrEmpty(b.toggleModal)) ? b.toggleModal : ''"
                            v-bind:value="b.id" v-bind:class="['btn', ((true === wna.IsNullOrEmpty(b.classes)) ? '' : b.classes)]" 
                            v-on:click="onButtonClick($event, b.callback)"
                            v-if="(true === viewModel.shouldActivateButton(b))"><img v-if="true !== wna.IsNullOrEmpty(b.icon)" :src="b.icon" />{{locale.buttons[b.id]}}</button>
                    </div>	
                    <div class="toolsgroup searchgroup" v-if="(true === wna.IsFunction(viewModel.search))">
                        <input type="text" v-model="viewState.searchNeedle" v-bind:placeholder="locale.common.search">
                        <!--
                        <button type="button" v-on:click="onSearch($event, viewModel.search)" class="btn-red">{{locale.common.search}}</button>
                        //-->
                    </div>	
                </div><!--tabletools-->
                <div class="tablecontetnt table-responsive">
                    <vc-tablix ref="tablix" :id="'tablix_core__' + id" :model="activeModel" :view-model="viewModel" :locale="locale" :lang="lang" ></vc-tablix>
                </div>
            </div>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    shouldUpdateActiveModel: false,
                    searchNeedle: '',
                    filters: {}
                }
            };
        },
        watch: {
            'viewState.searchNeedle': function(){
                this.viewState.shouldUpdateActiveModel = true;
                console.log('----------- searchNeedle change: ', this.viewState.searchNeedle);
            }
        },
        computed: {
            activeModel: function(){
                //activeModel represents the current displayed data which is filtered from the original model
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let vwmodel = thisvue.viewModel;

                let needle = vwstate.searchNeedle;
                let ret = thisvue.model;
                
                //console.log('###--- Tablix beforeUpdate: re-calculate pagination : ', vwstate.currentPage, vwstate.totalPages);
                //console.log('------ computing activeModel 1: ', thisvue.viewState.selectedTab, ret, this.viewState.filters[thisvue.viewState.selectedTab]);

                console.log('------------ re-compute activeModel...');

                if (true === vwstate.shouldUpdateActiveModel){
                    if (true !== wna.IsNullOrEmpty(ret)){
                        if (true !== wna.IsNullOrEmpty(vwstate.filters)){
                            let filters = {};
                            _.each(vwstate.filters, function(val, key){
                                if ('-------' !== val){
                                    filters[key] = val;
                                }
                            });

                            ret = _.filter(ret, filters);
                            filters = null;
                        }
                    }

                    if ((true !== wna.IsNullOrEmpty(needle)) && (true === wna.IsFunction(vwmodel.search))){
                        ret = vwmodel.search(needle, ret);
                    }

                    vwstate.shouldUpdateActiveModel = false;
                }
                
                return ret;
            },
        },
        //### Methods
        methods: {
            onFilterChange: function (ev, fieldid) {
                let thisvue = this;
                let vwstate = thisvue.viewState;
                //let filtersForCurrentTab = vwstate.filters[vwstate.selectedTab];
                vwstate.shouldUpdateActiveModel = true;
                console.log('###-- Tablix-with-tools: filter change:', vwstate.filters[vwstate.selectedTab]);
            },
            onButtonClick: function (ev, callback) {
                //console.log('###-- Tablix-with-tools: onButtonClick: ', $(ev.target), $(ev.target).attr('data-toggle'), wna.IsNullOrEmpty($(ev.target).attr('data-toggle')));
                let btn_toggle = ($(ev.target).attr('data-toggle') || '');
                if ((true !== wna.IsNullOrEmpty(String.prototype.trim.call(btn_toggle)))) {
                    //console.log('###-- Tablix-with-tools:  modal toggle button, exit');
                    return;
                }
                //console.log('###-- Tablix-with-tools: invoke button callback...');
                ev.stopPropagation();

                let thisvue = this;
                let vwstate = thisvue.viewState;
                let filters = _.mapValues(vwstate.filters, function (val, key) {
                    if ('-------' === val) {
                        return '';
                    }
                    return val;
                });
                let selectedRows = [];
                if (true !== wna.IsNullOrEmpty(thisvue.$refs.tablix)) {
                    selectedRows = thisvue.$refs.tablix.getCurrentSelectedRows();
                }
                $(thisvue.$el).fire('tools-button-clicked', {
                    target: ev.target,
                    callback: callback,
                    searchNeedle: vwstate.searchNeedle,
                    selectedRows: selectedRows,
                    filters: filters
                });
            },
        },
        //### Lifecycle Hooks
        beforeMount: function(){
            let thisvue = this;
            let vwstate = thisvue.viewState;
            let vwmodel = thisvue.viewModel;

            //init the filters to default value
            if (true !== wna.IsNullOrEmpty(vwmodel.filters)){
                let filterkeys = _.map(vwmodel.filters, 'fieldid');
                let numfilters = (filterkeys || []).length;
                let filtervals = _.times(numfilters, _.constant('-------'));
                let defaultfilters = _.zipObject(filterkeys, filtervals);
                
                vwstate.filters = defaultfilters;
            }
            else{
                vwstate.filters = {};
            }
        },
        mounted: function(){

        },
        beforeUpdate: function(){
            
        }

    });
})();

(function(){
    const _DEFAULT_TAB_ = '___default___';

    Vue.component('vc-tableview2', {
        template: `
            <div :id="id" class="main-panelbody">
                <div class="main-panelhead">
                    <h2>{{locale.section_details}}</h2>
                </div>
                <div class="tabswrap" v-if="(true !== wna.IsNullOrEmpty(viewModel.tabs)) && (true !== wna.IsNullOrEmpty(locale)) && (true !== wna.IsNullOrEmpty(locale.tabs))">
                    <ul>
                        <li v-for="(t, i) in viewModel.tabs" v-bind:class="[ (t.id === viewState.selectedTab) ? 'activetab' : '' ]" v-bind:name="t.id">
                            <button type="button" v-bind:value="t.id" v-on:click="onSelectTab($event, t.id, t.filter)">
                                <span>{{ locale.tabs[t.id] }}</span>
                                <span class="tabsnum">{{ (true !== wna.IsNullOrEmpty(viewState.model4Tab[t.id])) ? viewState.model4Tab[t.id].length : '' }}</span>
                            </button>
                        </li>
                    </ul>
                </div><!--tabswrap-->
                <vc-tablix-with-tools :id="'tablix_with_tools__' + id" :model="viewState.model4Tab[viewState.selectedTab]" :view-model="viewModel" :locale="locale" v-on:tools-button-clicked.native="onTablixToolsButtonClicked"></vc-tablix-with-tools>
            </div>
        `,
        props: ['id', 'model', 'viewModel', 'locale', 'lang'],
        data: function(){
            return {
                viewState: {
                    selectedTab: null,
                    model4Tab: {}
                }
            };
        },
        watch: {
            'model': {
                deep: true,
                handler: function(){
                    let thisvue = this;
                    let vwstate = thisvue.viewState;
                    let vwmodel = thisvue.viewModel;
    
                    if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                        let tabs = vwmodel.tabs;
                        _.each(tabs, function(t){
                            if (true !== wna.IsNullOrEmpty(t)){
                                try{
                                    let tabmodel = null;
                                    if (true === wna.IsFunction(t.filter)){
                                        tabmodel = t.filter(thisvue.model);
                                    }else{
                                        tabmodel = _.filter(thisvue.model, t.filter);
                                    }
                                    
                                    vwstate.model4Tab[t.id] = (true !== wna.IsNullOrEmpty(tabmodel)) ? tabmodel : [];
                                }catch(ex) {
                                    vwstate.model4Tab[t.id] = null;
                                }
                            }
                        });
                    }else{
                        vwstate.model4Tab[_DEFAULT_TAB_] = thisvue.model;
                    }

                    console.log('----- Tableview2 model-changed: computed model4Tab: ', vwstate.model4Tab);
                }
            }
        },
        computed: {
        },
        //### Methods
        methods: {
            onSelectTab: function(ev, tabid, filter){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                vwstate.selectedTab = tabid;

                console.log('-------- onSelectTab: ', tabid);
                thisvue.$emit('tab-change', tabid);
                //$(thisvue.$el).fire('tab-change', { tabid: tabid });
            },
            onTablixToolsButtonClicked: function(ev){
                let thisvue = this;
                let vwstate = thisvue.viewState;
                let tabid = vwstate.selectedTab;

                ev.stopPropagation();
                //console.log('-------- tableview2 - onTablixToolsButtonClicked: ', tabid, ev.detail);
                $(thisvue.$el).fire('tools-button-clicked', _.extend({}, ev.detail, { tabid: tabid }));
            }
        },
        //### Lifecycle Hooks
        beforeMount: function(){
            let thisvue = this;
            let vwstate = thisvue.viewState;
            let vwmodel = thisvue.viewModel;
            let tabid = _DEFAULT_TAB_;

            if (true !== wna.IsNullOrEmpty(vwmodel.tabs)){
                let defaultTab = _.find(vwmodel.tabs, { 'default' : true });
                tabid = (true !== wna.IsNullOrUndefined(defaultTab)) ? defaultTab.id : null;
            }

            //extend the vwmodel to provide delegate method for child components
            vwmodel.shouldActivateButton = (function(v){
                return function(button){
                    if (true !== wna.IsNullOrEmpty(button)){
                        if (true === wna.IsNullOrEmpty(button.visibleInTabs)){
                            return true;
                        }
                        return _.includes(button.visibleInTabs, v.viewState.selectedTab);
                    }
                }
            })(thisvue);

            thisvue.onSelectTab(null, tabid);
        },
        mounted: function(){

        },
        beforeUpdate: function(){
        }
    });
})();

(function(){
    Vue.component('vc-daterange-selector', {
        template: `
        <div class="datetimeselector">
            <span class="datetimespan">{{locale.caption}}</span>
            <input class="datetimeinput" type="text" ref="daterangepicker">
            <button type="button" value="7">{{locale.days7}}</button>
            <button type="button" value="15">{{locale.days15}}</button>
            <button type="button" value="30">{{locale.days30}}</button>
        </div>
        `,
        props: ['locale'],
        data: function(){
            return {
                dateStart: null,
                dateEnd: null,
                $picker: null,
            }
        },
        mounted: function(){
            (function(thisvue, $picker){
                $picker.daterangepicker({
                            locale: {
                                format: 'DD/MM/YYYY'
                            }
                        })
                        .on('cancel.daterangepicker', function(){
                            thisvue.saveDateRange(null);
                        })
                        .on('apply.daterangepicker', function(ev, picker){
                            thisvue.saveDateRange(picker.startDate, picker.endDate);
                        });
      
                $('button[type="button"]', $(thisvue.$el)).on('click', function(ev){
                    let $clicked = $(ev.target);
                    let days = $clicked.val();
                    if (true === wna.IsNullOrUndefined(days)){
                        return;
                    }
                    let end = moment();
                    let start = moment().subtract(days, 'days');

                    
                    $picker.data('daterangepicker').setStartDate(start);
                    $picker.data('daterangepicker').setEndDate(end);
                    thisvue.saveDateRange(start, end);    
                });

                thisvue.$picker = $picker;

                $('button[type="button"][value="7"]').trigger('click'); //trigger initial daterange change event
            })(this, $(this.$refs.daterangepicker));
        },
        methods: {
            saveDateRange: function(start, end){
                let thisvue = this;
                end = (true === wna.IsNullOrEmpty(end)) ? start : end;
                if (true !== wna.IsNullOrEmpty(start)){
                    thisvue.dateStart = start;
                    thisvue.dateEnd = end;
                }else{
                    thisvue.dateStart = null;
                    thisvue.dateEnd = null;
                }

                $(thisvue.$el).fire('change', {start: start, end: end});
            }
        }
    });
})(); 
(function(){
    Vue.component('vc-dateranged-view',{
        template: `
            <div>
                <vc-daterange-selector :locale="sharedLocale.dateranger" :shared-locale="sharedLocale" v-on:change.native="onDateRangeChange"></vc-daterange-selector>
                <div class="main-chart">
                    <slot name="chart" v-bind:daterange="viewState.dateRange" v-bind:class="main-chart"></slot>
                </div>
                <div class="main-table">
                    <slot name="table" v-bind:daterange="viewState.dateRange" v-bind:class="main-table"></slot>
                </div>
            </div>
        `,
        props: ['model', 'locale', 'sharedLocale'],
        data: function(){
            return {
                viewState: {
                    dateRange: {
                        start: null,
                        end: null
                    }
                }
            }
        },
        methods: {
            onDateRangeChange: function(ev){
                let thisvue = this;
                let thisrange = thisvue.viewState.dateRange;

                thisrange.start = moment(ev.detail.start).format('DD/MM/YYYY');
                thisrange.end = moment(ev.detail.end).format('DD/MM/YYYY');

                $(thisvue.$el).fire('daterange-change', ev.detail);
                //console.log('------- onDateRangeChange ', ev.detail);
            }
        }
    });
})();
(function(){
      Vue.component('vc-counterfeit-store', {
        template: `
            <vc-dateranged-view :model="model" :locale="locale" :shared-locale="sharedLocale" v-on:daterange-change.native="onDateRangeChange" v-bind:class="['main-content-body']">
                <template v-slot:chart="slotProps">
                    <div class="main-panelhead">
                        <h2>{{locale.section_chart}}</h2>
                    </div>
                    <div class="main-panelbody">
                        <div class="chartwrap">
                            <div class="chartrow">
                                <div class="chartcol4">
                                    <div class="chartbox">
                                        <div class="chart-1column">
                                            <div class="charttitle">
                                                <h3>{{locale.fakes_shops_count}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL(model.fakes_shops_count, 'N/A') }}</span>
                                            </div>										
                                        </div>
                                    </div>
                                    <div class="chartbox">
                                        <div class="chart-1column">
                                            <div class="charttitle">
                                                <h3>{{locale.fakes_shops_percent}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL2(model.fakes_shops_percent, model.fakes_shops_percent + '%', 'N/A') }}</span>
                                            </div>										
                                        </div>
                                    </div>
                                </div>
                                <vc-trend-chart :model="model.trendChart" :view-model="viewModel.trendChart" :locale="localeForSubview('trendchart')" class="chartcol8"></vc-trend-chart>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-slot:table="slotProps">
                    <vc-tableview2 id="counterfeitStoresTableView" :model="model.tablix_model" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"></vc-tableview>
                </template>
            </vc-dateranged-view>
        `,
        props: ['path', 'locale', 'sharedLocale', 'lang'],
        data: function(){
            return {
                model: {
                    results: [],
                    channel: [],
                    series: [],
                    model: [],
                    all_shops: null,
                    fakes_shops: null,
                    fakes_shops_count: null,
                    fakes_shops_percent: null,
                    all_shops_count: null,
                    trendChart: null,
                    tablix_model: [],
                },
                viewState: {
                    dataState: null, //null, loading, ready, error
                },
                viewModel: {
                    lastViewState: null,
                    tableview: {
                        rowsPerPage: 10,
                        cols: [
                            {
                                fieldid: 'resultid'
                            },
                            {
                                fieldid: 'channel'
                            },
                            {
                                fieldid: 'ShopName'
                            },
                            {
                                fieldid: 'fake_products_count'
                            },
                            {
                                fieldid: 'fake_links_count'
                            },
                            {
                                fieldid: 'succeeded_links'    
                            },/*
                            {
                                fieldid: 'RightsProtectionStartTime',
                                transform:  Helpers.toDateTimeString
                            }*/
                        ],
                        filters: [
                            {
                                fieldid: 'channel',
                                source: 'channels',
                                options: []
                            }   
                        ],
                        search: function(needle, dataset){
                            if ((true !== wna.IsNullOrEmpty(needle)) && (true !== wna.IsNullOrEmpty(dataset))){
                                return _.filter(dataset, function(d){
                                    let shopname = d.ShopName;
                                    return (true !== wna.IsNullOrEmpty(shopname)) ? shopname.contains(needle, true) : false;
                                });
                            }else{
                                return dataset;
                            }
                        },
                        buttons: [
                            {
                                id: 'export',
                                icon: 'assets/icons/icon_export.png',
                                classes: ['btn-red'],
                                callback: function(tabid, filters, searchNeedle){
                                    //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
                                    let thisvue = this; 
                                    let vwmodel = thisvue.viewModel;
                                    let vwstate = thisvue.viewState;

                                    let start_date = moment(vwstate.start_date).format('YYYY-MM-DD 00:00:00');
                                    let end_date = moment(vwstate.end_date).format('YYYY-MM-DD 23:59:59');

                                    searchNeedle = (true === wna.IsNullOrUndefined(searchNeedle)) ? '' : searchNeedle;
                                    filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

                                    let conditions = { filters, searchNeedle, start_date, end_date };

                                    thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
                                    console.log('------ > button(export): clicked!', conditions);
                                }
                            }
                        ]
                    },
                    trendChart:{
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                        },
                        yAxis: {
                            type: 'value',
                        }
                    }
                }
            }
        },
        computed: {
           
        },
        methods: {
            localeForSubview: function(subviewname){
                let ret =  _.extend({ common: this.sharedLocale.common}, this.locale[subviewname]);
                return ret;
            },
            buildBaseModelFromData: function(data){
                let thisvue = this;
                let channels = _.map(data.channel, 'channel');
                let series = _.map(data.series, 'series');
                let models = _.map(data.model, 'model');
                let results = _.map(data.results, function(r){
                    r.ProductDescriptionLong = r.ProductDescription + '_' + r.Skumap;
                    r.DiscriminantTimeShort = moment(r.DiscriminantTime).utc().format('YYYY-MM-DD');
                    r.level_name = (0 === r.DiscriminantResult) ? '假' : '真';
                    return r;
                });
                let total = (true !== wna.IsNullOrEmpty(results)) ? results.length : null;
                let fakes = (true !== wna.IsNullOrUndefined(total)) ?  _.filter(results, {'DiscriminantResult': 0}) : null;
                let reals = (true !== wna.IsNullOrUndefined(total)) ?  _.differenceBy(results, [{'DiscriminantResult': 0}], 'DiscriminantResult') : null;

                let all_shops = _.uniqBy(results, 'ShopName');
                let fakes_shops = _.uniqBy(fakes, 'ShopName');

                let all_shops_count = (true !== wna.IsNullOrUndefined(all_shops)) ? (all_shops || []).length : null;
                let fakes_shops_count = (all_shops_count > 0) ? (fakes_shops || []).length : null;
                let fakes_shops_percent = (all_shops_count) ? ((fakes_shops_count / all_shops_count) * 100.0).toFixed(2) : null;
                

                thisvue.model.models = models;
                thisvue.model.series = series;
                thisvue.model.results = results;
                thisvue.model.channels = channels;

                thisvue.model.fakes = fakes;
                thisvue.model.reals = reals;
                thisvue.model.all_shops = all_shops;
                thisvue.model.fakes_shops = fakes_shops;
                thisvue.model.all_shops_count = all_shops_count;
                thisvue.model.fakes_shops_count = fakes_shops_count;
                thisvue.model.fakes_shops_percent = fakes_shops_percent;
                
            },
            buildSpecificModelFromData: function(){
                let thisvue = this;
                let fakes = thisvue.model.fakes;
                let fakes_group_by_channel = _.groupBy(fakes, 'channel');
                let tablix_model = [];

                let i = 0;
                _.each(fakes_group_by_channel, function(fakes_of_channel, channel){
                    let fakes_of_channel_group_by_shop = _.groupBy(fakes_of_channel, 'ShopName');

                    _.each(fakes_of_channel_group_by_shop, function(fakes_of_shop_of_channel, shop){
                        let distinct_fake_products_count = (_.uniqBy(fakes_of_shop_of_channel, 'ProductDescriptionLong') || []).length;
                        let distinct_fake_products_links = (_.uniqBy(fakes_of_shop_of_channel, 'ProductURL') || []).length;
                        let succeeded_links = (_.uniqBy(_.filter(fakes_of_shop_of_channel, {'RightsProtectionStatus': 4}), 'ProductURL') || []).length;
                        let min_protection_start_time = _.minBy(fakes_of_shop_of_channel, 'RightsProtectionStartTime');

                        tablix_model.push({
                            resultid: ++i,
                            channel: channel,
                            ShopName: shop,
                            fake_products_count: distinct_fake_products_count,
                            fake_links_count: distinct_fake_products_links,
                            succeeded_links: succeeded_links,
                            RightsProtectionStartTime: min_protection_start_time
                        })
                    });
                });

                thisvue.model.fakes_group_by_channel = fakes_group_by_channel;
                thisvue.model.tablix_model = tablix_model;
            },
            buildFilters: function(){
                let thisvue = this;
                let tbviewViewModel = thisvue.viewModel.tableview;
                
                _.each(tbviewViewModel.filters, function(filter_entry){
                    if ((true !== wna.IsNullOrEmpty(filter_entry)) && (true !== wna.IsNullOrEmpty(filter_entry.source))){
                        filter_entry['options'] = thisvue.model[filter_entry.source];
                    }
                });
            },
            buildTrendChartModel: function(){
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;
                let chartseries = [];
                let fakes_group_by_channel = model.fakes_group_by_channel;

                //  1) find all distinct dates for constructing the x-axis
                let dates = _(fakes).map('DiscriminantTimeShort').sortedUniq().value();

                //  2) for each channel, count the fakes shop that grouped by dates
                _.each(fakes_group_by_channel, function(fakes_of_channel, channel){
                    let channel_fakes_shops = _.uniqBy(fakes_of_channel, 'ShopName');
                    let channel_fakes_shops_group_by_dates = _.groupBy(channel_fakes_shops, 'DiscriminantTimeShort');

                    //normalized means filling 0 in missing dates
                    let normalized_channel_fakes_shops_count_group_by_dates = [];
                    _.each(dates, function(d){
                        let channel_fakes_shops_of_date = channel_fakes_shops_group_by_dates[d];
                        let channel_fakes_shops_count_of_date = (channel_fakes_shops_of_date || []).length;

                        normalized_channel_fakes_shops_count_group_by_dates.push(channel_fakes_shops_count_of_date);
                    });
                    chartseries.push({
                        name: channel,
                        data: normalized_channel_fakes_shops_count_group_by_dates
                    });
                });

                let trendChartModel = {
                    x: dates,
                    series: chartseries
                };

                console.log('------- counterfeit store trendChart model: ', trendChartModel);
                thisvue.model.trendChart = trendChartModel;

            },
            onDateRangeChange: function(ev){
                let thisvue = this;
                let hasData = (true !== wna.IsNullOrEmpty(ev.detail));
                let start = (true === hasData) ? ev.detail.start : null;
                let end = (true === hasData) && (null !== start) ? ev.detail.end : null;

                console.log('------- onDateRangeChange >', thisvue.path, ev.detail);
                thisvue.$emit('request-data', thisvue.path, start, end, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },
            onRequestReturned: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                if (true !== wna.IsNullOrEmpty(data)){
                    if (true === data.success){
                        thisvue.buildBaseModelFromData(data.results);
                        thisvue.buildSpecificModelFromData();

                        thisvue.buildFilters();

                        if (true === wna.IsNullOrEmpty(thisvue.model.results)){
                            thisvue.model.trendChart = null;
                            return;
                        }

                        thisvue.buildTrendChartModel();
                    }
                }
            },
            onTableviewToolsButtonClicked: function(ev){
                let thisvue = this;
                
                if (true !== wna.IsNullOrEmpty(ev.detail)){
                    let detail = ev.detail;
                    let btnid = $(detail.target).val();

                    if (true === wna.IsFunction(detail.callback)){
                        let args = [detail.tabid, detail.filters, detail.searchNeedle];
                        detail.callback.apply(thisvue, args);
                    }
                }
            }
        }
    });
})();

(function(){
   
    Vue.component('vc-counterfeit-product',{
        template: `
            <vc-dateranged-view :model="model" :locale="locale" :shared-locale="sharedLocale" v-on:daterange-change.native="onDateRangeChange" v-bind:class="['main-content-body']">
                <template v-slot:chart="slotProps">
                    <div class="main-panelhead">
                        <h2>{{locale.section_chart}}</h2>
                    </div>
                    <div class="main-panelbody">
                        <div class="chartwrap">
                            <div class="chartrow">
                                <div class="chartcol4">
                                    <div class="chartbox">
                                        <div class="chart-2column">
                                            <div class="charttitle">
                                                <h3>{{locale.total_fakes}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL(model.total_fakes, 'N/A') }}</span>
                                            </div>
                                        </div>
                                        <div class="chart-2column chart-2column-r">
                                            <div class="charttitle">
                                                <h3>{{locale.fakes_percent}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL2(model.fakes_percent, model.fakes_percent + '%', 'N/A') }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chartbox">
                                        <div class="chart-1column">
                                            <div class="charttitle">
                                                <h3>{{locale.total_success}}</h3>
                                            </div>
                                            <div class="chart-number">
                                                <span>{{ wna.NVL(model.total_success, 'N/A') }}</span>
                                            </div>										
                                        </div>
                                    </div>
                                </div>
                                <vc-trend-chart :model="model.trendChart" :view-model="viewModel.trendChart" :locale="localeForSubview('trendchart')" class="chartcol8"></vc-trend-chart>
                            </div>
                            <div class="chartrow">
                                <vc-pie-chart :model="model.pieChart" :locale="localeForSubview('piechart')" class="chartcol4"></vc-pie-chart>
                                <vc-bar-chart :model="model.barChart1" :locale="localeForSubview('barchart1')" class="chartcol4"></vc-bar-chart>
                                <vc-bar-chart :model="model.barChart2" :locale="localeForSubview('barchart2')" class="chartcol4"></vc-bar-chart>
                            </div>
                        </div>

                    </div>
                </template>
                <template v-slot:table="slotProps">
                    <vc-tableview2 id="counterfeitProductsTableView" :model="model.results" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"></vc-tableview2>
                <!--
                    <vc-tableview id="counterfeitProductsTablix" :model="model.results" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"></vc-tableview>
                //-->
                </template>
            </vc-dateranged-view>
        `,
        props: ['path', 'locale', 'sharedLocale', 'lang'],
        beforeMount: function(){
            //This will complicate the logic, use local computed property for component-specific locale
            /*
            console.log('------------ before mount: ', this.path, this.model, this.locale);
            this.$emit('registerlocales', {path: this.path, locales: _locales});
            */
        },
        data: function(){
            return {
                model: {
                    results: [],
                    channel: [],
                    series: [],
                    model: [],
                    total_fakes: null,
                    fakes_percent: null,
                    trendChart: null,
                    barChart1: null,
                    barChart2: null,
                    pieChart: null
                },
                viewState: {
                    start_date: null,
                    end_date: null,
                    dataState: null, //null, loading, ready, error
                },
                viewModel: {
                    //lastViewState: null,
                    tableview: {
                        //selectable: true, //single select
                        rowsPerPage: 10,
                        multiselect: true,
                        primaryKey: 'ResultId',
                        tabs: [
                            {
                                id: 'tab_all',
                                filter: null, /*function(dataset){
                                    //console.log('------ > tab_all activated', dataset);
                                    return dataset;
                                },*/
                                default: true
                            },
                            {
                                id: 'tab_pending',
                                filter: { 'RightsProtectionStatus' : 1 }
                                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_pending activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 1 }) : [];
                                }
                                */
                            },
                            {
                                id: 'tab_waiting',
                                filter: { 'RightsProtectionStatus' : 2 }
                                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_waiting activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 2 }) : [];
                                }
                                */
                            },
                            {
                                id: 'tab_progress',
                                filter: { 'RightsProtectionStatus' : 5 }
                                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_progress activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 5 }) : [];
                                }
                                */
                            },
                            {
                                id: 'tab_success',
                                filter: { 'RightsProtectionStatus' : 4 }
                                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_success activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 4 }) : [];
                                }
                                */
                            },
                            {
                                id: 'tab_failed',
                                filter: { 'RightsProtectionStatus' : 3 }
                                /*
                                filter: function(dataset){
                                    //console.log('------ > tab_failed activated', dataset);
                                    return (true !== wna.IsNullOrEmpty(dataset)) ? _.filter(dataset, { 'RightsProtectionStatus' : 3 }) : [];
                                }
                                */
                            }
                        ],
                        cols: [ //the colums that we'd like to display
                            {
                                fieldid: 'ResultId',/*
                                transform: function(value){
                                    //nullable
                                }*/
                            },
                            {
                                fieldid: 'series'
                            },
                            {
                                fieldid: 'model'
                            },
                            {
                                fieldid: 'DiscriminantResult',
                                transform: function(value, entry){
                                    return '<div class="result' + value + '"><span style="margin-right: 6px;">&#9679;</span><span>' + entry.level_name + '</span></div>';
                                }
                            },
                            {
                                fieldid: 'ConfidenceLevelBucketName'
                            },
                            {
                                fieldid: 'ProductDescription',
                                transform: function(value, entry){
                                    if((true !== wna.IsNullOrEmpty(entry.ProductURL))){
                                        return '<a href="' + entry.ProductURL + '" target="_blank">'+ value +'</a>';
                                    }else{
                                        return value
                                    }
                                }
                            },
                            {
                                fieldid: 'Skumap'
                            },
                            {
                                fieldid: 'channel'
                            },
                            {
                                fieldid: 'DiscriminantTime',
                                transform: Helpers.toDateTimeString
                            },
                            {
                                fieldid: 'statusText', //'RightsProtectionStatus',
                                transform: function(value, entry){
                                    if ((true === wna.IsNullOrEmpty(entry)) || (true === wna.IsNullOrUndefined(entry.RightsProtectionStatus))){
                                        return '';
                                    }
                                    let styleclass = '';
                                    switch(entry.RightsProtectionStatus){
                                        case 1: 
                                            styleclass = 'initiate'; break;
                                        case 2:
                                            styleclass = 'receipt'; break;
                                        case 3:
                                            styleclass = 'failed'; break;
                                        case 4:
                                            styleclass = 'completed'; break;
                                        case 5:
                                            styleclass = 'process'; break;
                                        default:
                                            styleclass = ''; break;
                                    }
                                    return '<div class="status ' + styleclass + '"><span>' + value + '</span></div>';

                                }
                            },
                            {
                                fieldid: 'RightsProtectionStartTime',
                                transform: Helpers.toDateTimeString
                            }
                        ],
                        filters: [
                            {
                                fieldid: 'channel',
                                source: 'channels',
                                options: []
                            },
                            {
                                fieldid: 'level_name',
                                source: 'level_names',
                                options: []
                            },
                            {
                                fieldid: 'ConfidenceLevelBucketName',
                                source: 'confidences',
                                options: []
                            },
                            {
                                fieldid: 'series',
                                source: 'series',
                                options: []
                            },
                            {
                                fieldid: 'model',
                                source: 'models',
                                options: []
                            }
                        ],
                        search: function(needle, dataset){
                            if ((true !== wna.IsNullOrEmpty(needle)) && (true !== wna.IsNullOrEmpty(dataset))){
                                return _.filter(dataset, function(d){
                                    let productstring = d.ProductDescription;
                                    return (true !== wna.IsNullOrEmpty(productstring)) ? productstring.contains(needle, true) : false;
                                });
                            }else{
                                return dataset;
                            }
                            //console.log('------ > search: ', needle, dataset);
                        }, //or null
                        buttons: [
                            {
                                id: 'launch',                                
                                classes: ['btn-white'], //or null
                                visibleInTabs: ['tab_pending'],
                                callback: function(selection){
                                    if (true === wna.IsNullOrEmpty(selection)){
                                        return;
                                    }

                                    let thisvue = this;
                                    let vwstate = thisvue.viewState;

                                    (function(v, ids, start_date, end_date){
                                        v.$emit('request-launch', v.path, ids, function(data, jqXHR, textStatus, errorThrown){
                                            if (true === wna.IsNullOrEmpty(data)){
                                                alert('Exception occurs while launching complain: ' + textStatus);
                                                return;
                                            }
                                            v.$emit('request-data', v.path, start_date, end_date, {keys: ['channel', 'series', 'model']}, v.onRequestReturned, v);
                                        }, thisvue);
                                    })(thisvue, selection, vwstate.start_date, vwstate.end_date);

                                    console.log('------ > button(launch): clicked!', selection);
                                }
                            },
                            {
                                id: 'export',
                                icon: 'assets/icons/icon_export.png',
                                classes: ['btn-red'],
                                callback: function(tabid, filters, searchNeedle){
                                    //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
                                    let thisvue = this; 
                                    let vwmodel = thisvue.viewModel;
                                    let vwstate = thisvue.viewState;

                                    let start_date = moment(vwstate.start_date).format('YYYY-MM-DD 00:00:00');
                                    let end_date = moment(vwstate.end_date).format('YYYY-MM-DD 23:59:59');
                                    let tabobj = (_.find(vwmodel.tableview.tabs, {id: tabid}) || { filter: null });
                                    let tab = wna.NVL2(tabobj.filter, tabobj.filter, '');
                                    let f1 = _.mapValues(filters, function(v, k){
                                        if ('level_name' === k){
                                            let result_value = _.findKey(thisvue.locale.valuesMapping.DiscriminantResult, function(o){
                                                return (o === v);
                                            });
                                            let ret = parseInt(result_value, 10);
                                            return isNaN(ret) ? '' : ret;
                                        }
                                        return (true === wna.IsNullOrUndefined(v)) ? '' : v;
                                    });
                                    filters = _.mapKeys(f1, function(v, k){
                                        if ('level_name' === k){
                                            return 'DiscriminantResult';
                                        }
                                        return k;
                                    });

                                    searchNeedle = (true === wna.IsNullOrUndefined(searchNeedle)) ? '' : searchNeedle;
                                    filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

                                    let conditions = { tab, filters, searchNeedle, start_date, end_date };

                                    thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
                                    console.log('------ > button(export): clicked!', conditions);
                                }
                            }
                        ]
                    },
                    trendChart:{
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                        },
                        yAxis: {
                            type: 'value',
                        }
                    }
                },
                testBar: {
                    model: {
                        categories: ['京東', '考拉', '淘寶', '天貓'],
                        series: [
                            {
                                name: '低',
                                data: [10, 52, 200, 334],
                            },
                            {
                                name: '中',
                                data: [10, 52, 200, 334],
                            },
                            {
                                name: '中高',
                                data: [10, 52, 200, 334],
                            },
                            {
                                name: '高',
                                data: [30, 72, 230, 334],
                            }
                        ]
                    }
                },
                testPie: {
                    model: {
                        'Apple': 3700,
                        'Banna': 1177,
                        'Peach': 1093
                    }
                },
                testChart: {
                    model: {
                        x:  ['03-04', '03-05', '03-06', '03-07', '03-08', '03-09', '03-10'], //will be copied to opts.xAxis.data,
                        series: [
                            {
                                color: 'rgb(244,115,115)',
                                name: 'Fakes',
                                data:  [120, 132, 101, 134, 90, 230, 210]
                            },
                            {
                                color: 'rgb(114,144,242)',
                                name: 'Rights',
                                data: [220, 182, 191, 234, 290, 330, 310]
                            }
                        ]
                    }
                }
            };
        },
        computed: {
           
        },
        methods: {

            localeForSubview: function(subviewname){
                let ret =  _.extend({ common: this.sharedLocale.common}, this.locale[subviewname]);
                return ret;
            },
            buildBaseModelFromData: function(data){
                let thisvue = this;
                let channels = _.map(data.channel, 'channel');
                let series = _.map(data.series, 'series');
                let models = _.map(data.model, 'model');
                let results = _.map(data.results, function(r){
                    r.DiscriminantTimeShort = moment(r.DiscriminantTime).utc().format('YYYY-MM-DD');

                    (function(o, v){
                        Object.defineProperty(o, 'level_name', {
                            get: function(){
                                return v.locale.valuesMapping.DiscriminantResult[o.DiscriminantResult]; //(0 === r.DiscriminantResult) ? '假' : '真';
                            }
                        });

                        Object.defineProperty(o, 'statusText', {
                            get: function(){
                                return v.locale.valuesMapping.RightsProtectionStatus[o.RightsProtectionStatus]; //(0 === r.DiscriminantResult) ? '假' : '真';
                            }
                        });
                    })(r, thisvue);
                    //r.level_name = _locales[thisvue.lang].valuesMapping['DiscriminantResult'][r.DiscriminantResult]; //(0 === r.DiscriminantResult) ? '假' : '真';

                    return r;
                });
                let total = (true !== wna.IsNullOrEmpty(results)) ? results.length : null;
                let fakes = (true !== wna.IsNullOrUndefined(total)) ?  _.filter(results, {'DiscriminantResult': 0}) : null;
                let reals = (true !== wna.IsNullOrUndefined(total)) ?  _.differenceBy(results, [{'DiscriminantResult': 0}], 'DiscriminantResult') : null;

                let total_fakes =  (true !== wna.IsNullOrUndefined(total)) ? ((true !== wna.IsNullOrEmpty(fakes)) ? fakes.length : 0) : null;
                let fakes_percent = (true !== wna.IsNullOrUndefined(total_fakes)) ? ((total_fakes / total) * 100.0).toFixed(2) : null;

                let successes = (true !== wna.IsNullOrUndefined(total)) ?  _.filter(results, {'RightsProtectionStatus': 4}) : null;
                let total_success = (true !== wna.IsNullOrUndefined(total)) ? ((true !== wna.IsNullOrEmpty(successes)) ? successes.length : 0) : null;

                thisvue.model.models = models;
                thisvue.model.series = series;
                thisvue.model.results = results;
                thisvue.model.channels = channels;

                thisvue.model.fakes = fakes;
                thisvue.model.reals = reals;
                thisvue.model.successes = successes;
                thisvue.model.total_fakes = total_fakes;
                thisvue.model.total_success = total_success;
                thisvue.model.fakes_percent = fakes_percent;

                thisvue.model.level_names = _.map(_.uniqBy(results, 'level_name'), 'level_name');
                
            },
            buildSpecificModelFromData: function(data){
                let thisvue = this;
                //confidences
                //thisvue.model.discriminants = [{ title: '真', value: 1 }, { title: '假', value: 0 }];
                thisvue.model.confidences = _(thisvue.model.results).map('ConfidenceLevelBucketName').uniq().value();
            },
            buildFilters: function(){
                let thisvue = this;
                let tbviewViewModel = thisvue.viewModel.tableview;
                
                _.each(tbviewViewModel.filters, function(filter_entry){
                    if ((true !== wna.IsNullOrEmpty(filter_entry)) && (true !== wna.IsNullOrEmpty(filter_entry.source))){
                        filter_entry.options = thisvue.model[filter_entry.source];
                    }
                });
            },
            buildTrendChartModel: function(){
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;
                let reals = model.reals;
                let results = model.results;


                //  1) find all distinct dates for constructing the x-axis
                let dates = _(results).map('DiscriminantTimeShort').sortedUniq().value();


                //  2) group the fakes and rights by dates
                let fakes_group_by_dates = _.groupBy(fakes, 'DiscriminantTimeShort');
                let reals_group_by_dates = _.groupBy(reals, 'DiscriminantTimeShort');

                //  3) fill the fakes and reals groups with the missing dates
                let dateobjs = _.map(dates, (d) => {
                    return {
                        'DiscriminantTimeShort': d
                    };
                });

                let fakes_missing_dates = _.differenceBy(dateobjs, fakes, 'DiscriminantTimeShort');
                let reals_missing_dates = _.differenceBy(dateobjs, reals, 'DiscriminantTimeShort');

                _.each(fakes_missing_dates, (o) => {
                    fakes_group_by_dates[o.DiscriminantTimeShort] = [];
                });
                _.each(reals_missing_dates, (o) => {
                    reals_group_by_dates[o.DiscriminantTimeShort] = [];
                });

                //  4) create the chart model
                let trendChartModel = {
                    x: dates,
                    series: [
                        {
                            color: 'rgb(244,115,115)',
                            name: '假',
                            data: _.map(dates, (d) => {
                                let fd = fakes_group_by_dates[d]; //fakes on date
                                return (true !== wna.IsNullOrEmpty(fd)) ? fd.length : 0;
                            })
                        },
                        // {
                        //     color: 'rgb(114,144,242)',
                        //     name: '真',
                        //     data: _.map(dates, (d) => {
                        //         let rd = reals_group_by_dates[d]; //rights on date
                        //         return (true !== wna.IsNullOrEmpty(rd)) ? rd.length : 0;
                        //     })
                        // }
                    ]
                };
                //console.log('------- trendChart model: ', trendChartModel);
                thisvue.model.trendChart = trendChartModel;
            },
            buildPieChartModel: function () {
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;

                //  1) group the fakes by series and count number of fakes as value
                let fakes_count_group_by_series = _(fakes).groupBy('series').map(function(val, key) {
                    return {
                        series: key,
                        count: (true !== wna.IsNullOrEmpty(val)) ? val.length : 0
                    };
                }).orderBy(['count'], ['desc']).value(); //_.groupBy(fakes, 'series');

                //  2) maximum number of pie items is 8, if fakes groups more than 8, reduce to 8 by picking up the top-7 and sum the others
                if ((true !== wna.IsNullOrEmpty(fakes_count_group_by_series)) && (fakes_count_group_by_series.length > 8)) {
                    let reduced = _.slice(fakes_count_group_by_series, 0, 7);
                    let rest = _.drop(fakes_count_group_by_series, 7);
                    let sumrest = _.reduce(rest, function(sum, r) {
                        sum += r.count;
                        return sum;
                    }, 0);

                    fakes_count_group_by_series = _.concat(reduced, [{ series: 'others', count: sumrest }]);
                }

                //  3) Map array to object
                let pieChartModel = _(fakes_count_group_by_series).keyBy('series').mapValues('count').value();
                //console.log('-------- reduced fakes count group by series: ', fakes_count_group_by_series);
                //console.log('-------- reduced fakes count group by series: ', pieChartModel);
                thisvue.model.pieChart = pieChartModel;
            },
            buildChannelFakesBarChartModel: function () {
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;
                let reals = model.reals;
                let channels = model.channels;

                //  1) Group the fakes by channel
                let fakes_count_group_by_channel = _(fakes).groupBy('channel').map(function(val, key) {
                    return {
                        channel: key,
                        count: (true !== wna.IsNullOrEmpty(val)) ? val.length : 0
                    };
                }).value();

                let reals_count_group_by_channel = _(reals).groupBy('channel').map(function(val, key) {
                    return {
                        channel: key,
                        count: (true !== wna.IsNullOrEmpty(val)) ? val.length : 0
                    };
                }).value();

                let fakes_count_order_by_channel = _.map(channels, (c) => {
                    let entry_of_channel = _.find(fakes_count_group_by_channel, { channel: c });

                    if ((true !== wna.IsNullOrEmpty(entry_of_channel)) && (true !== wna.IsNullOrUndefined(entry_of_channel.count))) {
                        return entry_of_channel.count;
                    } else {
                        return 0;
                    }
                });

                let reals_count_order_by_channel = _.map(channels, (c) => {
                    let entry_of_channel = _.find(reals_count_group_by_channel, { channel: c });

                    if ((true !== wna.IsNullOrEmpty(entry_of_channel)) && (true !== wna.IsNullOrUndefined(entry_of_channel.count))) {
                        return entry_of_channel.count;
                    } else {
                        return 0;
                    }
                });

                //  2) Construct the bar-chart model
                let barChart1Model = {
                    categories: channels,
                    series: [
                        {
                            name: '真',
                            data: reals_count_order_by_channel,
                            itemStyle: {
                                color: '#7290F2'
                            }
                        },
                        {
                            name: '假',
                            data: fakes_count_order_by_channel,
                            itemStyle: {
                                color: '#F47373'
                            }
                        }
                    ]
                };
                console.log('------ fakes by channel ', channels, fakes_count_order_by_channel);
                console.log('------ rights by channel ', channels, reals_count_order_by_channel);
                thisvue.model.barChart1 = barChart1Model;
            },
            buildChannelConfidenceBarChartModel: function(){
                let thisvue = this;
                let model = thisvue.model;
                let fakes = model.fakes;
                let results = model.results;
                let channels = model.channels;

                let fakes_count_group_by_confidence = _(results).groupBy('ConfidenceLevelBucketName').map(function(val, key){
                    //key is ConfidenceLevelBucket value,
                    //val is array of fakes under the same ConfidenceLevelBucket
                    let fakes_count_of_channles = [];
                    _.each(channels, function(c){
                        let fakes_in_channel = _.filter(val, { 'DiscriminantResult': 0, 'channel': c });
                        fakes_count_of_channles.push((true !== wna.IsNullOrEmpty(fakes_in_channel)) ? fakes_in_channel.length : 0);
                    });

                    return {
                        name: key,
                        data: fakes_count_of_channles
                    };
                }).value();

                let barChart2Model = {
                    categories: channels,
                    series: fakes_count_group_by_confidence
                };
                
                //console.log('------- check check ', _.groupBy(fakes, 'ConfidenceLevelBucketName'));
                thisvue.model.barChart2 = barChart2Model;
            },
            onDateRangeChange: function(ev){
                let thisvue = this;
                let hasData = (true !== wna.IsNullOrEmpty(ev.detail));
                let start = (true === hasData) ? ev.detail.start : null;
                let end = (true === hasData) && (null !== start) ? ev.detail.end : null;

                thisvue.viewState.start_date = start;
                thisvue.viewState.end_date = end;

                console.log('------- onDateRangeChange >', thisvue.path, ev.detail);
                thisvue.$emit('request-data', thisvue.path, start, end, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },
            onRequestReturned: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                if (true !== wna.IsNullOrEmpty(data)){
                    if (true === data.success){
                        thisvue.buildBaseModelFromData(data.results);
                        thisvue.buildSpecificModelFromData(data.results);
                        thisvue.buildFilters();

                        if (true === wna.IsNullOrEmpty(thisvue.model.results)){
                            thisvue.model.trendChart = null;
                            thisvue.model.barChart1 = null;
                            thisvue.model.barChart2 = null;
                            thisvue.model.pieChart = null;

                            return;
                        }

                        // I - prepare the model for trend-chart
                        thisvue.buildTrendChartModel();



                        // II - Prepare the model for the pie-chart
                        thisvue.buildPieChartModel();
                

                        //  III - Prepare the model for the bar-chart-1 (各渠道假货统计（比例、数量)
                        thisvue.buildChannelFakesBarChartModel();

                        //  IV - Prepare the model for the bar-char-2
                        thisvue.buildChannelConfidenceBarChartModel();

                    }else{
                        alert('Query Data Not Success, message: ' + data.msg);
                    }
                }else{
                    if (true !== wna.IsNullOrUndefined(jqXHR)){
                        alert('Query Data got Error: ', textStatus);
                    }else{
                        alert('Empty Data');
                    }
                }
                console.log('------- onRequestReturned: ', data, jqXHR, textStatus, errorThrown);
            },
            onTableviewToolsButtonClicked: function(ev){
                let thisvue = this;
                
                if (true !== wna.IsNullOrEmpty(ev.detail)){
                    let detail = ev.detail;
                    let btnid = $(detail.target).val();

                    if (true === wna.IsFunction(detail.callback)){
                        let args = [];
                        if ('launch' === btnid){
                            args = [detail.selectedRows];
                        }else{
                            args = [detail.tabid, detail.filters, detail.searchNeedle];
                        }
                        
                        detail.callback.apply(thisvue, args);
                    }


                }
            }

        }

    });
})();
(function(){
    
    Vue.component('vc-dialog', {
        template: `
        <div class="modal fade" :id="id" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">
                            <slot name="title">
                            </slot>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <slot name="body" :view-model="viewModel" :locale="locale" :lang="lang">
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="foot" :view-model="viewModel.footer" :locale="locale" :lang="lang">
                        </slot>
                    </div>
                </div>
            </div>
        </div>
        `,
        props: ['id', 'viewModel', 'locale', 'lang']
    });

})();
(function(){
      Vue.component('vc-settings', {
        template: `
            <div class="main-content-body">
                <div class="main-table">
                    <vc-tableview2 id="settingsTableView" :model="model.results" :view-model="viewModel.tableview" :locale="localeForSubview('tableview')" 
                        v-on:tools-button-clicked.native="onTableviewToolsButtonClicked"
                        v-on:tab-change="onTableviewTabChange">
                    </vc-tableview2>
                </div>
                <!-- Modal -->
                <vc-dialog ref="uploadModal" id="settingsView_uploadDialog" :locale="localeForSubview('uploadDialog')" :view-model="viewModel">
                    <template v-slot:title="slotProps">
                        {{locale.uploadDialog.title}}
                    </template>
                    <template v-slot:body="slotProps">
                        <div class="form-group align-left" v-if="null === viewState.uploadState">
                            <label>{{locale.uploadDialog.caption}}</label>
                            <p class="help-block" v-html="descriptionText"></p>
                            <input type="file" v-on:change="onFilesChange($event.target.name, $event.target.files)">
                        </div>
                        <div class="form-group" v-if="'progress' === viewState.uploadState">
                            <div class="upload-modal-icon progress"></div>
                            <label>{{locale.uploadDialog.progress.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.progress.description}}</p>
                        </div>
                        <div class="form-group" v-if="'success' === viewState.uploadState">
                            <div class="upload-modal-icon success"></div>
                            <label>{{locale.uploadDialog.success.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.success.description}}</p>
                        </div>
                        <div class="form-group" v-if="'failed' === viewState.uploadState">
                            <div class="upload-modal-icon failed"></div>
                            <label>{{locale.uploadDialog.failed.caption}}</label>
                            <p class="help-block">{{locale.uploadDialog.failed.description}}</p>
                        </div>
                    </template>
                    <template v-slot:foot="slotProps">
                        <button type="button" class="btn btn-blue" 
                            v-on:click="onUploadButtonClicked"
                            v-if="null === viewState.uploadState"><img src="assets/icons/icon_upload.png" />{{locale.uploadDialog.uploadButton}}</button>
                        <button type="button" class="btn btn-blue" data-dismiss="modal" 
                            v-if="('success' === viewState.uploadState) || ('failed' === viewState.uploadState)">Ok</button>
                    </template>
                </vc-dialog>
            </div>
        `,
        props: ['path', 'locale', 'sharedLocale', 'lang'],
        data: function(){
            return {
                model: {
                    results: []
                },
                viewModel: {
                    tableview: {
                        tabs: [
                            {
                                id: 'tab_anticounterfeiting',
                                filter: function(dataset){
                                    console.log('------ > tab_anticounterfeiting activated', dataset);
                                    return dataset;
                                },
                                default: true
                            },/*
                            {
                                id: 'tab_lowprice',
                                filter: function(dataset){
                                    console.log('------ > tab_lowprice activated', dataset);
                                    return dataset;
                                }
                            },
                            {
                                id: 'tab_transshipment',
                                filter: function(dataset){
                                    console.log('------ > tab_transshipment activated', dataset);
                                    return dataset;
                                }
                            }*/
                        ],
                        cols: [ //the colums that we'd like to display
                            {
                                fieldid: 'code',
                            },
                            {
                                fieldid: 'Industry'
                            },
                            {
                                fieldid: 'Brand'
                            },
                            {
                                fieldid: 'Category'
                            },
                            {
                                fieldid: 'series'
                            },
                            {
                                fieldid: 'model',
                            },
                            {
                                fieldid: 'channel',
                            }
                        ],
                        filters: [
                            {
                                fieldid: 'channel',
                                source: 'channels',
                                options: []
                            },
                            {
                                fieldid: 'series',
                                source: 'series',
                                options: []
                            },
                            {
                                fieldid: 'model',
                                source: 'models',
                                options: []
                            }
                        ],
                        buttons: [
                            {
                                id: 'import',
                                icon: 'assets/icons/icon_products_import.png',
                                classes: ['btn-white'], //or null
                                toggleModal: '#settingsView_uploadDialog'
                                /*
                                callback: function(dataset){
                                    console.log('------ > button(import): clicked!', dataset);
                                }*/
                            },
                            {
                                id: 'export',
                                icon: 'assets/icons/icon_export.png',
                                classes: ['btn-red'],
                                callback: function(tabid, filters, searchNeedle){
                                    //we can use 'this' to refer to this vue-component object is because we do callback apply in method onTableviewToolsButtonClicked
                                    let thisvue = this; 
                                    let vwmodel = thisvue.viewModel;
                                    let vwstate = thisvue.viewState;

                                    filters = (true === wna.IsNullOrEmpty(filters)) ? null : filters;

                                    let conditions = filters; //{ filters, tabid };

                                    thisvue.$emit('request-export', thisvue.path, conditions, thisvue);
                                    console.log('------ > button(export): clicked!', dataset);
                                }
                            }
                        ]
                    },
                    uploadDialog: {
                        footer: {}
                    }
                },
                viewState: {
                    uploadState: null,
                    selectedFiles: null
                }
            }
        },
        computed: {
            /*
            currentLocale: function(){
                let ret = _locales[this.lang]; //_.extend({common: this.locale.shared.common}, _locales[this.lang]);
                return ret;
            },
            */
           descriptionText: function(){
               let thisvue = this;
               ret = thisvue.locale.uploadDialog.description;
               if ((null === thisvue.viewState.uploadState) && (true !== wna.IsNullOrEmpty(ret))){
                   ret = ret.replace("（###", "（<a href='assets/import_temp.csv' target='_blank'>");
                   ret = ret.replace("###）", "</a>）");
               }
               return ret;
           }
        },
        methods: {
            localeForSubview: function(subviewname){
                let ret =  _.extend({ common: this.sharedLocale.common}, this.locale[subviewname]);
                return ret;
            },
            buildBaseModelFromData: function(data){
                let thisvue = this;
                let channels = _.map(data.channel, 'channel');
                let series = _.map(data.series, 'series');
                let models = _.map(data.model, 'model');
                let results = data.results;
                
                thisvue.model.models = models;
                thisvue.model.series = series;
                thisvue.model.results = results;
                thisvue.model.channels = channels;
            },
            buildFilters: function(){
                let thisvue = this;
                let tbviewViewModel = thisvue.viewModel.tableview;
                
                _.each(tbviewViewModel.filters, function(filter_entry){
                    if ((true !== wna.IsNullOrEmpty(filter_entry)) && (true !== wna.IsNullOrEmpty(filter_entry.source))){
                        filter_entry.options = thisvue.model[filter_entry.source];
                    }
                });
            },
            /*
            onDateRangeChange: function(ev){
                let thisvue = this;
                let hasData = (true !== wna.IsNullOrEmpty(ev.detail));
                let start = (true === hasData) ? ev.detail.start : null;
                let end = (true === hasData) && (null !== start) ? ev.detail.end : null;

                console.log('------- onDateRangeChange >', thisvue.path, ev.detail);
                thisvue.$emit('request-data', thisvue.path, start, end, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },*/
            onTableviewToolsButtonClicked: function(ev){
                let thisvue = this;
                
                if (true !== wna.IsNullOrEmpty(ev.detail)){
                    let detail = ev.detail;
                    let btnid = $(detail.target).val();

                    if (('export' === btnid) && (true === wna.IsFunction(detail.callback))){
                        let args = [detail.tabid, detail.filters, detail.searchNeedle];
                        detail.callback.apply(thisvue, args);
                    }
                }
            },
            onTableviewTabChange: function(tabid){
                let thisvue = this;
                
                console.log('-------- settingsView onTableviewTabChange: ', tabid, thisvue.path);
                thisvue.$emit('request-data', thisvue.path, null, null, {keys: ['channel', 'series', 'model']}, thisvue.onRequestReturned, thisvue);
            },
            onRequestReturned: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                if (true !== wna.IsNullOrEmpty(data)){
                    if (true === data.success){
                        thisvue.buildBaseModelFromData(data.results);
                        thisvue.buildFilters();


                    }else{
                        alert('Query Data Not Success, message: ' + data.msg);
                    }
                }else{
                    if (true !== wna.IsNullOrUndefined(jqXHR)){
                        alert('Query Data got Error: ', textStatus);
                    }else{
                        alert('Empty Data');
                    }
                }
                console.log('------- onRequestReturned: ', data, jqXHR, textStatus, errorThrown);
            },
            onFilesChange: function(name, files){
                let thisvue = this;
                thisvue.viewState.selectedFiles = files;
                console.log('------- onFilesChange: ', name, files);
            },
            onUploadButtonClicked: function(){
                let thisvue = this;
                let files = thisvue.viewState.selectedFiles;
                if (true !== wna.IsNullOrEmpty(files)){
                    console.log('------- Upload Files...', files);  
                    thisvue.viewState.uploadState = 'progress';
                    thisvue.$emit('request-upload', thisvue.path, files, thisvue.onUploadRequestReturn, thisvue);
                }

            },
            onUploadRequestReturn: function(data, jqXHR, textStatus, errorThrown){
                let thisvue = this;
                let vwstate = thisvue.viewState;

                if ((true !== wna.IsNullOrEmpty(data)) && (true === data.success)){
                    vwstate.uploadState = 'success';
                }else{
                    vwstate.uploadState = 'failed';
                }
            }
    
        },
        //##Life-cycle Hooks
        mounted: function(){
            //$(thisvue.$refs.uploadModal.$el).on('shown.bs.modal', thisvue.onUploadModalShown);
            (function(thisvue){
                let vwstate = thisvue.viewState;

                $(thisvue.$el).on('shown.bs.modal', function(ev){
                    $(ev.target).one('hide.bs.modal', function(ev){   
                        console.log('------- modal hide: ', vwstate.uploadState); 
                        if (('success' === vwstate.uploadState) || ('failed' === vwstate.uploadState)){
                            vwstate.uploadState = null;
                        }else if ('progress' === vwstate.uploadState){
                            ev.stopPropagation();
                        }
                    }).appendTo('body');
                });
            })(this);

        },
        updated: function(){
            console.log('------------ settingsView updated: ');
        }

    });
})();
(function() {
  Vue.component("vc-loginwarp", {
    template: `
  <div id='content'>
    <div id="login-adv">
        <div class="main-info">{{lang}}
            <h3>{{login.en.mainInfo}}</h3>
            <p>{{ login.en.subInfo }}</p>
        </div>
    </div>
    <div id="login-form">
        <h2 class="login-title">{{ login.en.loginTitle }}</h2>
        <div class="password-status-info">
            <p>重置密码尚未激活，请<a href="#">查看激活邮件</a>，激活后重新登录</p>
        </div>
        <div class="email-status-info">
            <p>邮箱地址尚未激活，请<a href="#">查看激活邮件</a>，激活后重新登录</p>
        </div>
        <div class="login-status-info">
            <span></span>
            <p>{{ login.en.loginStatusinfo }}</p>
        </div>
        <form>
            <div class="form-group">
                <input type="text" class="form-control" :placeholder=" login.en.inputName ">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" :placeholder=" login.en.inputPassword ">
            </div>
            <div class="checkbox">
                <label v-on:click="checkboxToggle">
                    <span class="s-checkbox" type="checkbox" :class="{'active':isActive}"></span> {{ login.en.rememberMe
                    }}
                </label>
                <p class="forget-password"><a href="javascript:void(0);" @click="goToPassword">{{ login.en.forget }}</a>
                </p>
            </div>
            <div class="form-group">
                <div id="check-slide"></div>
            </div>
            <button type="submit" class="submit btn btn-default" @click="goToLogin">{{ login.en.signIn }}</button>
            <p class="help-block">{{ login.en.helpBlock }}<a href="#" @click="goToRegister">{{ login.en.helpBlockInfo
                }}</a></p>
        </form>
    </div>
    <div class="modal fade" id="register-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <span class="modal-success-icon"></span>
                <h3>邮箱激活链接已过期</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="">重新注册</button>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="password-error" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-body">
            <span class="modal-success-icon"></span>
            <h3>设置密码验证邮件已失效</h3>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="">重新填写</button>
        </div>
    </div>
</div>
</div>
</div> 
        `,
    data: function() {
      return {
        isActive: false,
        login: {
          en: {
            mainInfo: "Brand Intelligence & Brand Protection",
            subInfo:
              "Making digital commerce trustworthy through big data, AI and blockchain",
            loginTitle: "Log in",
            loginStatusinfo: "Login or login password is incorrect",
            inputName: "Jane Doe",
            inputPassword: "Password",
            rememberMe: "Remember me",
            forget: "Forget Password ?",
            forgetLink: "#",
            signIn: "Sign in",
            helpBlock: "Don’t have an account?",
            helpBlockInfo: "Sign up",
            helpBlockLink: "#"
          }
        }
      };
    },
    created() {
      console.log(this.locale,this.lang)
      console.log("registerwarp page");
    },
    methods: {
      goToPassword(){
        this.$router.push({ path: "/forgetPassword" });
      },
      checkboxToggle: function() {
        this.isActive = !this.isActive;
      },
      goToRegister() {
        this.$router.push({ path: "/register" });
      },
      goToLogin() {
        this.$router.push({ path: "/CounterfeitProduct" });
      }
    },

    props: ["model", "locale", "lang", "sharedLocale"],
    mounted() {
      // $('#password-error').modal();
      // $('#register-error').modal();

      $("#check-slide").slider({
        width: 320, // width
        height: 40, // height
        sliderBg: "#E8E8E8", // 滑块背景颜色
        color: "#666", // 文字颜色
        fontSize: 14, // 文字大小
        bgColor: "#E8E8E8", // 背景颜色
        textMsg: "Hold the slider drag to the far right", // 提示文字
        successMsg: "Verification passed", // 验证成功提示文字
        successColor: "#fff", // 滑块验证成功提示文字颜色
        time: 400, // 返回时间
        callback: function(result) {
          // 回调函数，true(成功),false(失败)
          if (result) $("#check-slide").addClass("success");
          console.log(result);
        }
      });
    },
  });
})();

(function () {
    Vue.component("vc-registerwarp", {
        template: `
    <div id="content">
    <div class="register-container">
        <div class="register-box">
                <div id="register-form">
                        <h2 class="login-title">{{ register.en.registerTitle }}</h2>
                        <form>
                            <div class="form-group" :data-status="Verification.inputName.status">
                                <em style="color: #CD454A;" v-if="Verification.inputName.icon">*</em>
                                <input type="text" class="form-control" :placeholder="register.en.inputName" v-model="Verification.inputName.value" @blur="validateFunc('inputName')" @focus="resetDefault('inputName')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{ register.en.inputNameInfo }}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputAdress.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                                    <input type="text" class="form-control"  :placeholder="register.en.inputAdress" v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')" @focus="resetDefault('inputAdress')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputAdressInfo}}</p>
                                </div>
                                <div class="form-group" :data-status="Verification.inputCompany.status">
                                        <em style="color: #CD454A;" v-if="Verification.inputCompany.icon">*</em>
                                        <input type="text" class="form-control"  :placeholder="register.en.inputCompany"  v-model="Verification.inputCompany.value" @blur="validateFunc('inputCompany')" @focus="resetDefault('inputCompany')">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputCompanyInfo}}</p>
                                    </div>
                            <div class="form-group" :data-status="Verification.inputPassword.status">
                                    <em style="color: #CD454A;"  v-if="Verification.inputPassword.icon">*</em>
                            <input type="password" class="form-control" id="registerPassword1" :placeholder="register.en.inputPassword" v-model="Verification.inputPassword.value"  @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')" @focus="resetDefault('inputPassword')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputPasswordInfo}}</p>
                                    <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                                            <div class="strength">
                                                <p>{{register.en.statusTips}}</p>
                                                <div class="strength-box" :data-status="Verification.inputPassword.strength.level">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <p class="strength-info">{{register.en.passwordStatus}}</p>
                                            </div>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1"><span></span>{{register.en.strengthStatus1}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2"><span></span>{{register.en.strengthStatus2}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3"><span></span>{{register.en.strengthStatus3}} </p>
                                        </div>
                            </div>
                            <div class="form-group" :data-status="Verification.inputConfirm.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                                    <input type="password" class="form-control" :placeholder="register.en.inputConfirm" v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')" @focus="resetDefault('inputConfirm')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputConfirmInfo}}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputMobile.status">
                                    <div class="input-group">
                                        <div class="input-group-addon">{{register.en.inputNumberMobile}}</div>
                                        <input type="text" class="form-control"  :placeholder="register.en.inputMobile" v-model="Verification.inputMobile.value" @keyup="canClickGetCode(Verification.inputMobile.value)" @blur="validateFunc('inputMobile')" @focus="resetDefault('inputMobile')">
                                    </div>
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputMobileInfo}}</p>
                            </div>
                            <div class="form-group code-verification" :data-status="Verification.inputVerification.status">
                                <input type="text" class="form-control"  :placeholder="register.en.inputVerification" v-model="Verification.inputVerification.value" @blur="validateFunc('inputVerification')" @focus="resetDefault('inputVerification')">
                                <button type="button" class="btn btn-default">{{register.en.inputVerificationBtn}}</button>
                                <span class="input-status"></span>
                                <p class="status-info">{{register.en.inputVerificationInfo}}</p>
                            </div>
                            
                            <button type="submit" class=" submit btn btn-default" @click="registerr">{{ register.en.signIn }}</button>
                            <p class="help-block">{{ register.en.helpBlock }}<a href="#" @click="goToLoginPage">{{ register.en.helpBlockInfo }}</a>  </p>
                        </form>
                </div>
        </div>
    </div>
    <div class="modal fade" id="register" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                    <span class="modal-success-icon"></span>
                        <h3>The activation email has been sent to your registered email address</h3>
                        <p>Designwang@163.com Please check your email and activate your account.</p>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
</div>
    `,
        props: ['model', 'locale'],
        created() {
            console.log('login page')
        },
        data: function () {
            return {
                register: {
                    en: {
                        registerTitle: "Sign up",
                        inputName: 'Account name',
                        inputNameInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputAdress: 'Email address',
                        inputAdressInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputCompany: 'Company name',
                        inputCompanyInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputPassword: 'Password',
                        inputPasswordInfo: 'Username is 5-25 characters and needs to contain letters.',
                        statusTips: 'Strength',
                        passwordStatus: 'Low',
                        strengthStatus1: '5 to 25 charcters',
                        strengthStatus2: 'Contains only letters,numbers and symbols ',
                        strengthStatus3: 'Contains at least two of the following: letters,numbers,symbols.',
                        inputConfirm: 'Password',
                        inputConfirmInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputMobile: 'Mobile number',
                        inputNumberMobile: '+86',
                        inputMobileInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputVerification: 'Verification code',
                        inputVerificationBtn: 'Get code',
                        inputVerificationInfo: 'Username is 5-25 characters and needs to contain letters.',
                        signIn: 'Sign in',
                        helpBlock: 'Don’t have an account?',
                        helpBlockInfo: 'Sign up',
                        helpBlockLink: '#',
                    }
                },
                Verification:{
                    inputName:{value:'', icon:1,status: ''},
                    inputCompany:{value:'', icon:1,status: ''},
                    inputAdress:{value:'', icon:1,status: ''},
                    inputPassword:{value:'', icon:1,status: '',tips:0,strength:{level:"low",strength1:"false",strength2:"false",strength3:"false"}},
                    inputConfirm:{value:'', icon:1,status: ''},
                    inputMobile:{value:'', icon:1,status: '',isClick:false},
                    inputVerification:{value:'', icon:1,status: ''},
                },
            }
        },
        watch:{
            Verification: {
                handler(newValue, oldValue) {
                    for (let key in newValue) {
                        if (newValue.hasOwnProperty(key)) {
                            let element = newValue[key];
                            newValue[key].icon = Number(!this.required(newValue[key].value));
                        }
                    }
                },
                deep: true
              }
        },
        methods: {
            registerr(){
                $('#register').modal('toggle');
            },
            modalGoToLoginPage(){
                $('#register').modal('hide');
                this.$router.push({path:'/login'})
            },
            goToLoginPage(){
                this.$router.push({path:'/login'})
            },
            validateFunc(key){
                let value = this.Verification[key].value;
                let status = ''
                if(key == 'inputName'){ 
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputAdress'){
                    status =  this.required(value) ? (this.email(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputCompany'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputPassword'){
                    this.Verification[key].tips = 0;                    
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                    this.passwordInput(key)
                }else if(key == 'inputConfirm'){
                    status =  this.required(value) ? (value == this.Verification['inputPassword'].value ?   'success' : 'false') : 'default';
                }
                else if(key == 'inputMobile'){
                    status =  this.required(value) ? (this.phone(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputVerification'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }
                key != 'inputPassword' && ( this.Verification[key].tips = 0)
                this.Verification[key].status = status;
            },
            resetDefault(key){
                this.Verification[key].status == 'default' &&  (this.Verification[key].status = '');
                key == 'inputPassword' && ( this.Verification[key].tips = 1,this.passwordInput(key))
            },
            passwordInput(key){
                    let level = 0;
                    let strength1,strength2,strength3;
                    this.required(this.Verification[key].value) && this.rangelength(this.Verification[key].value,[5,25]) ? (strength1 = 'success',level++) : (strength1 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength2 = 'success',level++) : (strength2 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength3 = 'success',level++) : (strength3 = 'false')
                    this.Verification[key].strength = {
                        'strength1':strength1,
                        'strength2':strength2,
                        'strength3':strength3
                    }
                    this.Verification[key].strength.level = level < 2 ? 'low' : (level < 3 ? 'center' :'high');
            },
            canClickGetCode(value){
                this.Verification.inputMobile.isClick = this.required(value) && this.phone(value)
            },
            required(value){
                return value.trim().length > 0;
            },
            email: function (value) {
                if (value == null || this.trim(value) == "") return true;
                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            //字符串长度的范围
            rangelength: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                return (value.length >= param[0] && value.length <= param[1]);
            },
             //手机号码
            phone: function (value) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^1[345789]\d{9}$/;
                return rex.test(value);
            },
            //密码
            password: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
                return rex.test(value);
            },
            trim(value) {
                return value.replace(/(^\s*)|(\s*$)/g, "");
            }
        }
    });
})();
(function () {
    Vue.component("vc-forgetpasswordwarp", {
        template: `
        <div id="content">
        <div class="password-container">
            <div class="password-top">
                <h2 class="password-title">{{ password.en.passwordTitle }}</h2>
            </div>
            <div class="password-box">
                <div id="password-form">
                    <form>
                        <div class="form-group">
                            <p class="password-info">请输入您的账号，以进行密码重设</p>
                        </div>
                        <div class="form-group" :data-status="Verification.inputCompany.status">
                            <em style="color: #CD454A;" v-if="Verification.inputCompany.icon">*</em>
                            <input type="text" class="form-control" :placeholder="password.en.inputCompany"
                                   v-model="Verification.inputCompany.value" @blur="validateFunc('inputCompany')"
                                   @focus="resetDefault('inputCompany')">
                            <span class="input-status"></span>
                            <p class="status-info">{{password.en.inputCompanyInfo}}</p>
                        </div>
                        <button type="submit" class=" submit btn btn-default" @click="passworded">确认找回</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="password" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <span class="modal-success-icon"></span>
                        <h3>Reset password mail has been sent</h3>
                        <p>Reset verification has been sent to your email, please check it.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
        props: ['model', 'locale'],
        created() {
            console.log('login page')
        },
        data: function () {
            return {
                password: {
                    en: {
                        passwordTitle: "Reset Password",
                        inputName: 'Account name',
                        inputNameInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputAdress: 'Email address',
                        inputAdressInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputCompany: 'Company name',
                        inputCompanyInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputPassword: 'Password',
                        inputPasswordInfo: 'Username is 5-25 characters and needs to contain letters.',
                        statusTips: 'Strength',
                        passwordStatus: 'Low',
                        strengthStatus1: '5 to 25 charcters',
                        strengthStatus2: 'Contains only letters,numbers and symbols ',
                        strengthStatus3: 'Contains at least two of the following: letters,numbers,symbols.',
                        inputConfirm: 'Password',
                        inputConfirmInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputMobile: 'Mobile number',
                        inputNumberMobile: '+86',
                        inputMobileInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputVerification: 'Verification code',
                        inputVerificationBtn: 'Get code',
                        inputVerificationInfo: 'Username is 5-25 characters and needs to contain letters.',
                        signIn: '确认找回',
                        helpBlock: 'Don’t have an account?',
                    }
                },
                Verification:{
                    inputName:{value:'', icon:1,status: ''},
                    inputCompany:{value:'', icon:1,status: ''},
                    inputAdress:{value:'', icon:1,status: ''},
                    inputPassword:{value:'', icon:1,status: '',tips:0,strength:{level:"low",strength1:"false",strength2:"false",strength3:"false"}},
                    inputConfirm:{value:'', icon:1,status: ''},
                    inputMobile:{value:'', icon:1,status: '',isClick:false},
                    inputVerification:{value:'', icon:1,status: ''},
                },
            }
        },
        watch:{
            Verification: {
                handler(newValue, oldValue) {
                    for (let key in newValue) {
                        if (newValue.hasOwnProperty(key)) {
                            let element = newValue[key];
                            newValue[key].icon = Number(!this.required(newValue[key].value));
                        }
                    }
                },
                deep: true
              }
        },
        methods: {
            goToResetPassword(){

            },
            passworded(){
                $('#password').modal('toggle');
            },
            modalGoToLoginPage(){
                $('#password').modal('hide');
                this.$router.push({path:'/login'})
            },
            goToLoginPage(){
                this.$router.push({path:'/login'})
            },
            validateFunc(key){
                let value = this.Verification[key].value;
                let status = ''
                if(key == 'inputName'){ 
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputAdress'){
                    status =  this.required(value) ? (this.email(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputCompany'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputPassword'){
                    this.Verification[key].tips = 0;                    
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                    this.passwordInput(key)
                }else if(key == 'inputConfirm'){
                    status =  this.required(value) ? (value == this.Verification['inputPassword'].value ?   'success' : 'false') : 'default';
                }
                else if(key == 'inputMobile'){
                    status =  this.required(value) ? (this.phone(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputVerification'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }
                key != 'inputPassword' && ( this.Verification[key].tips = 0)
                this.Verification[key].status = status;
            },
            resetDefault(key){
                this.Verification[key].status == 'default' &&  (this.Verification[key].status = '');
                key == 'inputPassword' && ( this.Verification[key].tips = 1,this.passwordInput(key))
            },
            passwordInput(key){
                    let level = 0;
                    let strength1,strength2,strength3;
                    this.required(this.Verification[key].value) && this.rangelength(this.Verification[key].value,[5,25]) ? (strength1 = 'success',level++) : (strength1 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength2 = 'success',level++) : (strength2 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength3 = 'success',level++) : (strength3 = 'false')
                    this.Verification[key].strength = {
                        'strength1':strength1,
                        'strength2':strength2,
                        'strength3':strength3
                    }
                    this.Verification[key].strength.level = level < 2 ? 'low' : (level < 3 ? 'center' :'high');
            },
            canClickGetCode(value){
                this.Verification.inputMobile.isClick = this.required(value) && this.phone(value)
            },
            required(value){
                return value.trim().length > 0;
            },
            email: function (value) {
                if (value == null || this.trim(value) == "") return true;
                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            //字符串长度的范围
            rangelength: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                return (value.length >= param[0] && value.length <= param[1]);
            },
             //手机号码
            phone: function (value) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^1[345789]\d{9}$/;
                return rex.test(value);
            },
            //密码
            password: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
                return rex.test(value);
            },
            trim(value) {
                return value.replace(/(^\s*)|(\s*$)/g, "");
            }
        }
    });
})();
(function () {
    Vue.component("vc-resetpasswordwarp", {
        template: `
        <div id="content">
        <div class="password-container">
            <div class="password-top">
                <h2 class="password-title">{{ password.en.passwordTitle }}</h2>
            </div>
            <div class="password-box">
                <div id="password-form">
                    <form>
                    <div class="form-group">
                            <p class="password-info">账号：23648235934875</p>
                        </div>
                        <div class="form-group" :data-status="Verification.inputPassword.status">
                            <em style="color: #CD454A;" v-if="Verification.inputPassword.icon">*</em>
                            <input type="password" class="form-control" id="passwordPassword1"
                                   :placeholder="password.en.inputPassword" v-model="Verification.inputPassword.value"
                                   @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')"
                                   @focus="resetDefault('inputPassword')">
                            <span class="input-status"></span>
                            <p class="status-info">{{password.en.inputPasswordInfo}}</p>
                            <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                                <div class="strength">
                                    <p>{{password.en.statusTips}}</p>
                                    <div class="strength-box" :data-status="Verification.inputPassword.strength.level">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                    <p class="strength-info">{{password.en.passwordStatus}}</p>
                                </div>
                                <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1">
                                    <span></span>{{password.en.strengthStatus1}} </p>
                                <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2">
                                    <span></span>{{password.en.strengthStatus2}} </p>
                                <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3">
                                    <span></span>{{password.en.strengthStatus3}} </p>
                            </div>
                        </div>
                        <div class="form-group" :data-status="Verification.inputConfirm.status">
                            <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                            <input type="password" class="form-control" :placeholder="password.en.inputConfirm"
                                   v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')"
                                   @focus="resetDefault('inputConfirm')">
                            <span class="input-status"></span>
                            <p class="status-info">{{password.en.inputConfirmInfo}}</p>
                        </div>
    
    
                        <button type="submit" class=" submit btn btn-default" @click="passworded">SURE</button>
                    </form>
                    <div class="password-status-info">
                        <span class="modal-success-icon"></span>
                        <h3>Reset password mail has been sent</h3>
                        <p>Reset verification has been sent to your email, please check it.</p>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" @click="modalGoToLoginPage">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
        props: ['model', 'locale'],
        created() {
            console.log('login page')
        },
        data: function () {
            return {
                password: {
                    en: {
                        passwordTitle: "Reset Password",
                        inputName: 'Account name',
                        inputNameInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputAdress: 'Email address',
                        inputAdressInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputCompany: 'Company name',
                        inputCompanyInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputPassword: 'Password',
                        inputPasswordInfo: 'Username is 5-25 characters and needs to contain letters.',
                        statusTips: 'Strength',
                        passwordStatus: 'Low',
                        strengthStatus1: '5 to 25 charcters',
                        strengthStatus2: 'Contains only letters,numbers and symbols ',
                        strengthStatus3: 'Contains at least two of the following: letters,numbers,symbols.',
                        inputConfirm: 'Password',
                        inputConfirmInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputMobile: 'Mobile number',
                        inputNumberMobile: '+86',
                        inputMobileInfo: 'Username is 5-25 characters and needs to contain letters.',
                        inputVerification: 'Verification code',
                        inputVerificationBtn: 'Get code',
                        inputVerificationInfo: 'Username is 5-25 characters and needs to contain letters.',
                        signIn: '确认找回',
                        helpBlock: 'Don’t have an account?',
                    }
                },
                Verification:{
                    inputName:{value:'', icon:1,status: ''},
                    inputCompany:{value:'', icon:1,status: ''},
                    inputAdress:{value:'', icon:1,status: ''},
                    inputPassword:{value:'', icon:1,status: '',tips:0,strength:{level:"low",strength1:"false",strength2:"false",strength3:"false"}},
                    inputConfirm:{value:'', icon:1,status: ''},
                    inputMobile:{value:'', icon:1,status: '',isClick:false},
                    inputVerification:{value:'', icon:1,status: ''},
                },
            }
        },
        watch:{
            Verification: {
                handler(newValue, oldValue) {
                    for (let key in newValue) {
                        if (newValue.hasOwnProperty(key)) {
                            let element = newValue[key];
                            newValue[key].icon = Number(!this.required(newValue[key].value));
                        }
                    }
                },
                deep: true
              }
        },
        methods: {
            goToResetPassword(){

            },
            passworded(){
                $('#password').modal('toggle');
            },
            modalGoToLoginPage(){
                $('#password').modal('hide');
                this.$router.push({path:'/login'})
            },
            goToLoginPage(){
                this.$router.push({path:'/login'})
            },
            validateFunc(key){
                let value = this.Verification[key].value;
                let status = ''
                if(key == 'inputName'){ 
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputAdress'){
                    status =  this.required(value) ? (this.email(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputCompany'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }else if(key == 'inputPassword'){
                    this.Verification[key].tips = 0;                    
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                    this.passwordInput(key)
                }else if(key == 'inputConfirm'){
                    status =  this.required(value) ? (value == this.Verification['inputPassword'].value ?   'success' : 'false') : 'default';
                }
                else if(key == 'inputMobile'){
                    status =  this.required(value) ? (this.phone(value) ?   'success' : 'false') : 'default';
                }else if(key == 'inputVerification'){
                    status =  this.required(value) ? (this.rangelength(value,[5,25]) ?   'success' : 'false') : 'default';
                }
                key != 'inputPassword' && ( this.Verification[key].tips = 0)
                this.Verification[key].status = status;
            },
            resetDefault(key){
                this.Verification[key].status == 'default' &&  (this.Verification[key].status = '');
                key == 'inputPassword' && ( this.Verification[key].tips = 1,this.passwordInput(key))
            },
            passwordInput(key){
                    let level = 0;
                    let strength1,strength2,strength3;
                    this.required(this.Verification[key].value) && this.rangelength(this.Verification[key].value,[5,25]) ? (strength1 = 'success',level++) : (strength1 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength2 = 'success',level++) : (strength2 = 'false')
                    this.required(this.Verification[key].value) &&  this.rangelength(this.Verification[key].value,[5,25]) ? (strength3 = 'success',level++) : (strength3 = 'false')
                    this.Verification[key].strength = {
                        'strength1':strength1,
                        'strength2':strength2,
                        'strength3':strength3
                    }
                    this.Verification[key].strength.level = level < 2 ? 'low' : (level < 3 ? 'center' :'high');
            },
            canClickGetCode(value){
                this.Verification.inputMobile.isClick = this.required(value) && this.phone(value)
            },
            required(value){
                return value.trim().length > 0;
            },
            email: function (value) {
                if (value == null || this.trim(value) == "") return true;
                return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            //字符串长度的范围
            rangelength: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                return (value.length >= param[0] && value.length <= param[1]);
            },
             //手机号码
            phone: function (value) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^1[345789]\d{9}$/;
                return rex.test(value);
            },
            //密码
            password: function (value, param) {
                if (value == null || this.trim(value) == "") return true;
                var rex = /^(?=.*\d+)(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[^A-Za-z0-9\s]+)\S{8,16}$/;
                return rex.test(value);
            },
            trim(value) {
                return value.replace(/(^\s*)|(\s*$)/g, "");
            }
        }
    });
})();

(function(){

    /*
    let _locales = {
        cn: {
            sidemenu: {
                'sidebar-01': '反假冒',
                'sidebar-02': '商品监测报告',
                'sidebar-03': '异常店铺报告',
                'sidebar-04': '渠道管理',
                'sidebar-05': '低价监控',
                'sidebar-06': '低价商品报告',
                'sidebar-07': '违规店铺列表',
                'sidebar-08': '窜货管理',
                'sidebar-09': '商品报告',
                'sidebar-10': '店铺列表',
                'sidebar-11': '配置',
                'sidebar-12': '个人中心'
            },
            shared: {
                dateranger: {
                    'days7': '近7天',
                    'days15': '近15天',
                    'days30': '近30天',
                    'caption': '时间：',
                },
                common: {
                    option_all: '全部',
                    export: '下载数据',
                    search: '搜索',
                    empty: '暂无资料'
                }
            }
        }
    };
    */

    let _serializeToQueryString = function(o){
        let strarr = _.reduce(o, (result, val, key) => {
            let keystr = encodeURIComponent(key);

            if (true === wna.IsArray(val)){
                _.each(val, (v) => {
                    let piece = keystr + '[]=' + encodeURIComponent(v);
                    result.push(piece);
                });
            }else{
                let piece = keystr + '=' + encodeURIComponent(val);
                result.push(piece);
            }

            return result;
        }, []);

        return (true !== wna.IsNullOrEmpty(strarr)) ? strarr.join('&') : null;
    };

    let _datasources = {
        'commodity_test_report': {
            query: {
                method: 'get',
                path: 'query/report/commodity_test_report',
            },
            export: {
                path: 'download/report/commodity_test_report',    
            },
            update: {
                method: 'put',
                path: 'update/report/commodity_test_report',
            }
        },
        'abnormal_shop_report': {
            query: {
                method: 'get',
                path: 'query/report/abnormal_shop_report',
            },
            export: {
                path: 'download/report/abnormal_shop_report'
            }
        },
        'settings_ac': {
            query: {
                method: 'get',
                path: 'query/report/settings_ac'
            },
            upload: {
                path: 'upload/report/commodity_test_report'
            },
            export: {
                method: 'get',
                path: 'download/settings/ac_base64'
            }
        }
    };
/*
    let _exportsources = {
        'commodity_test_report': {
            path: 'download/report',
        }
    };
*/

    let _backendBaseUrl = g_BACKEND_API_BASE_URL;
    let _fetchFromDataSource = function(dsname, since, to, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.query;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(query) with name = " + dsname);
        } 

        let end = (true !== wna.IsNullOrEmpty(to)) ? to.format('YYYY-MM-DD 23:59:59') : '';
        let start = (true !== wna.IsNullOrEmpty(since)) ? since.format('YYYY-MM-DD 00:00:00') : '';
        
        let prms = _.extend({start_date: start, end_date: end}, args);
        let qstr = _serializeToQueryString(prms);

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});

        $.ajax(url, {
            method: (ds.method || 'GET'),
            success: function(data){
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };

    let _updateDataSource = function(dsname, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.update;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(query) with name = " + dsname);
        } 

        let qstr = _serializeToQueryString(args);

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});

        $.ajax(url, {
            method: (ds.method || 'GET'),
            success: function(data){
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };

    let _downloadFileWith = function(dsname, args){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds['export'];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(export) with name = " + dsname);
        } 

        args['userid'] = 1;
        let qs = (true !== wna.IsNullOrEmpty(args)) ? base64.base64EncArr(base64.strToUTF8Arr(JSON.stringify(args))) : "";
        let url = [_backendBaseUrl, ds.path].join('/') + wna.NVL2(qs, '?p=' + qs, '');

        window.open(url, 'Download');
    };

    let _uploadToBackend = function(dsname, files, args, callback, sender){
        let ds = _datasources[dsname];
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource with name = " + dsname);
        }
        ds = ds.upload;
        if (true === wna.IsNullOrEmpty(ds)){
            throw new wna.NullReferenceException("Datasource(upload) with name = " + dsname);
        } 

        let qstr = _serializeToQueryString(args);

        let url =  [_backendBaseUrl, ds.path, '?'].join('/') + qstr;
        let cb = (callback || function(){});

        let data = new FormData();
        _.each(files, function(f, i){
            data.append('filename', f);
        });

        $.ajax(url, {
            method: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data){
                cb.call(sender, data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                cb.call(sender, null, jqXHR, textStatus, errorThrown);
            }
        });
    };



    let _sidemenuModel = [
        {
            id: 'sidebar-01',
            //target: null,
            submenu: [
                {
                    id: 'sidebar-02',
                    target: 'CounterfeitProduct',
                    viewComponent: 'vc-counterfeit-product',
                    dataSource: 'commodity_test_report',
                    localeSource: 'counterfeitProducts.json',
                },
                {
                    id: 'sidebar-03',
                    target: 'CounterfeitStore',
                    viewComponent: 'vc-counterfeit-store',
                    dataSource: 'abnormal_shop_report',
                    localeSource: 'counterfeitStores.json',
                },
                {
                    id: 'sidebar-100',
                    target: 'loginData',
                    viewComponent: 'vc-counterfeit-store111',
                    dataSource: 'abnormal_shop_report111',
                    localeSource: 'login.json',
                }
            ]
        }, 
        {
            id: 'sidebar-04',
            //target: null,
            submenu: [
                {
                    id: 'sidebar-05',
                    submenu: [
                        {
                            id: 'sidebar-06',
                            target: 'LowpriceProduct'
                        },
                        {
                            id: 'sidebar-07',
                            target: 'LowpriceStore'
                        }
                    ]
                },
                {
                    id: 'sidebar-08',
                    submenu: [
                        {
                            id: 'sidebar-09',
                            target: 'TransshipmentProduct'
                        },
                        {
                            id: 'sidebar-10',
                            target: 'TransshipmentStore'
                        }
                    ]
                }
            ]

        },
        {
            id: 'sidebar-11',
            target: 'Setting',
            viewComponent: 'vc-settings',
            dataSource: 'settings_ac',
            localeSource: 'settingsView.json'
        },
        {
            id: 'sidebar-12',
            target: 'MyAccount'
        }
    ];
   
    let _appViewState = {
        currentRoute: null,
        currentTitle: '',
        lang: 'cn'
    };

    let _appViewModel = {
        sideMenu: _sidemenuModel,
        locales: null
    };

    let _appDataModel = {
        //test: 'Namie Amuro'

    };

    let _localeSources = [
        {
            path: '/',
            source: 'app.json'
        }
    ];

    function _localesLoader(i, accumulator, callback){
        if (true === wna.IsNullOrEmpty(_localeSources)){
            return;
        }
        if (i >= _localeSources.length){
            callback(accumulator);
            return;
        }

        let localesrc = _localeSources[i];
        let url = ['locales', localesrc.source].join('/');

        console.log('------------ try loading locale for ', localesrc.path, localesrc.source, _localeSources.length);
        $.ajax({
            method: 'GET',
            url: url,
            success: function(data){
                if (true === wna.IsNullOrEmpty(data)){
                    throw new Exception("Failed to load locale file", "Locale", localesrc.path);
                }
                if (true === wna.IsNullOrUndefined(accumulator)){
                    accumulator = {};
                }
                if (true === wna.IsNullOrUndefined(accumulator.cn)){
                    accumulator.cn = {};
                }
                if (true === wna.IsNullOrUndefined(accumulator.en)){
                    accumulator.en = {};
                }

                if (true !== wna.IsNullOrEmpty(data.cn)){
                    if ('/' === localesrc.path){
                        _.merge(accumulator.cn, data.cn);
                    }else{
                        let entry = {};
                        entry[localesrc.path] = data.cn;
                        _.merge(accumulator.cn, entry);
                    }
                }

                if (true !== wna.IsNullOrEmpty(data.en)){
                    if ('/' === localesrc.path){
                        _.merge(accumulator.en, data.en);
                    }else{
                        let entry = {};
                        entry[localesrc.path] = data.en;
                        _.merge(accumulator.en, entry);
                    }
                }

                return _localesLoader(++i, accumulator, callback);
            },
            error: function(jqXHR, textStatus, errorThrown){
                throw new Exception("Failed to load locale file: " + textStatus, "Locale", localesrc.path);
            }
        });
    }

    function _sidemenu_flattener(en){
        if (true !== wna.IsNullOrEmpty(en.submenu)){
            return [en, _.flatMapDeep(en.submenu, _sidemenu_flattener)];
        }
        return [en];
    }


    const routes = _.chain(_sidemenuModel).flatMapDeep(_sidemenu_flattener).filter((en) => {
        return ((true !== wna.IsNullOrEmpty(en.target)) && (true !== wna.IsNullOrEmpty(en.viewComponent)));
    }).map((en) => {   

        let localesrc = en.localeSource;
        if (true !== wna.IsNullOrEmpty(localesrc)){
            _localeSources.push({
                path: '/' + en.target,
                source: localesrc
            });
        }

        return {
            path: '/' + en.target,
            props: (function(o){
                return function(r){
                    let path = o.target;
                    let slotProps = {
                        path
                    };
/*
                    Object.defineProperty(slotProps, 'locale', {
                        get: function(){
                            console.log('---------- locale getter is invoked for ', path);
                            return _.pick(_appViewModel.locales[_appViewState.lang], ['shared', path]);
                        }
                    });
*/
                    return slotProps;
                    /*
                    let locale = _appViewModel.locales[_appViewState.lang];
                    locale = _.pick(locale, [o.target, 'shared']);
                    let path = en.target;
                    let menu = en.id;
                    //let ret = { locale }; //{ path: r.path, locale: locale };
                    //console.log('------- route prop ', ret);
                    return { path, locale };
                    */

                };
            })(en),
            component: Vue.component(en.viewComponent),
            dataSource: en.dataSource,
            menuid: en.id
        };
    }).value();

    routes.push( {
        path: "/login",
        component:Vue.component("vc-loginwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/register",
        component:Vue.component("vc-registerwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/forgetPassword",
        component:Vue.component("vc-forgetpasswordwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/resetPassword",
        component:Vue.component("vc-resetpasswordwarp"),
        meta:{
            requireAuth:true,//验证用户能不能跳转这个页面true能false不能
        }
    },
    {
        path: "/",
        redirect: "/login"
    });
    const router = new VueRouter({
        // mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
        routes
    });

    //app zapper
    $(document).ready(function () {
        //load locales
        if (true !== wna.IsNullOrEmpty(_localeSources)) {
            _localesLoader(0, {}, function (locales) {
                console.log('--------- loaded locales: ', locales);
                _appViewModel.locales = locales;

                let vapp = new Vue({
                    el: '#pagewrap',
                    router: router,
                    data: {
                        model: _appDataModel,
                        viewModel: _appViewModel,
                        viewState: _appViewState,
                    },
                    methods: {
                        /* This will complicate the logic, use local computed property for component-specific locale
                        onRegisterLocales: function(arg){
                            console.log('-------------- onRegisterLocales for ', arg.path, arg.locales);
                        }
                        */
                        onLoginout:function(){
                            this.$router.push({path:'/'})
                        },
                        onRequestData: function (path, startDate, endDate, args, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });

                            //console.log('--------------- onRequestData: ', arguments);
                            _fetchFromDataSource(route.dataSource, startDate, endDate, args, callback, sender);
                        },
                        onRequestExport: function (path, conditions, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });

                            console.log('-------- trigger download of exported datta: ', path, conditions);
                            _downloadFileWith(route.dataSource, conditions);
                        },
                        onRequestLaunch: function (path, ids, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });
                            let args = {
                                'key': 'update_rights_status',
                                'ResultId': Array.prototype.join.call(ids, ','),
                                "RightsProtectionStatus": "2"
                            };

                            _updateDataSource(route.dataSource, args, callback, sender);
                        },
                        onRequestUpload: function (path, files, callback, sender) {
                            let thisvue = this;
                            let route = _.find(routes, { path: '/' + path });
                            let args = {
                                'UserId': 1
                            };

                            _uploadToBackend(route.dataSource, files, args, callback, sender);
                        },
                        onLangButtonClicked: function(ev){
                            let thisvue = this;
                            let lang = null;
                            if ('cn' === thisvue.viewState.lang){
                                lang = 'en';
                            }else{
                                lang = 'cn';
                            }
                            thisvue.viewState.lang = lang;
                        },
                        makeCurrentTitle: function () {
                            let thisvue = this;
                            let route = _.find(routes, { path: thisvue.$router.currentRoute.path });
                            let locale = _appViewModel.locales[_appViewState.lang];
                            if ((true !== wna.IsNullOrEmpty(route)) && (true !== wna.IsNullOrEmpty(route.menuid))) {
                                thisvue.viewState.currentTitle = locale.sidemenu[route.menuid];
                                thisvue.viewState.currentMenuId = 'pagehead-' + route.menuid;
                            } else {
                                thisvue.viewState.currentTitle = '';
                                thisvue.viewState.currentMenuId = '';
                            }
                        }
                    },
                    watch: {
                        $route(to, from) {
                            this.viewState.currentRoute = this.$router.currentRoute.path;
                            this.makeCurrentTitle();
                        },
                        'viewState.lang': function(){
                            this.makeCurrentTitle();
                        }
                    },
                    computed: {
                        renderForCurrentHtml:function(){
                            return this.$route.path == '/login' || this.$route.path == '/register' || this.$route.path == '/forgetPassword' || this.$route.path == '/resetPassword'
                        },
                        localeForCurrentRoute: function(){
                            let thisvue = this;
                            let locales = thisvue.currentLocale;
                            let route = thisvue.viewState.currentRoute;
                            let locale = _appViewModel.locales[_appViewState.lang];
                            console.log(locale)
                            /*
                            let locale = _.merge({}, locales[route], { shared: locales['shared'] });
                            return locale;
                            */
                           if (true === wna.IsNullOrEmpty(route)){
                               return null;
                           }
                            console.log('------------- getting localeForCurrentRoute: ', route, locales[route]);
                            return locales[route];
                        },
                        currentLocale: function(){
                            let thisvue = this;
                            return thisvue.viewModel.locales[thisvue.viewState.lang];
                        }
                    },
                    beforeMount: function(){
                        // this.xxx = this.$route.path == 'login' || this.$route.path == 'register'
                        this.viewState.currentRoute = this.$router.currentRoute.path;
                        this.makeCurrentTitle();
                    },
                    mounted: function () {
                        /*
                        this.viewState.currentRoute = this.$router.currentRoute.path;
                        this.makeCurrentTitle();
                        */
                    }
                });

                console.log('----- vue app inited');
            });
        }

    });
    
})();