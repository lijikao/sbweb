(function () {
    Vue.component("vc-registerwarp", {
        template: `
    <div id="content">
    <div class="register-container">
        <div class="register-box">
                <div id="register-form">
                        <h2 class="login-title">{{ locale.registerTitle }}</h2>
                        <form>
                            <div class="form-group" :data-status="Verification.inputName.status">
                                <em style="color: #CD454A;" v-if="Verification.inputName.icon">*</em>
                                <input type="text" class="form-control" :placeholder="locale.inputName" v-model="Verification.inputName.value" @blur="validateFunc('inputName')" @focus="resetDefault('inputName')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{ locale.inputNameInfo }}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputAdress.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputAdress.icon">*</em>
                                    <input type="text" class="form-control"  :placeholder="locale.inputAdress" v-model="Verification.inputAdress.value" @blur="validateFunc('inputAdress')" @focus="resetDefault('inputAdress')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputAdressInfo}}</p>
                                </div>
                                <div class="form-group" :data-status="Verification.inputCompany.status">
                                        <em style="color: #CD454A;" v-if="Verification.inputCompany.icon">*</em>
                                        <input type="text" class="form-control"  :placeholder="locale.inputCompany"  v-model="Verification.inputCompany.value" @blur="validateFunc('inputCompany')" @focus="resetDefault('inputCompany')">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputCompanyInfo}}</p>
                                    </div>
                            <div class="form-group" :data-status="Verification.inputPassword.status">
                                    <em style="color: #CD454A;"  v-if="Verification.inputPassword.icon">*</em>
                            <input type="password" class="form-control" id="registerPassword1" :placeholder="locale.inputPassword" v-model="Verification.inputPassword.value"  @keyup="passwordInput('inputPassword')" @blur="validateFunc('inputPassword')" @focus="resetDefault('inputPassword')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputPasswordInfo}}</p>
                                    <div class="status-tips" :class="{'tipShow':Verification.inputPassword.tips}">
                                            <div class="strength">
                                                <p>{{locale.statusTips}}</p>
                                                <div class="strength-box" :data-status="Verification.inputPassword.strength.level" v-model="level">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <p class="strength-info">{{level}}</p>
                                            </div>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength1"><span></span>{{locale.strengthStatus1}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength2"><span></span>{{locale.strengthStatus2}} </p>
                                            <p class="strength-status" :data-status="Verification.inputPassword.strength.strength3"><span></span>{{locale.strengthStatus3}} </p>
                                        </div>
                            </div>
                            <div class="form-group" :data-status="Verification.inputConfirm.status">
                                    <em style="color: #CD454A;" v-if="Verification.inputConfirm.icon">*</em>
                                    <input type="password" class="form-control" :placeholder="locale.inputConfirm" v-model="Verification.inputConfirm.value" @blur="validateFunc('inputConfirm')" @focus="resetDefault('inputConfirm')">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{locale.inputConfirmInfo}}</p>
                            </div>
                            <div class="form-group" :data-status="Verification.inputMobile.status">
                                    <div class="input-group">
                                        <div class="input-group-addon">{{locale.inputNumberMobile}}</div>
                                        <input type="text" class="form-control"  :placeholder="locale.inputMobile" v-model="Verification.inputMobile.value" @keyup="canClickGetCode(Verification.inputMobile.value)" @blur="validateFunc('inputMobile')" @focus="resetDefault('inputMobile')">
                                    </div>
                                        <span class="input-status"></span>
                                        <p class="status-info">{{locale.inputMobileInfo}}</p>
                            </div>
                            <div class="form-group code-verification" :data-status="Verification.inputVerification.status">
                                <input type="text" class="form-control"  :placeholder="locale.inputVerification" v-model="Verification.inputVerification.value" @blur="validateFunc('inputVerification')" @focus="resetDefault('inputVerification')">
                                <button type="button" class="btn btn-default">{{locale.inputVerificationBtn}}</button>
                                <span class="input-status"></span>
                                <p class="status-info">{{locale.inputVerificationInfo}}</p>
                            </div>
                            
                            <button type="submit" class=" submit btn btn-default" @click="registerr">{{ locale.signIn }}</button>
                            <p class="help-block">{{ locale.helpBlock }}<a href="#" @click="goToLoginPage">{{ locale.helpBlockInfo }}</a>  </p>
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
    props: ["model", "locale", "lang", "sharedLocale"],
        created() {
            console.log('login page')
        },
        data: function () {
            return {
                level:'low',
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
                // user/signup

                let url = `${g_BACKEND_API_BASE_URL}/users/signup` ;
                let data = {
                  "email": "844318239@qq.com",
                  "password": "12345634534578888999",
                  "telnunm": +86-123-456-7890,
                  "company":"我的公司",
                  "username":'ssssss'
                }
                console.log(data);

                
                $.ajax(url, {
                  type: 'POST',
                  data:data,
                  success: function(data){
                    if (this.isRemenber) {
                      this.setLocalStorage("user", this.Verification.inputAdress.value);
                      this.setLocalStorage(
                        "userPassword",
                        this.Verification.inputPassword.value
                      );
                    }
                    this.$router.push({ path: "/CounterfeitProduct" });
                  },
                  error: function(){
                    console.log(1)
                  }
                });

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
                    this.Verification[key].strength.level = level < 2 ? 'low' : (level < 3 ? 'center' :'height');
                    this.level = this.Verification[key].strength.level;
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