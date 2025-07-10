import * as Y from "yjs";

const doc = new Y.Doc(); // 创建第一个副本，相当于一个客户端A
const users = doc.getMap("users"); // 创建了一个Map类型的Yjs对象

const user1 = new Y.Map();
const tag = new Y.Array();
tag.push(["tag1", "tag2", [{
  "name": "tag8",
  "value": "tag8"
}]]);
user1.set("tags", tag);

// 接下来再将这个user1添加到users中
users.set("user1", user1); // 将user1添加到users中

users.set("name", "Lucy");

console.log(users.toJSON()); // { name: 'Lucy', user1: { tags: [ 'tag1', 'tag2' ] } }
