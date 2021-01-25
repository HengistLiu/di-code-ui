<template>
  <div class="oj-upload">
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
      <!-- 图片类型 -->
      <template v-if="isImage">
        <!-- 无上传 -->
        <template v-if="!isUploaded">
          <template v-if="isFirstUpload && imageSrc != null">
            <dc-magnifier
              :key="imageSrc"
              class="upload__image"
              :host="host"
              :namespace="namespace"
              :pre="pre"
              :url="imageSrc"
              width="100%"
              radius="0"
            />
            <span class="upload__tips">拖动另一张图片到框内可直接替换已上传图片</span>
          </template>
          <template v-else>
            <i class="dc-iconfont dc-icon-iamge"></i>
            <span class="upload__tips">将图片拖到此处，或<strong>点击上传</strong></span>
          </template>
        </template>
        <!-- 已上传 -->
        <template v-else>
          <img
            ref="upload__image"
            :key="file.name"
            v-if="uploadImageObj != null"
            class="upload__image"
            :src="uploadImageObj.src"
            :alt="file.name"
            @load="getImageObj">
          <span class="upload__name"><strong>{{file.name}}</strong></span>
          <!-- 可上传时 -->
          <template v-if="!this.disabled">
            <span class="upload__content" v-if="isLoadImage">
              <strong>
                {{uploadImageObj.width}} × {{uploadImageObj.height}}
                [宽 × 高, 宽高比 {{(uploadImageObj.width / uploadImageObj.height).toFixed(1)}} : 1]
              </strong>
            </span>
            <span class="upload__tips upload__tips--danger" v-if="isLoadImage && uploadImageObj.warn">！图片宽高比不合适，应约为 {{rate}}:1</span>
            <span class="upload__tips">拖动另一张图片到框内可直接替换已上传图片</span>
          </template>
        </template>
      </template>
      <!-- 文件类型 -->
      <template v-else>
        <template v-if="!isUploaded">
          <i class="dc-iconfont dc-icon-upload-file"></i>
          <span class="upload__tips">将文件拖到此处，或<strong>点击上传</strong></span>
          <span class="upload__limits" v-if="limits.length">请上传{{limits.join('、')}}类型文件</span>
        </template>
        <template v-else>
          <i class="dc-iconfont dc-icon-files"></i>
          <span class="upload__name"><strong>{{file.name}}</strong></span>
          <span class="upload__content">拖动另一文件到框内可直接替换已上传文件</span>
        </template>
      </template>
    </label>
    <input
      :id="id"
      type="file"
      :accept="isImage ? 'image/png, image/jpeg' : '*'"
      hidden
      :disabled="disabled"
      @change="changeHandler">
  </div>
</template>

<script>
export default {
  name: 'dc-upload',
  props: {
    image: Boolean,
    imageSrc: {
      type: String
    },
    limits: {
      type: Array,
      default: () => []
    },
    rate: { // 限制的宽高比
      type: Number,
      default: -1
    },
    disabled: Boolean,
    host: {
      type: String,
      default: ''
    },
    namespace: {
      type: String,
      default: ''
    },
    pre: {
      type: String,
      default: '/'
    }
  },
  computed: {
    isUploaded () {
      return this.file != null
    },
    isImage () {
      return this.image
    },
    isLoadImage () {
      return this.isImage && this.uploadImageObj != null && this.uploadImageObj.warn != null
    }
  },
  data () {
    return {
      isFirstUpload: true,
      isDragOver: false,
      id: `upload-${(((1 + Math.random()) * new Date().getTime()) | 0).toString(16)}`,
      file: null,
      curType: null,
      uploadImageObj: null
    }
  },
  methods: {
    changeHandler (e) {
      const files = e.target.files
      this.setUploadFile(files[0])
    },
    dragoverHandler (e) {
      e.preventDefault()
    },
    dragHandler (e) {
      e.preventDefault()
      const files = e.dataTransfer.files
      this.setUploadFile(files[0])
      this.isDragOver = false
    },
    getImageObj (e) {
      const imageEle = this.$refs['upload__image']
      if (this.uploadImageObj == null || imageEle == null) return
      const width = imageEle.naturalWidth
      const height = imageEle.naturalHeight
      const rate = width / height

      this.uploadImageObj = {
        src: this.uploadImageObj.src,
        width: width,
        height: height,
        warn: this.rate !== -1 && (rate > (this.rate + 0.2) || rate < (this.rate - 0.2))
      }
    },
    setUploadFile (file) {
      if (this.disabled) return
      // 文件相同则不放入
      if (this.file != null && (file.name === this.file.name && file.size === this.file.size)) {
        this.$message({
          type: 'warning',
          message: '请上传不同文件！',
          duration: 1500
        })
        return
      }
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
      if (this.isImage) {
        if (curType.value === 6) {
          if (this.isImage) {
            const reader = new FileReader()
            // 读取文件
            reader.readAsDataURL(file)
            // 监听onload事件
            reader.onload = () => {
              this.uploadImageObj = {
                src: reader.result
              }
              this.$emit('imageChange', reader.result)
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请上传图片文件！',
            duration: 1500
          })
          this.uploadImageObj = null
          return
        }
      }
      // 判断是否有限制
      if (this.limits.length) {
        const arr = file.name.split('.')
        let suffix = curType.label
        if (curType.label === 'OTHER') {
          suffix = arr[1] != null ? arr[1].toUpperCase() : ''
        }
        if (this.limits.indexOf(suffix) === -1) {
          this.$message({
            type: 'warning',
            message: '请上传符合类型的文件！',
            duration: 1500
          })
          return
        }
      }
      this.file = file
      this.curType = curType
      this.isFirstUpload = false
      this.$emit('change', {
        file: this.file,
        type: this.curType.value
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload__container {
    position: relative;
    display: block;
    text-align: center;
    padding: 50px 20px;
    border-radius: 5px;
    border: 1px dashed $BORDER-DARK;
    transition: all .2s;
    cursor: pointer;
    .upload__image {
      max-width: 100%;
      max-height: 250px;
    }
    i {
      font-size: 30px;
      color: $TEXT-SECONDARY;
      transition: color .2s;
    }
    .upload__name,
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
    .upload__name {
      strong {
        font-size: 15px;
      }
    }
    .upload__tips {
      &--danger {
        color: $DANGER;
      }
    }
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
</style>
