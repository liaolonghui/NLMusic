<template>
  <el-card>
    <el-row :gutter="50">
      <el-col :span="5">
        <h3>专辑列表</h3>
      </el-col>
      <el-col :span="15" class="br">
        <el-input placeholder="搜索专辑" style="width: 300px;" v-model="query.key" clearable @change="searchAlbum" @clear="searchAlbum"></el-input>
        <el-button type="primary" @click="searchAlbum"><i class="el-icon-search"></i></el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true">添加专辑</el-button>
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
        label="专辑"
        width="150">
      </el-table-column>
      <el-table-column
        prop="singer.name"
        label="歌手"
        width="160">
      </el-table-column>
      <el-table-column
        prop="style.name"
        label="流派"
        width="180">
      </el-table-column>
      <el-table-column label="专辑图片" prop="img">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="albumImg" height="30" />
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="发行时间">
        <template slot-scope="scope">
          {{ scope.row.time | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="company"
        label="唱片公司">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-tooltip effect="light" content="修改" placement="left">
            <el-button type="warning" size="mini" @click="showDialog(scope.row._id)"><i class="el-icon-setting" /></el-button>
          </el-tooltip>
          <el-tooltip effect="light" content="删除" placement="right">
            <el-button type="danger" size="mini" @click="deleteAlbum(scope.row)"><i class="el-icon-delete" /></el-button>
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
      <el-form :model="albumForm" :rules="albumRules" ref="albumForm" label-width="100px">
        <el-form-item label="专辑" prop="name" style="width: 420px;">
          <el-input v-model="albumForm.name"></el-input>
        </el-form-item>
        <el-form-item label="歌手" prop="singer">
          <el-select v-model="albumForm.singer" placeholder="请选择" filterable>
            <el-option
              v-for="item in singers"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流派" prop="style">
          <el-select v-model="albumForm.style" placeholder="请选择" filterable>
            <el-option
              v-for="item in styles"
              :key="item._id"
              :label="item.name"
              :value="item._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发行时间" prop="time">
          <el-date-picker
            v-model="albumForm.time"
            align="right"
            type="date"
            placeholder="选择日期"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="唱片公司" prop="company" style="width: 420px;">
          <el-input v-model="albumForm.company"></el-input>
        </el-form-item>
        <el-form-item label="专辑图片" prop="img">
          <el-upload
            name="img"
            class="img-uploader"
            :action="uploadImgURL"
            :show-file-list="false"
            :on-success="handleImgSuccess">
            <img v-if="albumForm.img" :src="albumForm.img" class="img">
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateAlbum">确 定</el-button>
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
      albumForm: {
        img: '',  // 提前准备好img属性
      },
      albumRules: {
        name: { required: true, message: '专辑名称不能为空', trigger: 'blur' },
        singer: { required: true, message: '请选择歌手', trigger: 'blur' },
        style: { required: true, message: '请选择风格流派', trigger: 'blur' },
        time: { required: true, message: '请填写发行时间', trigger: 'blur' },
        company: { required: true, message: '请填写唱片公司', trigger: 'blur' },
        img: { required: true, message: '请上传专辑图片' },
      },
      singers: [],  // 国家标签
      styles: [],     // 风格标签
    }
  },
  methods: {
    // 图片
    handleImgSuccess(res) {
      this.albumForm.img = res;    // URL.createObjectURL().... 
      // 如果不在albumForm里面先定义好img就不是响应式了。（或者使用$set）
    },
    // pageSize   (应该在pageSize变化时让pageNum变为1)
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNum = 1;
      this.getAlbumData()
    },
    // pageNum
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getAlbumData();
    },
    // 搜索专辑
    searchAlbum() {
      this.query.pageNum = 1;
      this.getAlbumData();
    },
    // 删除专辑
    async deleteAlbum(album) {
      const msg = await this.$confirm(`是否删除专辑"${album.name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      if (msg === 'confirm') {
        const res = await this.$http.delete(`deleteAlbum/${album._id}`);
        if (res.data.success) {
          this.$message.success(`成功删除专辑"${album.name}"`);
          this.getAlbumData();
        } else {
          this.$message.error(`删除专辑"${album.name}"失败`);
        }
      } else {
        this.$message.info('已取消删除');
      }
    },
    // 添加或修改专辑
    addOrUpdateAlbum() {
      this.$refs['albumForm'].validate(async (valid) => {
        if (valid) {
          const id = this.albumForm._id || '';
          if (id) {
            const res = await this.$http.put(`updateAlbum/${id}`, this.albumForm);
            if (res.status === 200) {
              this.$message.success('修改专辑成功!');
            } else {
              this.$message.error('修改专辑失败!');
            }
          } else {
            const res = await this.$http.post('addAlbum', this.albumForm);
            if (res.status === 200) {
              this.$message.success('添加专辑成功!');
            } else {
              this.$message.error('添加专辑失败!');
            }
          }
          this.$refs['albumForm'].resetFields();
          this.albumForm = {};
          this.dialogVisible = false;
          // 获取新数据
          this.getAlbumData();
        } else {
          return false;
        }
      })
    },
    // 显示dialog
    async showDialog(id) {
      this.dialogVisible = true;
      if (id) {
        const res = await this.$http.get(`album/${id}`);
        if (res.status >= 200 && res.status<300 || res.status ==304 ) {
          this.albumForm = res.data;
        }
      }
    },
    // 关闭dialog
    handleClose() {
      this.$refs['albumForm'].resetFields();
      this.albumForm = {};
      this.dialogVisible = false;
    },
    // 获取所有专辑信息
    async getAlbumData() {
      const res = await this.$http.get('album', {
        params: this.query
      });
      if (res.status >= 200 && res.status<300 || res.status ==304 ) {
        this.tableData = res.data.albums;
        this.total = res.data.count;
      }
    },
    // 获取所有options
    async getSingers() {
      const res = await this.$http.get('singer', { params: { pageNum: 1, pageSize: 1000 } });  // 获取最多1000条数据
      if (res.status >= 200 && res.status<300 || res.status ==304 ) {
        this.singers = res.data.singers;
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
    this.getAlbumData();
    this.getSingers();
    this.getStyleTag();
  },
  computed: {
    dialogTitle() {
      return this.albumForm._id ? '更新专辑数据' : '添加专辑';
    },
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
  .img-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .img-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 140px;
    height: 140px;
    line-height: 140px !important;
    text-align: center;
  }
  .img {
    height: 140px;
    display: block;
  }
</style>