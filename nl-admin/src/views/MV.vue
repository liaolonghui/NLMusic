<template>
  <el-card>
    <el-row :gutter="40">
      <el-col :span="5">
        <h3>MV列表</h3>
      </el-col>
      <el-col :span="15">
        <el-input v-model="query.key" placeholder="搜索MV" clearable @change="query.pageNum=1; getMVs();" style="width: 320px;  margin-right: -2px;"></el-input>
        <el-button type="primary" @click="query.pageNum = 1; getMVs();"><i class="el-icon-search"></i></el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true;">添加MV</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      :data="mvTable"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="MV名称"
        width="180">
      </el-table-column>
      <el-table-column label="MV封面">
        <template slot-scope="scope">
          <img :src="scope.row.img" alt="MVIMG" height="200">
        </template>
      </el-table-column>
      <el-table-column
        label="MV详情">
        <template slot-scope="scope">
          <video :src="scope.row.video[0].path" controls loop style="outline: none; height: 200px;"></video>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="showEditDialog(scope.row._id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteMV(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pageNum"
      :page-sizes="[4, 7, 10]"
      :page-size="query.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- dialog -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
        <el-form :model="mvForm" :rules="mvRules" ref="mvForm" label-width="100px">
          <el-form-item label="MV名称" prop="name">
            <el-input v-model="mvForm.name"></el-input>
          </el-form-item>
          <el-form-item label="MV封面" prop="img">
            <el-upload
              name="img"
              class="img-uploader"
              :action="uploadImgURL"
              :headers="getAuth()"
              :show-file-list="false"
              :on-success="handleImgSuccess">
              <img v-if="mvForm.img" :src="mvForm.img" class="img">
              <i v-else class="el-icon-plus img-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="视频内容" prop="video">
            <el-upload
              name="video"
              :multiple="false"
              :limit="1"
              :file-list="mvForm.video"
              :action="uploadMV"
              :headers="getAuth()"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateMV">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      query: {
        pageSize: 4,
        pageNum: 1,
        key: ''
      },
      mvTable: [],
      dialogVisible: false,
      mvForm: {  // 音乐表单
        video: []
      },
      mvRules: {
        name: [{ required: true, message: '请填写音乐名', trigger: 'blur' }],
        video: [{ required: true, message: '请上传MV视频文件' }],
        img: [{ required: true, message: '请上传MV封面' }],
      }
    }
  },
  methods: {
    // 图片
    handleImgSuccess(res) {
      this.$set(this.mvForm, 'img', res) // URL.createObjectURL().... 
      // 如果不在singerForm里面先定义好img就不是响应式了。（或者使用$set）
    },
    // pagination
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNum = 1;
      this.getMVs();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getMVs();
    },
    // upload
    handleSuccess(res) {
      this.mvForm.video.push({
        name: res.name,
        path: res.path
      });
    },
    handleRemove() {
      this.mvForm.video = [];
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 关闭dialog
    handleClose() {
      this.mvForm = {
        video: []
      }
      this.$refs['mvForm'].resetFields();
      this.dialogVisible = false;
    },
    // 显示dialog
    async showEditDialog(id) {
      if (id) {
        const res = await this.$http.get(`rest/mv/${id}`);
        this.mvForm = res.data;
        this.dialogVisible = true;
      }
    },
    // 删除音乐
    async deleteMV(mv) {
        const msg = await this.$confirm(`是否删除MV“${mv.name}”？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (msg === 'confirm') {
          const res = await this.$http.delete(`rest/deleteMV/${mv._id}`);
          if (res.status>=200 && res.status<300 || res.status==304) {
            this.$message.success('成功删除MV');
            this.getMVs();
          } else {
            this.$message.error('删除MV失败');
          }
        }
    },
    // 添加或修改音乐...
    async addOrUpdateMV() {
      this.$refs['mvForm'].validate(async (valid) => {
        if (valid) {
          const id = this.mvForm._id || '';
          if (id) {
            const res = await this.$http.put(`rest/updateMV/${id}`, this.mvForm);
            if (res.status === 200) {
              this.$message.success('修改成功!');
            } else {
              this.$message.error('修改失败!');
            }
          } else {
            const res = await this.$http.post('rest/addMV', this.mvForm);
            if (res.status === 200) {
              this.$message.success('添加成功!');
            } else {
              this.$message.error('添加失败!');
            }
          }
          this.mvForm = {
            video: []
          }
          this.$refs['mvForm'].resetFields();
          this.dialogVisible = false;
          this.getMVs();
        } else {
          return false;
        }
      });
    },
    // 查询音乐
    async getMVs() {
      const res = await this.$http.get('rest/mv', { params: this.query });
      if (res.status >=200 && res.status < 300 || res.status===304) {
        this.mvTable = res.data.mvs;
        this.total = res.data.count;
      }
    },
  },
  created() {
    this.getMVs();
  },
  computed: {
    dialogTitle() {
      return this.mvForm._id ? '修改MV' : '添加MV'
    }
  }
}
</script>