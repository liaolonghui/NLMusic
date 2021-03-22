<template>
  <el-card>
    <el-row>
      <el-col :span="16">
        <h2>国家/地区</h2>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="isShow = true">添加国家/地区</el-button>
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
        prop="country"
        label="国家/地区"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lang"
        label="语种"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="标签添加时间">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        label="标签更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedAt | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="showEditModal(scope.row._id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteCountryTag(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageNum"
      :page-sizes="[6, 10, 15]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- dialog -->
    <el-dialog
      :title="editTitle"
      :visible.sync="isShow"
      width="40%"
      :before-close="handleClose">
      <el-form :model="countryForm" :rules="rules" ref="countryFormRef" label-width="100px">
        <el-form-item label="国家/地区" prop="country">
          <el-input v-model="countryForm.country"></el-input>
        </el-form-item>
        <el-form-item label="语种" prop="lang">
          <el-input v-model="countryForm.lang"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createOrUpdateCountry">确 定</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 6
      },
      tableData: [],
      isShow: false,
      countryForm: {},
      rules: {
        country: { required: true, message: '该项不能为空', trigger: 'blur' },
        lang: { required: true, message: '语种不能为空', trigger: 'blur' },
      }
    }
  },
  methods: {
    // pageSize
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getCountryTag();
    },
    // pageNum
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getCountryTag();
    },
    // 显示编辑对话框
    showEditModal(id) {
      this.isShow = true;
      if (id) {
        this.getOneCountry(id);
      }
    },
    // 关闭编辑对话框时清空表单
    handleClose() {
      this.$refs['countryFormRef'].resetFields();
      this.countryForm = {};
      this.isShow = false;
      this.$message.info('操作已取消');
    },
    // 添加或更新标签
    createOrUpdateCountry() {
      this.$refs['countryFormRef'].validate(async (valid) => {
        if (valid) {
          const id = this.countryForm._id || ''
          if (id) {
            await this.$http.put(`tag/updateCountry/${id}`, this.countryForm);
            this.$message.success('修改成功！');
          } else {
            await this.$http.post('tag/addCountry', this.countryForm);
            this.$message.success('添加成功！');
          }
          this.$refs['countryFormRef'].resetFields();
          this.countryForm = {};
          this.isShow = false;
          // 获取最新数据
          this.getCountryTag();
        } else {
          return false;
        }
      });
    },
    // 删除标签
    async deleteCountryTag(row) {
      const msg = await this.$confirm(`此操作将删除标签“${row.country}”, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err;
      });
      if (msg == 'confirm') {
        await this.$http.delete(`tag/deleteCountry/${row._id}`);
        this.$message.success('删除成功！');
        this.getCountryTag();
      } else {
        this.$message.info('已取消删除！');
      }
    },
    // 获取所有标签
    async getCountryTag(){
      const res = await this.$http.get('tag/country', { params: this.query });
      if (res.status == 200) {
        this.tableData = res.data.items;
        this.total = res.data.total;
      }
    },
    // 获取标签详情
    async getOneCountry(id) {
      const res = await this.$http.get(`tag/country/${id}`);
      this.countryForm = res.data;
    }

  },
  created() {
    this.getCountryTag();
  },
  computed: {
    editTitle() {
      return this.countryForm._id ? '更新标签' : '添加标签';
    }
  },
  filters: {
    formatDate(item) {
      return dayjs(item).format('YYYY-MM-DD [at] HH:mm:ss');
    }
  }
}
</script>