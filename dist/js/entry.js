(function(){
    Vue.component('vc-loginwarp', {
        template: `
            <div id='content'>嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻寻</div>
        `,
        props: ['model', 'locale'],
        created(){
            console.log('login page')
        }
    });
})();
// 
/* 
      #content
        #loginAdv
          .mainInfo
            h3 Brand Intelligence & Brand Protection
            p Making digital commerce trustworthy through big data, AI and blockchain
        #login-form
          h2.login-title Log in
            form
              .form-group
                input.form-control(type="text" id="exampleInputName2" placeholder="Jane Doe")
              .form-group
                input.form-control(type="password" class="form-control" placeholder="Password")
              .checkbox
                label
                  span.s-checkbox(class="active" type="checkbox")
                  | Remember me
                p.forget-password
                  a(href='#') Forget Password ?
              .form-group
              button(type="submit" class="btn btn-default") Sign in 
              p.help-block Don’t have an account?
                a(href='#') Sign up
      // /container


*/
(function(){
    Vue.component('vc-registerwarp', {
        template: `
            <div id='content'>哈哈哈哈</div>
        `,
        props: ['model', 'locale'],
        created(){
            console.log('registerwarp page')
        }
    });
})();
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
        let _localeSources = [
            {
                path: '/',
                source: 'entry.json'
            }
        ];
        let _appViewState = {
            currentRoute: null,
            currentTitle: '',
            lang: 'cn'
        };
        let _appViewModel = {
            // sideMenu: _sidemenuModel,
            locales: null
        };
        const routes1 =[{
            path: "/login",
            // redirect: "/CounterfeitProduct"
            component:Vue.component("vc-loginwarp")
        },
        {
            path: "/register",
            // redirect: "/CounterfeitProduct"
            component:Vue.component("vc-registerwarp")
        }
    
      
      ];
        const routes2 = [];
        const routes = routes1.concat(routes2)
        routes.push( {
            path: "/",
            redirect: "/login"
        });
    
        const router = new VueRouter({
            //mode: 'history', //default mode is "hash" mode, history mode allow browser navigation
            routes
        });
    
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
                            // model: _appDataModel,
                            viewModel: _appViewModel,
                            viewState: _appViewState
                        },
                        methods: {
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
                        },
                        watch: {
                           
                        },
                        computed: {
                            currentLocale: function(){
                                let thisvue = this;
                                return thisvue.viewModel.locales[thisvue.viewState.lang];
                            }
                        },
                        mounted: function () {
                            console.log('----- vue app inited');
                        }
                    });
                });
            }
    
        });


    })();