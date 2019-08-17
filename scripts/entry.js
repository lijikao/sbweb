(function(){
        let _locales = {
            cn:{
                entry:{
                    
                }
            },
            en:{
                entry:{
                    
                }
            }
        }    
        
        const routes1 =[{
            path: "/login",
            // redirect: "/CounterfeitProduct"
        }];
        const routes2 = _.chain(_sidemenuModel).flatMapDeep(_sidemenu_flattener).filter((en) => {
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
        const routes = routes1.concat(routes2)
        routes.push( {
            path: "/",
            redirect: "/login"
        });
    
        const router = new VueRouter({
            //mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
            routes
        });
    
        $(document).ready(function () {
            //load 登录页面
            debugger
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
                            viewState: _appViewState
                        },
                        methods: {
                            /* This will complicate the logic, use local computed property for component-specific locale
                            onRegisterLocales: function(arg){
                                console.log('-------------- onRegisterLocales for ', arg.path, arg.locales);
                            }
                            */
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
                            localeForCurrentRoute: function(){
                                let thisvue = this;
                                let locales = thisvue.currentLocale;
                                let route = thisvue.viewState.currentRoute;
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