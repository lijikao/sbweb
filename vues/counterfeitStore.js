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