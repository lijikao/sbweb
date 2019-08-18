(function() {
  Vue.component("vc-registerwarp", {
    template: `
    <div id="content">
    <div class="register-container">
        <div class="register-box">
                <div id="register-form">
                        <h2 class="login-title">{{ register.en.registerTitle }}</h2>
                        <form>
                            <div class="form-group" data-status="success">
                                    <em style="color: #CD454A;">*</em>
                                <input type="text" class="form-control"  :placeholder="register.en.inputName">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{ register.en.inputNameInfo }}</p>
                            </div>
                            <div class="form-group" data-status="success">
                                    <em style="color: #CD454A;">*</em>
                                    <input type="text" class="form-control"  :placeholder="register.en.inputAdress">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputAdressInfo}}</p>
                                </div>
                                <div class="form-group" data-status="success">
                                        <em style="color: #CD454A;">*</em>
                                        <input type="text" class="form-control"  :placeholder="register.en.inputCompany">
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputCompanyInfo}}</p>
                                    </div>
                            <div class="form-group" data-status="false">
                                    <em style="color: #CD454A;">*</em>
                            <input type="password" class="form-control" id="registerPassword1" :placeholder="register.en.inputPassword">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputPasswordInfo}}</p>
                                    <div class="status-tips">
                                            <div class="strength">
                                                <p>{{register.en.statusTips}}</p>
                                                <div class="strength-box" data-status="low">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                                <p class="strength-info">{{register.en.passwordStatus}}</p>
                                            </div>
                                            <p class="strength-status" data-status="success"><span></span>{{register.en.strengthStatus1}} </p>
                                            <p class="strength-status" data-status="false"><span></span>{{register.en.strengthStatus2}} </p>
                                            <p class="strength-status" data-status="success"><span></span>{{register.en.strengthStatus3}} </p>
                                        </div>
                            </div>
                            <div class="form-group" data-status="false">
                                    <em style="color: #CD454A;">*</em>
                                    <input type="password" class="form-control"  :placeholder="register.en.inputConfirm">
                                    <span class="input-status"></span>
                                    <p class="status-info">{{register.en.inputConfirmInfo}}</p>
                            </div>
                            <div class="form-group" data-status="false">
                                    <div class="input-group">
                                        <div class="input-group-addon">{{register.en.inputNumberMobile}}</div>
                                        <input type="password" class="form-control"  :placeholder="register.en.inputMobile">
                                    </div>
                                        <span class="input-status"></span>
                                        <p class="status-info">{{register.en.inputMobileInfo}}</p>
                            </div>
                            <div class="form-group code-verification" data-status="false">
                                <input type="text" class="form-control"  :placeholder="register.en.inputVerification">
                                <button type="button" class="btn btn-default">{{register.en.inputVerificationBtn}}</button>
                                <span class="input-status"></span>
                                <p class="status-info">{{register.en.inputVerificationInfo}}</p>
                            </div>
                            
                            <button type="submit" class=" submit btn btn-default">{{ register.en.signIn }}</button>
                            <p class="help-block">{{ register.en.helpBlock }}<a :href="register.en.helpBlockLink">{{ register.en.helpBlockInfo }}</a>  </p>
                        </form>
                </div>
        </div>
    </div>
</div>

    `,
    props: ['model', 'locale'],
    created(){
        console.log('login page')
    },
    data:function(){
      return {
        register:{
            en:{
                registerTitle:"Sign up",
                inputName:'Account name',
                inputNameInfo:'Username is 5-25 characters and needs to contain letters.',
                inputAdress:'Email address',
                inputAdressInfo:'Username is 5-25 characters and needs to contain letters.',
                inputCompany:'Company name',
                inputCompanyInfo:'Username is 5-25 characters and needs to contain letters.',
                inputPassword:'Password',
                inputPasswordInfo:'Username is 5-25 characters and needs to contain letters.',
                statusTips:'Strength',
                passwordStatus:'Low',
                strengthStatus1:'5 to 25 charcters',
                strengthStatus2:'Contains only letters,numbers and symbols ',
                strengthStatus3:'Contains at least two of the following: letters,numbers,symbols.',
                inputConfirm:'Password',
                inputConfirmInfo:'Username is 5-25 characters and needs to contain letters.',
                inputMobile:'Mobile number',
                inputNumberMobile:'+86',
                inputMobileInfo:'Username is 5-25 characters and needs to contain letters.',
                inputVerification:'Verification code',
                inputVerificationBtn:'Get code',
                inputVerificationInfo:'Username is 5-25 characters and needs to contain letters.',
                signIn:'Sign in',
                helpBlock:'Don’t have an account?',
                helpBlockInfo:'Sign up',
                helpBlockLink:'#', 
            }
        }
      }
    },
    methods:{

    }
});
})();
