<template>
  <div class="oj-multiple-upload">
    <label
      :class="{
        'upload__container': true,
        'upload__container--full': isUploaded,
        'upload__container--drag': isDragOver
      }"
      :style="{
        cursor: disabled ? 'default' : 'pointer'
      }"
      :for="id"
      @dragover.stop.prevent="!disabled && (isDragOver = true)"
      @dragleave.stop="isDragOver = false"
      @drop.stop="dragHandler">
      <template v-if="!isUploaded">
        <div class="files__upload">
          <i class="dc-iconfont dc-icon-upload-file"></i>
          <span class="upload__tips">将文件拖到此处，或<strong>点击上传</strong></span>
          <span class="upload__limits" v-if="limits.length">请上传{{limits.join('、')}}类型文件</span>
        </div>
      </template>
      <template v-else>
        <ul class="files__container"
            :style="{
              maxHeight: this.maxHeight
            }">
          <li
            v-for="(file, index) in files"
            :key="file.name">
            <span class="upload__name">
              <i class="dc-iconfont dc-icon-files"></i>
              <strong>{{file.name}}</strong>
            </span>
            <span
              class="upload__delete"
              v-if="progresses[index] === 0"
              @click.stop.prevent="cleanFile(index)">
              <i class="dc-iconfont dc-icon-close"></i>
            </span>
            <div
              class="upload__progress"
              :style="{
                width: progresses[index] + '%'
              }"></div>
          </li>
        </ul>
      </template>
    </label>
    <input
      :id="id"
      type="file"
      :accept="isImage ? 'image/png, image/jpeg' : '*'"
      hidden
      multiple
      :disabled="disabled"
      @change="changeHandler">
  </div>
</template>

<script>
export default {
  name: 'dc-multiple-upload',
  props: {
    image: Boolean,
    disabled: Boolean,
    limits: {
      type: Array,
      default: () => []
    },
    maxHeight: {
      type: String,
      default: '400px'
    }
  },
  computed: {
    isUploaded () {
      return this.files.length > 0
    },
    isImage () {
      return this.image
    }
  },
  data () {
    return {
      isDragOver: false,
      files: [],
      progresses: [],
      id: `upload-${(((1 + Math.random()) * new Date().getTime()) | 0).toString(16)}`
    }
  },
  methods: {
    cleanAll () {
      this.files = []
      this.progresses = []
    },
    updateProgress (idx, val) {
      this.progresses[idx] = val
    },
    cleanFile (index) {
      this.files.splice(index, 1)
      this.progresses.splice(index, 1)
    },
    changeHandler (e) {
      const files = e.target.files
      this.setUploadFiles(files)
    },
    setUploadFiles (files) {
      const finishFiles = []
      files.forEach(file => {
        if (this.setUploadFile(file, /* isMultiple */files.length > 1)) {
          finishFiles.push(file)
        }
      })
      if (finishFiles.length < files.length) {
        this.$message({
          type: 'warning',
          message: `有${files.length - finishFiles.length}个文件因类型或格式错误导入失败`,
          duration: 1500
        })
      }
      this.$emit('change', {
        files: this.files,
        updateProgress: this.updateProgress
      })
    },
    setUploadFile (file, isMultiple) {
      if (this.disabled) return
      // 判断是否重复
      if (this.files.find(i => {
        return i.name === file.name &&
          i.type === file.type &&
          i.size === file.size &&
          i.lastModified === file.lastModified
      })) {
        !isMultiple && this.$message({
          type: 'warning',
          message: '该文件已上传！',
          duration: 1500
        })
        return
      }
      // 判断类型并限制
      const curType = [
        { label: 'WORD', value: 1, match: 'suffix .(doc|docx)$' },
        { label: 'PDF', value: 2, match: 'suffix .pdf$' },
        { label: 'PPT', value: 3, match: 'suffix .(ppt|pptx)$' },
        { label: 'EXCEL', value: 4, match: 'suffix .(xls|xlsx)$' },
        { label: 'TXT', value: 5, match: 'suffix .txt$' },
        { label: 'IMAGE', value: 6, match: 'type ^image/' },
        { label: 'RAR', value: 7, match: 'suffix .(rar|zip|7z)$' },
        { label: 'OTHER', value: 0, match: 'suffix .+' }
      ].find(i => {
        const method = i.match.split(' ')[0]
        const match = new RegExp(i.match.split(' ')[1])
        return method === 'suffix'
          ? match.test(file.name)
          : match.test(file.type)
      })

      // 判断是否有限制
      if (this.limits.length) {
        const arr = file.name.split('.')
        let suffix = arr[1] != null ? arr[1].toUpperCase() : ''
        let result = true
        if (this.limits.indexOf(suffix) === -1) {
          suffix = curType.label
          result = suffix !== 'OTHER' && this.limits.indexOf(suffix) !== -1
        }
        if (!result) {
          !isMultiple && this.$message({
            type: 'warning',
            message: '请上传符合类型的文件！',
            duration: 1500
          })
          return
        }
      }
      this.files.push(file)
      this.progresses.push(0)
      return true
    },
    dragHandler (e) {
      e.preventDefault()
      const files = e.dataTransfer.files
      this.setUploadFiles(files)
      this.isDragOver = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload__container {
    position: relative;
    display: block;
    text-align: center;
    padding: 5px 10px;
    min-height: 200px;
    border-radius: 5px;
    border: 1px dashed $BORDER-DARK;
    transition: all .2s;
    cursor: pointer;
    &--drag,
    &--full,
    &:hover {
      i {
        color: $PRIMARY;
      }
    }
    &--drag {
      border: 1px dashed $PRIMARY;
    }
  }
  .files__upload {
    padding-top: 50px;
    i {
      font-size: 30px;
      color: $TEXT-SECONDARY;
      transition: color .2s;
    }
    .upload__tips,
    .upload__content {
      display: block;
      line-height: 30px;
      margin-top: 10px;
      font-size: 14px;
      color: $TEXT-SECONDARY;
      &--sub {
        border-bottom: 1px solid $BORDER;
      }
      strong {
        font-size: 14px;
        color: $TEXT-PRIMARY;
      }
    }
  }
  .files__container {
    overflow-y: auto;
    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      line-height: 40px;
      background-color: $BG-LIGHT;
      border-radius: 4px;
      padding: 0 10px;
      margin: 5px 0;
      position: relative;
      span {
        display: inline-block;
        line-height: 40px;
        i {
          font-size: 20px;
          line-height: 40px;
        }
        &:first-child {
          width: 100%;
          text-align: left;
          i {
            margin-right: 10px;
          }
        }
      }
      .upload__delete {
        i {
          color: $TEXT-PLACEHOLDER;
          transition: all .2s;
          &:hover {
            color: $DANGER;
          }
        }
      }
      .upload__progress {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        background-color: $PRIMARY-LUCENCY;
      }
    }
  }
</style>
