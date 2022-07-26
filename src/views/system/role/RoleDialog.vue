<template>
  <el-dialog :visible.sync="dialogVisible" :title="title">
    <el-form
      :model="role"
      label-width="80px"
      label-position="left"
      :rules="rules"
      ref="roleForm"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="菜单">
        <tree-transfer
          :from_data="authTree"
          :title="treeTitle"
          :to_data="selectedAuthTree"
          :defaultProps="{ label: 'label' }"
          @add-btn="add"
          @remove-btn="remove"
          height="540px"
          filter
        >
        </tree-transfer>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="danger" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmRole">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import treeTransfer from "el-tree-transfer";
import { deepClone } from "@/utils";
import { getSelectTree, getSelectedTree } from "@/api/system";
export default {
  props: {
    role: {
      type: Object,
      default: {},
    },
    dialogType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      toData: [],
      treeTitle: ["权限库", "已分配权限"],
      defaultAuthTree: [],
      authTree: [],
      selectedAuthTree: [],
      rules: {
        roleName: [
          { required: true, message: "角色不能为空", trigger: "blur" },
          { max: 10, message: "长度在 10 个字符以内", trigger: "blur" },
        ],
      },
      menuOptions: [],
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  components: { treeTransfer },
  created() {
    this.$on("openDialog", function () {
      this.$nextTick(() => {
        this.$refs.roleForm && this.$refs.roleForm.clearValidate();
      });
      this.authTree = [];
      this.selectedAuthTree = [];
      this.dialogVisible = true;
    });
  },
  computed: {
    routesData() {
      return this.routes;
    },
    title() {
      return this.dialogType === "new" ? "新增角色" : "编辑角色";
    },
  },
  methods: {
    formatTreeList(targetData) {
      const res = [];
      for (let item of targetData) {
        const data = {
          id: Number(item.menuId),
          pid: Number(item.parentId),
          label: item.menuName,
        };
        if (item.children.length > 0) {
          data.children = this.formatTreeList(item.children);
        }
        res.push(data);
      }
      return res;
    },
    getUnselectTree(dataA, dataB) {
      let targetA = this.toLine(dataA);
      let targetB = this.toLine(dataB);
      let targetBIdArr = targetB.map((item) => item.id);
      let targetChildren = targetA.filter((item) => {
        return !targetBIdArr.includes(item.id);
      });
      let targetPidArr = targetChildren.map((item) => item.pid);
      let targetParent = targetA.filter((item) => {
        return targetPidArr.includes(item.id);
      });
      let targetArr = targetChildren.concat(targetParent);
      let obj = {};
      let target = targetArr.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []);
      let targetTree = this.toTree(target);
      return targetTree;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    confirmRole() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (this.menuOptions.length > 0) {
            this.$emit("confirm-role", this.role, this.menuOptions);
            this.closeDialog();
          } else {
            this.$confirm("权限未选择，请选择角色对应权限?", "提示", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            });
          }
          // this.$message.success(`${this.title}成功`);
        } else {
          // this.$message.error(`${this.title}失败`);
          return false;
        }
      });
    },
    toLine(data) {
      const result = data.reduce(
        (arr, { id, label, pid, children = [] }) =>
          arr.concat([{ id, label, pid }], this.toLine(children)),
        []
      );
      return result;
    },
    toLineId(data) {
      const result = data.reduce((arr, { id, children = [] }) => {
        return arr.concat([id], this.toLineId(children), []);
      }, []);
      return result;
    },
    toTree(data) {
      let cloneData = JSON.parse(JSON.stringify(data));
      let tree = cloneData.filter((father) => {
        let branchArr = cloneData.filter((child) => {
          return father.id == child.pid;
        });
        if (branchArr.length > 0) {
          father.children = branchArr;
        }
        return father.pid == 0;
      });
      return tree;
    },
    async setAuthTree() {
      const res = await getSelectTree();
      this.defaultAuthTree = this.formatTreeList(res.data);
      const defaultAuth = this.defaultAuthTree;
      if (this.dialogType === "new") {
        this.menuOptions = [];
        this.authTree = defaultAuth;
        this.selectedAuthTree = [];
      } else {
        const { data } = await getSelectedTree(this.role.roleId);
        this.selectedAuthTree = [];
        const selectedAuthTree = this.formatTreeList(data);
        this.menuOptions = this.toLineId(selectedAuthTree);
        this.authTree = [];
        this.authTree = this.getUnselectTree(defaultAuth, selectedAuthTree);
        this.selectedAuthTree = selectedAuthTree;
      }
    },
    add(authTree, selectedAuthTree, obj) {
      const { keys, nodes } = obj;
      const toIds = [
        ...new Set(
          nodes.reduce((pre, { pid, id }) => {
            return pre.concat([pid, id]);
          }, [])
        ),
      ];
      this.menuOptions = this.menuOptions.concat(toIds);
    },
    remove(authTree, selectedAuthTree, obj) {
      this.menuOptions = this.menuOptions.filter(function (val) {
        return obj.keys.indexOf(val) === -1;
      });
    },
  },
  watch: {
    role: {
      immediate: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.setAuthTree();
        });
      },
    },
  },
};
</script>

<style>
</style>