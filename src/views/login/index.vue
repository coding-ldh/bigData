
<template>
  <div class="login-container">
    <div key="" class="login-container-left">
      <div key="" class="longin-title">
        <img
          class="systeam-icon"
          src="../../assets/images/longinTitleIcon.png"
        />
        <span class="systeam-name">大数据平台</span>
      </div>
      <!-- div -->
      <img class="droImg" src="../../assets/images/longinLeft2.png" alt="" />
    </div>
    <div class="login-container-right">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="flex-warp">
          <!-- 标题 -->
          <div class="title-container">
            <h3 class="title">大数据平台</h3>
          </div>
        </div>
        <div class="flex-warp">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <span class="svg-container">
              <!-- <svg-icon icon-class="user" /> -->
              <img src="../../assets/images/userName.png" alt="" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
        </div>
        <div class="flex-warp">
          <!-- 密码 -->
          <el-tooltip
            v-model="capsTooltip"
            content="Caps lock is On"
            placement="right"
            manual
          >
            <el-form-item prop="password">
              <span class="svg-container">
                <img src="../../assets/images/passWord.png" alt="" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
          </el-tooltip>
        </div>
        <div class="flex-warp">
          <!-- 登录 -->
          <el-button
            :loading="loading"
            type="primary"
            class="loginBTN"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import SocialSign from "./components/SocialSignin";

export default {
  name: "Login",
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6个字符"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      // this.$router.push({
      //   path: "/user-portrait/trafficPortrait",
      // });
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: "/index",
              });
              // this.$router.push({
              //   path: this.redirect || "/",
              //   query: this.otherQuery,
              // });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #ffffff;
$light_gray: #9ea6b2;
$cursor: rgb(12, 0, 0);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item {
    margin-bottom: 5%;
  }
  .el-form-item__content {
    display: flex;
    height: 70px;
    margin: 15px 50px;
    border: 1px solid rgba(205, 205, 205, 0.5);
    border-radius: 16px;
  }
  .el-input {
    width: 85%;
    margin-right: 15px;
    input {
      font-size: 18px;
      border: none;
      height: 66px;
      box-sizing: border-box;
      caret-color: $cursor;
      padding: 0;
      // background: red;
      // background: red;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: url("../../assets/images/PCbeijing.png");
$dark_gray: #999999;
$light_gray: #eee;
$imgSizeW: 650px;
$imgSizeH: 482px;

.login-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  background: linear-gradient(
    226deg,
    rgba(255, 229, 178, 0.53) 0%,
    rgba(152, 218, 222, 0) 49%,
    #69acfa 100%
  );
  background-image: url("../../assets/images/indexBG2.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;
  overflow: hidden;
  .login-container-left,
  .login-container-right {
    width: 50%;
    .droImg {
      display: block;
      width: $imgSizeW;
      height: $imgSizeH;
      margin-left: 25%;
      margin-top: 18%;
      transition: all 0.5s;
    }
    @media only screen and (max-width: 1580px) {
      .droImg {
        width: $imgSizeW / 1.25;
        height: $imgSizeH / 1.25;
      }
    }
    @media only screen and (max-width: 1200px) {
      .droImg {
        width: $imgSizeW / 2;
        height: $imgSizeH / 2;
      }
    }
  }

  .longin-title {
    // width: 100%;
    display: flex;
    margin-left: 21.46%;
    margin-top: 8.87%;
    color: #000;
    font-size: 32px;
    .systeam-name {
      font-weight: 400;
      margin-left: 15px;
    }
  }
  .login-form {
    width: 60.4%;
    // height: 46.4%; //42.4
    background: #ffffff;
    box-shadow: 0px 0px 34px 1px rgba(84, 79, 79, 0.06);
    margin-top: 21.57%;
    margin-left: 15%;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    .flex-warp {
      flex: 1;
      // box-sizing: border-box;
      // border:1px solid #eee;
    }
  }
  .title-container {
    height: 100%;
    .title {
      line-height: 95px;
      height: 95px;
      font-size: 36px;
      color: #333;
      font-weight: 500;
      text-align: center;
    }
  }

  .svg-container {
    // display: inline-block;
    flex: 1;
    width: 70px;
    // line-height: 66px;
    // height: 100%;
    padding: 20px 25px;
    // padding-top: 1%;
    color: $dark_gray;
    img {
      display: inline-block;
      width: 20px;
      height: 20px;
      // margin-top: 35.71%;
      // vertical-align: middle;
    }
  }

  .show-pwd {
    line-height: 70px;
    height: 70px;
    padding: 0 15px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .loginBTN {
    width: calc(100% - 100px);
    // line-height: 70px;
    height: 70px;
    border-radius: 16px;
    margin: 0 50px;
    margin-bottom: 9.22%;
    font-size: 26px;
    color: #fff;
    font-family: PingFang SC-Semibold, PingFang SC;
  }
}
@media only screen and (max-width: 1000px) {
  .login-container {
    flex-flow: column;
    .login-container-left,
    .login-container-right {
      width: 100%;
      .droImg {
        margin: 5% auto;
      }
      .login-form {
        width: 80.21%;
        height: 458px;
        background: #ffffff;
        box-shadow: 0px 0px 34px 1px rgba(84, 79, 79, 0.06);
        // margin-top: 16.57%;
        margin: 0 auto;
        // margin-left: 15%;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        .flex-warp {
          flex: 1;
        }
      }
    }
  }
}
</style>
