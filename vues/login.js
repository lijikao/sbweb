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