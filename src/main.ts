import * as Y from "yjs";

const doc = new Y.Doc(); // 创建一个副本
const root = doc.getMap("root"); // 创建一个共享的 Map

root.set("title", new Y.Text("Hello World")); // 设置一个文本

const users = new Y.Array(); // 创建一个共享的数组
users.push(["小明", "小红"]); // 向数组中添加元素
root.set("users", users); // 将数组添加到 Map 中

// 接下来进行一个深层次的监听
root.observeDeep((event) => {
  event.forEach((e) => {
    const path = e.path.join(" > ") || "根对象本身";
    console.log(`发生变化的位置: ${path}`);

    const target = e.target;

    // 接下来看一下发生变化的共享数据是什么类型
    if (target instanceof Y.Text) {
      console.log("[Text变化]");
      // 说明是文本发生了变化
      e.changes.delta.forEach((change) => {
        if (change.insert) {
          console.log(`插入文本: ${change.insert}`);
        }
        if (change.delete) {
          console.log(`删除了 ${change.delete} 个字符`);
        }
        if (change.retain) {
          console.log(`跳过了 ${change.retain} 个字符`);
        }
      });
    }
    if (target instanceof Y.Array) {
      // 说明是数组发生了变化
      console.log("[Array变化]");
      const arrayEvent = e as Y.YArrayEvent<unknown>;
      arrayEvent.changes.delta.forEach((change) => {
        if (change.insert) {
          console.log(`插入数组项:`, change.insert);
        }
        if (change.delete) {
          console.log(`删除了 ${change.delete} 个元素`);
        }
        if (change.retain) {
          console.log(`跳过了 ${change.retain} 个元素`);
        }
      });
    }
    if (target instanceof Y.Map) {
      // 说明是 Map 发生了变化
      console.log("[Map变化]");
      const mapEvent = e as Y.YMapEvent<unknown>;
      mapEvent.changes.keys.forEach((change, key) => {
        console.log(`键 "${key}" 发生了变化，类型是 ${change.action}`);
      });
    }
  }); // 遍历所有的事件
});

const title = root.get("title") as Y.Text; // 获取文本

title.insert(4, "Yjs"); // 插入文本

const userList = root.get("users") as Y.Array<string>; // 获取数组
userList.push(["李四"]);
