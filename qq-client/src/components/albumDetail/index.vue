<template>
  <div class="albumDetail">
    <main class="albumList">
      <section class="albumDes">
        <img :src="albumList[0].album.img" alt="logo" width="250">
        <aside>
          <h2>专辑名：{{ albumList[0].album.name }}</h2>
          <p style="color: #42b983;">歌手：{{ albumList[0].singer.name }}</p>
          <p style="color: #409EFF;">流派：{{ albumList[0].album.style.name }}</p>
          <p>流派描述：{{ albumList[0].album.style.description }}</p>
          <p style="color: #FFDC00;">唱片公司：{{ albumList[0].album.company }}</p>
        </aside>
      </section>
      <table class="albumTable">
        <tr>
          <th>歌曲</th>
          <th>歌手</th>
          <th>专辑</th>
          <th>时长</th>
        </tr>
        <tr v-for="music in albumList" :key="music._id">
          <td>
            {{ music.name }}
            <i @click="$emit('changeMusic', music.music[0].path, music.name, music.singer.name, music.album.img)"></i>
          </td>
          <td>{{ music.singer.name }}</td>
          <td>{{ music.album.name }}</td>
          <td>
            <audio @canplay="audioCanPlay(music._id)" :ref="music._id" :src="music.music[0].path" loop />
            {{ musicsTime[music._id] }}
          </td>
        </tr>
      </table>
      <!-- 评论 -->
      <section class="comment">
        <h3>评论</h3>
        <article>
          <textarea @keydown.enter="submitComment" name="comment" ref="comment" cols="100" rows="2"></textarea>
          <button @click="submitComment">发送</button>
          <span v-if="error" style="color: red;">{{ error }}</span>
        </article>
        <h3 v-if="albumList[0].album.comments">评论详情({{albumList[0].album.comments.length}})</h3>
        <ul v-if="albumList[0].album.comments">
          <li v-for="comment in albumList[0].album.comments" :key="comment._id">
            {{ comment }}
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: String }
  },
  data () {
    return {
      albumList: [{ // 每一首歌都有自己的所属专辑，歌手，以及歌曲内容
        album: {
          style: {},
          comments: [] // 评论
        },
        singer: {},
        music: [{}]
      }],
      musicsTime: {}, // 保存所有音乐时长
      error: '' // 错误信息
    }
  },
  methods: {
    // 发评论
    async submitComment () {
      if (this.$refs.comment.value.trim()) {
        const arr = this.albumList[0].album.comments || []
        const res = await this.$http.post(`addComment/${this.albumList[0].album._id}`, {
          comments: arr.concat(this.$refs.comment.value)
        })
        if (res.status === 201) { // 请求成功就直接把数组赋值给评论区
          this.albumList[0].album.comments = arr.concat(this.$refs.comment.value)
          this.$refs.comment.value = ''
          this.error = ''
        } else {
          this.error = '评论发送失败！'
        }
      } else {
        this.error = '评论为空不能发送'
      }
    },
    // 获取所有音乐的时长
    audioCanPlay (id) {
      const musicDom = this.$refs[id]
      const min = Math.floor(musicDom[0].duration / 60)
      const second = Math.round(musicDom[0].duration % 60)
      const time = min + ':' + second
      this.$set(this.musicsTime, id, time)
    },
    // 获取专辑中歌曲信息等
    async getAlbumList () {
      const res = await this.$http.get(`album/${this.id}`)
      if ((res.status >= 200 && res.status < 300) || res.status === 304) {
        this.albumList = res.data
      }
    }
  },
  created () {
    this.getAlbumList()
  }
}
</script>

<style>
  .albumDetail {
    margin-bottom: 100px;
  }
  .albumList {
    width: 1150px;
    margin: 0 auto;
  }
  .albumDes {
    display: flex;
  }
  .albumDes>aside {
    margin: 10px 0 0 20px;
    line-height: 25px;
  }
  .albumTable {
    border-spacing: 0;
    margin-top: 30px;
  }
  .albumTable>tr:nth-child(2n-1) {
    background-color: #eee;
  }
  .albumTable>tr>th {
    height: 40px;
    text-align: left;
    padding-left: 10px;
  }
  .albumTable>tr>td {
    padding-left: 10px;
    min-width: 200px;
    height: 40px;
  }
  .albumTable>tr>td:first-child {
    cursor: pointer;
    position: relative;
  }
  .albumTable>tr>td:first-child>i {
    display: none;
    width: 30px;
    height: 30px;
    background: url('../../assets/imgs/cover.png');
    background-size: contain;
    border: 2px solid #ccc;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: 50px;
  }
  .albumTable>tr>td:first-child:hover>i {
    display: block;
  }
  /* comment */
  .comment {
    margin: 50px 0 0 0;
  }
  .comment>h3 {
    padding: 15px 0 20px 0;
    border-top: 1px solid #aaa;
    font-size: 28px;
    letter-spacing: 5px;
  }
  .comment>h3:nth-of-type(2) {
    font-size: 18px;
    border-bottom: 1px solid #42b983;
  }
  .comment li {
    padding: 15px 0 15px 10px;
    border-bottom: 1px solid #42b983;
    height: 70px;
    line-height: 20px;
    font-size: 15px;
    color: slategrey;
    list-style-type: decimal;
  }
  .comment textarea {
    padding: 1em;
  }
  .comment button {
    display: block;
    margin-bottom: 20px;
    width: 100px;
    height: 30px;
    line-height: 30px;
    background-color: #42b983;
    color: white;
    outline: none;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
  .comment button:hover {
    box-shadow: 0 0 20px #888 inset;
  }
  .comment>article {
    position: relative;
  }
  .comment>article>span {
    position: absolute;
    left: 130px;
    bottom: 5px;
    font-size: 10px;
  }
</style>
