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
          <div class="login-status-info">
            <span></span>
            <p>{{ login.en.loginStatusinfo }}</p>
          </div>
          <form>
              <div class="form-group">
                  <input type="text" class="form-control" :placeholder=" login.en.inputName ">
              </div>
              <div class="form-group">
               <input type="password" class="form-control"  :placeholder=" login.en.inputPassword ">
              </div>
              <div class="checkbox">
                <label v-on:click="checkboxToggle">
                  <span class="s-checkbox"  type="checkbox" :class="{'active':isActive}" ></span> {{ login.en.rememberMe }}
                </label>
                <p class="forget-password"><a :href="login.en.forgetLink">{{ login.en.forget }}</a></p>
              </div>
              <div class="form-group">
                <div id="check-slide"></div>
               </div>
               <button type="submit" class=" submit btn btn-default" @click="goToLogin">{{ login.en.signIn }}</button>
               <p class="help-block">{{ login.en.helpBlock }}<a href="#" @click="goToRegister">{{ login.en.helpBlockInfo }}</a>  </p>
            </form>
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
    props: ["model", "locale"],
    created() {
      console.log("registerwarp page");
    },
    methods: {
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
    created() {
      console.log();
    },
    methods: {
      checkboxToggle: function() {
        this.isActive = !this.isActive;
      }
    }
  });
})();
