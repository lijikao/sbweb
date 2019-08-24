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