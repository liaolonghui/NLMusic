<template>
  <el-card>
    <el-row>
      <el-col :span="16">
        <h2>音乐流派</h2>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="isShow = true">添加音乐流派</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="name"
        label="流派"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="showEditModal(scope.row._id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteStyleTag(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog
      :title="editTitle"
      :visible.sync="isShow"
      width="40%"
      :before-close="handleClose">
      <el-form :model="styleForm" :rules="rules" ref="styleFormRef" label-width="100px">
        <el-form-item label="流派" prop="name">
          <el-input v-model="styleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="styleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createOrUpdateStyle">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      isShow: false,
      styleForm: {},
      rules: {
        name: { required: true, message: '流派名不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
      }
    }
  },
  methods: {
    // 显示编辑对话框
    showEditModal(id) {
      this.isShow = true;
      if (id) {
        this.getOneStyle(id);
      }
    },
    // 关闭编辑对话框时清空表单
    handleClose() {
      this.$refs['styleFormRef'].resetFields();
      this.styleForm = {};
      this.isShow = false;
      this.$message.info('操作已取消');
    },
    // 添加或更新标签
    createOrUpdateStyle() {
      this.$refs['styleFormRef'].validate(async (valid) => {
        if (valid) {
          const id = this.styleForm._id || ''
          if (id) {
            await this.$http.put(`tag/updateStyle/${id}`, this.styleForm);
            this.$message.success('修改成功！');
          } else {
            await this.$http.post('tag/addStyle', this.styleForm);
            this.$message.success('添加成功！');
          }
          this.$refs['styleFormRef'].resetFields();
          this.styleForm = {};
          this.isShow = false;
          // 获取最新数据
          this.getStyleTag();
        } else {
          return false;
        }
      });
    },
    // 删除标签
    async deleteStyleTag(row) {
      const msg = await this.$confirm(`此操作将删除流派“${row.name}”, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err;
      });
      if (msg == 'confirm') {
        await this.$http.delete(`tag/deleteStyle/${row._id}`);
        this.$message.success('删除成功！');
        this.getStyleTag();
      } else {
        this.$message.info('已取消删除！');
      }
    },
    // 获取所有标签
    async getStyleTag(){
      const res = await this.$http.get('tag/style');
      if (res.status == 200) {
        this.tableData = res.data;
      }
    },
    // 获取标签详情
    async getOneStyle(id) {
      const res = await this.$http.get(`tag/style/${id}`);
      this.styleForm = res.data;
    }

  },
  created() {
    this.getStyleTag();
  },
  computed: {
    editTitle() {
      return this.styleForm._id ? '更新标签' : '添加标签';
    }
  }
}
</script>