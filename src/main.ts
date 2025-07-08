import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'



import App from './App.vue'
import router from './router'

import Quill from 'quill'
import * as Y from 'yjs'

import QuillCursors from 'quill-cursors'
import { WebsocketProvider } from 'y-websocket'
import { QuillBinding } from 'y-quill'


Quill.register('modules/cursors', QuillCursors)


new Quill(document.getElementById('app') as HTMLElement, {
  modules: {
    cursors: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
    ],

    history: {
      userOnly: true,
      diff: true,
      deltaToHtml: true,
      saveOnCtrlEnter: true,
      saveOnShiftEnter: true,
    }
  }
})


const quill = new Quill(document.querySelector("#app") as HTMLElement, {
  modules: {
    cursors: true,
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
    ]
  }
})

const yDoc = new Y.Doc()

const yText = yDoc.getText('quill')



const provider = new WebsocketProvider(
  'ws://localhost:8080',
  'quill-demo-room',
  yDoc
)

provider.on('synced', () => {
  console.log('synced')
})

// 将yjs文档与quill绑定
const binding = new QuillBinding(yText, quill, provider)




const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
