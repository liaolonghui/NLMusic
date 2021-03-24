<template>
  <el-card>
    <el-row :gutter="40">
      <el-col :span="5">
        <h3>音乐列表</h3>
      </el-col>
      <el-col :span="15">
        <el-input v-model="query.key" placeholder="搜索音乐" clearable @change="query.pageNum=1; getMusics();" style="width: 320px;  margin-right: -2px;"></el-input>
        <el-button type="primary" @click="query.pageNum = 1; getMusics();"><i class="el-icon-search"></i></el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="dialogVisible = true;">添加音乐</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      :data="musicTable"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="音乐名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="singer.name"
        label="歌手"
        width="180">
      </el-table-column>
      <el-table-column
        prop="album.name"
        label="所属专辑"
        width="180">
      </el-table-column>
      <el-table-column
        prop="music.path"
        label="音乐详情">
        <template slot-scope="scope">
          <audio :src="scope.row.music[0].path" controls loop></audio>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="showEditDialog(scope.row._id)">修改</el-button>
          <el-button type="danger" size="small" @click="deleteMusic(scope.row)">删除</el-button>
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
      title="添加音乐"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
        <el-form :model="musicForm" :rules="musicRules" ref="musicForm" label-width="100px">
          <el-form-item label="音乐名" prop="name">
            <el-input v-model="musicForm.name"></el-input>
          </el-form-item>
          <el-form-item label="歌手" prop="singer">
            <el-select v-model="musicForm.singer" clearable placeholder="请选择" filterable>
              <el-option
                v-for="item in singers"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专辑" prop="album">
            <el-select v-model="musicForm.album" clearable placeholder="请选择" filterable>
              <el-option
                v-for="item in albums"
                :key="item._id"
                :label="item.name"
                :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="音乐文件" prop="music">
            <el-upload
              name="music"
              :multiple="false"
              :limit="1"
              :file-list="musicForm.music"
              :action="uploadMusic"
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
        <el-button type="primary" @click="addOrUpdateMusic">确 定</el-button>
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
      musicTable: [],
      dialogVisible: false,
      musicForm: {  // 音乐表单
        music: []
      },
      musicRules: {
        name: [{ required: true, message: '请填写音乐名', trigger: 'blur' }],
        singer: [{ required: true, message: '请选择歌手', trigger: 'blur' }],
        album: [{ required: true, message: '请选择所属专辑', trigger: 'blur' }],
        music: [{ required: true, message: '请上传音乐' }],
      },
      singers: [],  // 歌手们
      albums: [],   // 专辑s
    }
  },
  methods: {
    // pagination
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.query.pageNum = 1;
      this.getMusics();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getMusics();
    },
    // upload
    handleSuccess(res) {
      this.musicForm.music.push({
        name: res.name,
        path: res.path
      });
    },
    handleRemove() {
      this.musicForm.music = [];
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 关闭dialog
    handleClose() {
      this.musicForm = {
        music: []
      };
      this.$refs['musicForm'].resetFields();
      this.dialogVisible = false;
    },
    // 显示dialog
    async showEditDialog(id) {
      if (id) {
        const res = await this.$http.get(`rest/music/${id}`);
        this.musicForm = res.data;
        this.dialogVisible = true;
      }
    },
    // 删除音乐
    async deleteMusic(music) {
        const msg = await this.$confirm(`是否删除音乐“${music.name}”？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if (msg === 'confirm') {
          const res = await this.$http.delete(`rest/deleteMusic/${music._id}`);
          if (res.status>=200 && res.status<300 || res.status==304) {
            this.$message.success('成功删除音乐');
            this.getMusics();
          } else {
            this.$message.error('删除音乐失败');
          }
        }
    },
    // 添加或修改音乐...
    async addOrUpdateMusic() {
      this.$refs['musicForm'].validate(async (valid) => {
        if (valid) {
          const id = this.musicForm._id || '';
          if (id) {
            const res = await this.$http.put(`rest/updateMusic/${id}`, this.musicForm);
            if (res.status === 200) {
              this.$message.success('修改成功!');
            } else {
              this.$message.error('修改失败!');
            }
          } else {
            const res = await this.$http.post('rest/addMusic', this.musicForm);
            if (res.status === 200) {
              this.$message.success('添加成功!');
            } else {
              this.$message.error('添加失败!');
            }
          }
          this.musicForm = {
            music: []
          };
          this.$refs['musicForm'].resetFields();
          this.dialogVisible = false;
          this.getMusics();
        } else {
          return false;
        }
      });
    },
    // 查询音乐
    async getMusics() {
      const res = await this.$http.get('rest/music', { params: this.query });
      if (res.status >=200 && res.status < 300 || res.status===304) {
        this.musicTable = res.data.musics;
        this.total = res.data.count;
      }
    },
    // 查询singers  albums
    async getSingersAndAlbums() {
      const res1 = await this.$http.get('rest/singer', { params: { pageSize: 1000 } });
      const res2 = await this.$http.get('rest/album', { params: { pageSize: 1000 } });
      this.singers = res1.data.singers;
      this.albums = res2.data.albums;
    }
  },
  created() {
    this.getMusics();
    this.getSingersAndAlbums();
  },
}
</script>