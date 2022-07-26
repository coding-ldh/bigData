<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="430px"
      class="dialogModify"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="modifyObj"
        label-width="90px"
        label-position="center"
        ref="editForm"
        :rules="rules"
      >
        <el-form-item label="序号" prop="index">
          <el-input v-model="modifyObj.index" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="modifyObj.menuName" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单级别">
          <el-select
            v-model="modifyObj.menuLevel"
            @change="levelChange($event)"
          >
            <el-option
              v-for="(item, index) in this.Level"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="supMenu">
          <el-select v-model="modifyObj.supMenu" :disabled="supMenuCtrl">
            <el-option
              v-for="(item, index) in this.FirstMenuList"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon " v-if="admin">
          <el-input
            v-model="modifyObj.icon"
            style="width: 200px"
            :disabled="iconCtrl"
          />
        </el-form-item>
        <el-form-item label="path " prop="path" v-if="admin">
          <el-input v-model="modifyObj.path" style="width: 200px" />
        </el-form-item>
        <el-form-item label="component " v-if="admin">
          <el-input v-model="modifyObj.component" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="modifyObj.status"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </el-form-item>
        <el-form-item label="权重 " prop="orderNum">
          <el-input v-model="modifyObj.orderNum" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="danger" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmMenu">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogAdd"
      :title="title"
      width="430px"
      class="dialogModify"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="addObj"
        label-width="90px"
        label-position="center"
        ref="addForm"
        :rules="rules"
      >
        <el-form-item label="序号" prop="index">
          <el-input v-model="addObj.index" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addObj.menuName" style="width: 200px" />
        </el-form-item>
        <el-form-item label="菜单级别">
          <el-select v-model="addObj.menuLevel" @change="levelChange($event)">
            <el-option
              v-for="(item, index) in this.Level"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="supMenu">
          <el-select v-model="addObj.supMenu" :disabled="supMenuCtrl">
            <el-option
              v-for="(item, index) in this.FirstMenuList"
              :key="index"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon ">
          <el-input
            v-model="addObj.icon"
            style="width: 200px"
            :disabled="iconCtrl"
          />
        </el-form-item>
        <el-form-item label="path " prop="path" >
          <el-input v-model="addObj.path" style="width: 200px" />
        </el-form-item>
        <el-form-item label="component ">
          <el-input v-model="addObj.component" style="width: 200px" />
        </el-form-item>
        <el-form-item label="权重 " prop="orderNum">
          <el-input v-model="addObj.orderNum" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="addObj.status"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="danger" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { validatePass, validateIndex, validateOrderNum } from "./menuRule.js";
import { ChangeMenuList, AddMenuList } from "@/api/menuCtrl";
import { cacheParamList } from "@/utils/tool.js";
export default {
  props: {
    title: {
      type: String,
    },
    AllList: {
      type: Array,
    },
    AllShowId: {
      type: Array,
    },
    editObj: {
      type: Object,
    },
    AllFirstMenu: {
      type: Array,
    },
  },
  data() {
    return {
      admin: false,
      Level: ["一级菜单", "二级菜单"],
      FirstMenuList: [],
      rules: {
        index: [
          {
            required: true,
            type: "number",
            transform(value) {
              return Number(value);
            },
            message: "必须数字",
          },
          { validator: validateIndex, trigger: "blur" },
        ],
        menuName: [
          {
            required: true,
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
          { required: true, validator: validatePass, trigger: "blur" },
          8,
        ],
        path: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        supMenu: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        orderNum: [
          {
            required: true,
            type: "number",
            transform(value) {
              return Number(value);
            },
            message: "必须数字",
          },
          { validator: validateOrderNum, trigger: "blur" },
        ],
      },
      dialogVisible: false,
      dialogAdd: false,
      supMenuCtrl: false,
      iconCtrl: false,
      parentId: [],
      addObj: {
        menuLevel: "一级菜单",
        supMenu: "",
      },
    };
  },
  watch: {
    AllFirstMenu: {
      immediate: true,
      handler: function (val) {
        this.FirstMenuList = val; //拿到所有一级菜单
      },
    },
  },
  computed: {
    modifyObj: function () {
      this.supMenuCtrl = this.editObj.menuLevel == "一级菜单" ? true : false;
      this.iconCtrl = this.editObj.menuLevel == "二级菜单" ? true : false;
      return this.editObj;
    },
  },
  methods: {
    confirmMenu() {
      // console.log("confirm");
      // 序号是否重复
      if (this.AllShowId.includes(Number(this.modifyObj.index))) {
        const index = this.AllList.filter((_) => {
          // 筛选该序号下的一条数据进行判断
          return _.showId == Number(this.modifyObj.index);
        });
        if (Number(index[0].menuId) != Number(this.modifyObj.id)) {
          this.$message.error(
            `重复序号：${this.modifyObj.index}，重复名称:${index[0].menuName}`
          );
        } else {
          this.ruleMenu();
        }
      } else {
        this.ruleMenu();
      }
    },
    ruleMenu() {
      this.$refs.editForm.validate((valid) => {
        if (this.modifyObj.menuName == this.modifyObj.supMenu) {
          return this.$message.error(`${this.title}失败,上级菜单不可为自己`);
        }
        if (valid) {
          this.onConfirmMenu(this.modifyObj);
        } else {
          this.$message.error(`${this.title}失败`);
        }
      });
    },
    async onConfirmMenu(val) {
      // console.log(val);
      this.parentId =
        val.supMenu != "无"
          ? this.AllList.filter((_) => {
              return val.supMenu == _.menuName;
            })
          : this.parentId;
      const data = await ChangeMenuList({
        menuId: val.id,
        showId: val.index,
        menuName: val.menuName,
        orderNum: val.orderNum,
        visible: val.status,
        parentId: val.supMenu == "无" ? 0 : this.parentId[0].menuId, // 处理
        icon: val.icon == null ? "" : val.icon,
        path: val.path == null ? "" : val.path,
        component: val.component == null ? "" : val.component,
      });
      if (data.data == true) {
        this.$message.success(`${this.title}成功`);
        this.closeDialog();
        this.$emit("confirm-menu");
      } else {
        this.$message.error(`${this.title}失败`);
      }
    },
    levelChange(val) {
      // console.log(val);
      this.supMenuCtrl = val == "一级菜单" ? true : false;
      this.iconCtrl = val == "二级菜单" ? true : false;
      this.modifyObj.supMenu =
        val == "一级菜单" ? "无" : this.modifyObj.supMenu;
      this.modifyObj.supMenu = val == "二级菜单" ? "" : this.modifyObj.supMenu;
      this.modifyObj.icon = val == "二级菜单" ? "" : this.modifyObj.icon;

      this.addObj.supMenu = val == "一级菜单" ? "无" : this.addObj.supMenu;
      this.addObj.supMenu = val == "二级菜单" ? "" : this.addObj.supMenu;
      this.addObj.icon = val == "二级菜单" ? "" : this.addObj.icon;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogAdd = false;
    },

    confirmAdd() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.onConfirmAdd(this.addObj);
        } else {
          this.$message.error(`${this.title}失败`);
        }
      });
    },
    async onConfirmAdd(val) {
      if (this.AllShowId.includes(Number(val.index))) {
        this.$message.error(`序号重复，重复序号：${val.index}`);
      } else {
        this.parentId =
          val.supMenu != "无"
            ? this.AllList.filter((_) => {
                return val.supMenu == _.menuName;
              })
            : this.parentId;
        const d = await AddMenuList({
          showId: val.index,
          menuName: val.menuName,
          parentId: val.supMenu == "无" ? 0 : this.parentId[0].menuId,
          icon: val.icon,
          path: val.path,
          component: val.component,
          visible: val.status,
          orderNum: val.orderNum,
        });
        if (d.data == true) {
          this.closeDialog();
          this.$emit("confirm-menu");
          this.$message.success(`添加成功`);
          this.addObj = {};
        } else {
          this.$message.error(`添加失败`);
        }
      }
    },
  },
  created() {
    if (this.$store.getters.userInfo.roles == "开发者") {
      this.admin = true;
      this.tip = "（欢迎，开发者）";
    } else {
      this.admin = false;
    }
    this.$on("openDialog", function (val) {
      if (val == 1) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate();
        });
      } else if (val == 2) {
        this.dialogAdd = true;
        this.levelChange("一级菜单");
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate();
        });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.dialogModify .dialogAdd {
  .el-dialog__header {
    padding: 50px;
  }
}
</style>