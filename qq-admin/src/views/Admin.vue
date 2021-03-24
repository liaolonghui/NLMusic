<template>
  <el-card>
    <el-row>
      <el-col :span="15">
        <h3>管理员</h3>
        <p>分为超级管理员以及只读管理员。</p>
      </el-col>
      <el-col :span="9">
        <el-tooltip effect="dark" content="只有超级管理员能添加管理员" placement="top">
          <el-button type="warning" @click="dialogVisible = true" :disabled="userLevel">添加管理员</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      :data="adminTable"
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="username"
        label="管理员"
        width="150">
      </el-table-column>
      <el-table-column
        prop="telephone"
        label="电话"
        width="150">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 'root'" type="danger">超级管理员</el-tag>
          <el-tag v-else-if="scope.row.type == 'read'" type="success">普通只读管理员</el-tag>
          <el-tag v-else>未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
            :disabled="userLevel">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="showEditDialog(scope.row._id)" :disabled="userLevel">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteAdmin(scope.row)" :disabled="userLevel">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="handleClose">
        <el-form :model="adminForm" :rules="adminRules" ref="adminForm" label-width="80px">
          <el-form-item label="管理员" prop="username">
            <el-input v-model="adminForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="adminForm.telephone"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="adminForm.type" placeholder="请选择">
              <el-option label="超级管理员" value="root"></el-option>
              <el-option label="普通只读管理员" value="read"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      adminTable: [],
      dialogVisible: false,
      adminForm: {
        state: true,   // 状态默认为true（可理解为当前账号正常运行，设为false时账号变为只读权限。）
      },
      adminRules: {
        username: { required: true, message: '管理员不能为空', trigger: 'blur' },
        // password: { required: true, message: '密码不能为空', trigger: 'blur' },  因为有可能不改变密码所以干脆不限制密码（为空时是不改变密码）
        telephone: { required: true, message: '手机号不能为空', trigger: 'blur' },
        type: { required: true, message: '请选择管理员类型', trigger: 'blur' },
      }
    }
  },
  methods: {
    // 状态改变
    async changeState(admin) {
      const res = await this.$http.put(`rest/changeState/${admin._id}`, {state: admin.state});
      if (res.status === 200) {
        this.$message.success('状态改变成功');
      }
    },
    // 关闭对话框
    handleClose() {
      this.$refs['adminForm'].resetFields();
      this.dialogVisible = false;
    },
    // 显示对话框
    async showEditDialog(id) {
      if (id) {
        const res = await this.$http.get(`rest/admin/${id}`);
        this.adminForm = res.data;
        this.dialogVisible = true;
      }
    },
    // 添加或修改
    addOrUpdateAdmin() {
      this.$refs['adminForm'].validate( async (valid) => {
        if (valid) {
          const id = this.adminForm._id || '';
          if (id) {
            await this.$http.put(`rest/updateAdmin/${id}`, this.adminForm);
            this.$message.success('修改成功');
          } else {
            await this.$http.post('rest/addAdmin', this.adminForm);
            this.$message.success('添加成功');
          }
          this.$refs['adminForm'].resetFields();
          this.getAdmins();
          this.dialogVisible = false;
        }
      });
    },
    // 删除
    async deleteAdmin(admin) {
      const msg = await this.$confirm(`是否删除管理员“${admin.username}?”`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (msg === 'confirm') {
        await this.$http.delete(`rest/deleteAdmin/${admin._id}`);
        this.$message.success(`删除管理员“${admin.username}”成功！`);
        this.getAdmins();
      } else {
        this.$message.info('操作已取消');
      }
    },
    // 获取所有管理员
    async getAdmins() {
      const res = await this.$http.get('rest/adminList');
      if (res.status>=200 && res.status<300 || res.status==304) {
        this.adminTable = res.data;
      } else {
        this.$message.error('管理员数据获取失败！');
      }
    }
  },
  created() {
    this.getAdmins();
  },
  computed: {
    dialogTitle() {
      return this.adminForm._id ? '修改管理员信息' : '添加管理员';
    },
    // 是否是超级管理员
    userLevel() {
      return !(localStorage.userType==='root')
    }
  }
}
</script>