(function(){
    Vue.component('vc-loginwarp', {
        template: `
            <div id='content'>嘻嘻嘻是多少www嘻都是嘻444嘻嘻嘻寻寻寻寻寻
              <button v-on:click="xxx">xxxx</buuton>
            
            </div>
        `,
        props: ['model', 'locale'],
        created(){
            console.log('login page')
        },
        methods:{
          xxx:function(){
            // window.location.pathname = '/register'
            debugger
            this.$router.push({  //核心语句
              path:'/register',   //跳转的路径
              // query:{           //路由传参时push和query搭配使用 ，作用时传递参数
              //   id:this.id ,  
              // }
            })
          }
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