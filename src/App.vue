<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { onMounted, onUnmounted } from 'vue'
import Quill from 'quill'
import * as Y from 'yjs'
import QuillCursors from 'quill-cursors'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'

// 注册Quill光标模块
Quill.register('modules/cursors', QuillCursors)

let quill: any = null
let yDoc: Y.Doc | null = null
let provider: WebsocketProvider | null = null
let binding: QuillBinding | null = null

onMounted(() => {
  // 等待DOM完全渲染后再初始化Quill
  setTimeout(() => {
    try {
      // 创建Quill编辑器
      quill = new Quill('#quill-editor', {
        modules: {
          cursors: true,
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
          ],
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          }
        },
        placeholder: '开始协作编辑...',
        theme: 'snow'
      })

      // 确保编辑器有初始内容
      if (quill.getText().trim() === '') {
        quill.setText('')
      }

      // 创建YJS文档
      yDoc = new Y.Doc()
      const yText = yDoc.getText('quill')

      // 创建WebSocket提供者
      provider = new WebsocketProvider(
        'ws://localhost:8080',
        'quill-demo-room',
        yDoc
      )

      provider.on('sync', () => {
        console.log('文档已同步')
      })

      // 绑定Quill和YJS
      binding = new QuillBinding(yText, quill, provider.awareness)
    } catch (error) {
      console.error('初始化Quill编辑器失败:', error)
    }
  }, 100)
})

onUnmounted(() => {
  // 清理资源
  if (binding) {
    binding.destroy()
  }
  if (provider) {
    provider.destroy()
  }
  if (yDoc) {
    yDoc.destroy()
  }
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <div id="quill-editor"></div>
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

#quill-editor {
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
