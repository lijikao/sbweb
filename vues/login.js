(function() {
  Vue.component("vc-loginwarp", {
    template: `
  <div id='content'>
    <div id="login-adv">
        <div class="main-info">{{lang}}
            <h3>{{locale.mainInfo}}</h3>
            <p>{{ locale.subInfo }}</p>
        </div>
    </div>
    <div id="login-form">
        <h2 class="login-title">{{ locale.loginTitle }}</h2>
        <div class="password-status-info">
            <p>重置密码尚未激活，请<a href="#">查看激活邮件</a>，激活后重新登录</p>
        </div>
        <div class="email-status-info">
            <p>邮箱地址尚未激活，请<a href="#">查看激活邮件</a>，激活后重新登录</p>
        </div>
        <div class="login-status-info">
            <span></span>
            <p>{{ locale.loginStatusinfo }}</p>
        </div>
        <form>
            <div class="form-group">
                <input type="text" class="form-control" :placeholder=" locale.inputName ">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" :placeholder=" locale.inputPassword ">
            </div>
            <div class="checkbox">
                <label v-on:click="checkboxToggle">
                    <span class="s-checkbox" type="checkbox" :class="{'active':isActive}"></span> {{ locale.rememberMe
                    }}
                </label>
                <p class="forget-password"><a href="javascript:void(0);" @click="goToPassword">{{ locale.forget }}</a>
                </p>
            </div>
            <div class="form-group">
                <div id="check-slide"></div>
            </div>
            <button type="submit" class="submit btn btn-default" @click="goToLogin">{{ locale.signIn }}</button>
            <p class="help-block">{{ locale.helpBlock }}<a href="#" @click="goToRegister">{{ locale.helpBlockInfo
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
        isActive: false
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
