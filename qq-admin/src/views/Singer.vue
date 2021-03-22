<template>
  <el-card>
    <el-row :gutter="50">
      <el-col :span="5">
        <h3>歌手列表</h3>
      </el-col>
      <el-col :span="15" class="br">
        <el-input placeholder="搜索歌手" style="width: 300px;" v-model="query.key" clearable @change="searchSinger" @clear="searchSinger"></el-input>
        <el-button type="primary" @click="searchSinger"><i class="el-icon-search"></i></el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加歌手</el-button>
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
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="country.country"
        label="国家/地区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex === '男'" effect="dark">{{scope.row.sex}}</el-tag>
          <el-tag v-else type="danger" effect="dark">{{scope.row.sex}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="birth"
        label="出生日"
        width="150">
        <template slot-scope="scope">
          {{ scope.row.birth | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="style.name"
        label="流派"
        width="100">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-tooltip effect="light" content="修改" placement="left">
            <el-button type="warning" size="mini" @click="showDialog(scope.row._id)"><i class="el-icon-setting" /></el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="删除" placement="right">
            <el-button type="danger" size="mini" @click="deleteSinger(scope.row)"><i class="el-icon-delete" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageNum"
      :page-sizes="[3, 6, 9, 15]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%"
      :before-close="handleClose">
      <el-form :model="singerForm" :rules="singerRules" ref="singerForm" label-width="100px">
        <el-form-item label="姓名" prop="name" style="width: 420px;">
          <el-input v-model="singerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="国家/地区" prop="country">
          <el-select v-model="singerForm.country" placeholder="请选择" filterable>
            <el-option
              v-for="item in countries"
              :key="item._id"
              :label="item.country"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model=singerForm.sex placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日" prop="birth">
          <el-date-picker
            v-model="singerForm.birth"
            align="right"
            type="date"
            placeholder="选择日期"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="流派" prop="style">
          <el-select v-model="singerForm.style" placeholder="请选择" filterable>
            <el-option
              v-for="item in styles"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="singerForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateSinger">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data() {
    return {
      query: {    // 分页查询参数(第几页,一页多少条数据) 以及 关键字查询参数
        pageSize: 6,
        pageNum: 1,
        key: '',
      },
      total: 0,   // 总数据条数
      tableData: [],  // 表格数据
      dialogVisible: false,
      singerForm: {},
      singerRules: {
        name: { required: true, message: '姓名不能为空', trigger: 'blur' },
        country: { required: true, message: '国家/地区不能为空', trigger: 'blur' },
        sex: { required: true, message: '性别不能为空', trigger: 'blur' },
        birth: { required: true, message: '出生日不能为空', trigger: 'blur' },
        style: { required: true, message: '风格流派不能为空', trigger: 'blur' },
        description: { required: true, message: '描述不能为空', trigger: 'blur' },
      },
      countries: [],  // 国家标签
      styles: [],     // 风格标签
    }
  },
  methods: {
    // pageSize
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getSingerData()
    },
    // pageNum
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getSingerData();
    },
    // 搜索歌手
    searchSinger() {
      this.query.pageNum = 1;
      this.getSingerData();
    },
    // 删除歌手
    async deleteSinger(singer) {
      const msg = await this.$confirm(`是否删除歌手"${singer.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (msg === 'confirm') {
        const res = await this.$http.delete(`deleteSinger/${singer._id}`);
        if (res.data.success) {
          this.$message.success(`成功删除歌手"${singer.name}"`);
          this.getSingerData();
        } else {
          this.$message.error(`删除歌手"${singer.name}"失败`);
        }
      } else {
        this.$message.info('已取消删除');
      }
    },
    // 添加或修改歌手
    addOrUpdateSinger() {
      this.$refs['singerForm'].validate(async (valid) => {
        if (valid) {
          const id = this.singerForm._id || '';
          if (id) {
            const res = await this.$http.put(`updateSinger/${id}`, this.singerForm);
            if (res.status === 200) {
              this.$message.success('修改成功!');
            } else {
              this.$message.error('修改失败!');
            }
          } else {
            const res = await this.$http.post('addSinger', this.singerForm);
            if (res.status === 200) {
              this.$message.success('添加成功!');
            } else {
              this.$message.error('添加失败!');
            }
          }
          this.$refs['singerForm'].resetFields();
          this.singerForm = {};
          this.dialogVisible = false;
          // 获取新数据
          this.getSingerData();
        } else {
          return false;
        }
      })
    },
    // 显示dialog
    async showDialog(id) {
      this.dialogVisible = true;
      if (id) {
        const res = await this.$http.get(`singer/${id}`);
        if (res.status >= 200 && res.status<300 || res.status ==304 ) {
          this.singerForm = res.data;
        }
      }
    },
    // 关闭dialog
    handleClose() {
      this.$refs['singerForm'].resetFields();
      this.singerForm = {};
      this.dialogVisible = false;
    },
    // 获取所有歌手信息
    async getSingerData() {
      const res = await this.$http.get('singer', {
        params: this.query
      });
      if (res.status >= 200 && res.status<300 || res.status ==304 ) {
        this.tableData = res.data.singers;
        this.total = res.data.count;
      }
    },
    // 获取所有标签
    async getCountryTag() {
      const res = await this.$http.get('tag/country', { params: { pageNum: 1, pageSize: 100 } });  // 获取最多100条数据
      if (res.status >= 200 && res.status<300 || res.status ==304 ) {
        this.countries = res.data.items;
      }
    },
    async getStyleTag() {
      const res = await this.$http.get('tag/style');
      if (res.status >= 200 && res.status<300 || res.status ==304 ) {
        this.styles = res.data;
      }
    }
  },
  created() {
    this.getSingerData();
    this.getCountryTag();
    this.getStyleTag();
  },
  computed: {
    dialogTitle() {
      return this.singerForm._id ? '更新歌手数据' : '添加歌手';
    }
  },
  filters: {
    formatDate(item) {
      return dayjs(item).format('YYYY-MM-DD');
    }
  }
}
</script>

<style lang="scss">
  .br {
    .el-button {
      margin-left: -2px;
    }
  }
</style>