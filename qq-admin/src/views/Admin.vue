<template>
  <el-card>
    <el-row>
      <el-col :span="15">
        <h3>管理员</h3>
        <p>分为超级管理员以及只读管理员。</p>
      </el-col>
      <el-col :span="9">
        <el-tooltip effect="dark" content="只有超级管理员能添加管理员" placement="top">
          <el-button type="warning">添加管理员</el-button>
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
          {{scope.row.state}}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      adminTable: []
    }
  },
  methods: {
    async getAdmins() {
      const res = await this.$http.get('adminList');
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
}
</script>