// 引包
import Quill from "quill"; // 引入 quill 编辑器
import QuillCursors from "quill-cursors"; // 引入光标插件

// 引入 quill 编辑器的样式
import "quill/dist/quill.snow.css";

import * as Y from "yjs"; // 引入 yjs

import { WebsocketProvider } from "y-websocket"; // 引入 y-websocket

import { QuillBinding } from "y-quill";

// 将 Quill 光标插件进行注册
Quill.register("modules/cursors", QuillCursors);

// 实例化一个 Quill 编辑器
const quill = new Quill(document.querySelector("#app") as HTMLElement, {
  modules: {
    // 启用协同光标功能
    cursors: true,

    // 编辑器工具栏的一个配置
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
    ],

    history: {
      userOnly: true, // 只记录用户的操作，不记录远程用户的操作
    },
  },
  // 一开始编辑器的提示信息
  placeholder: "请输入内容", // 协同光标的占位符

  theme: "snow", // Quill 编辑器的主题
});

const ydoc = new Y.Doc(); // 创建一个 Yjs 文档实例

// 接下来需要定义一个共享文本的类型
const ytext = ydoc.getText("quill"); // 创建一个共享文本类型

/**
 * 第一个参数：Websocket 服务器地址
 * 第二个参数：房间名称
 * 第三个参数：Yjs 文档实例
 */
const provider = new WebsocketProvider(
  "ws://localhost:1234", // websocket 服务器地址
  "quill-demo-room", // 房间名称
  ydoc
);

// 将 Yjs 文档实例和 Quill 编辑器进行绑定
// 其中 provider.awareness 是一个用于处理协同光标的对象
// 这个对象会在用户光标移动时更新光标的位置
// 从而让每一位协作者可以看到彼此的光标位置
new QuillBinding(ytext, quill, provider.awareness);
