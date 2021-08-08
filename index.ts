import http from "http";
import { getFromClient } from "./functions";

// HTTPサーバーを立てる
const server = http.createServer(getFromClient);

// 4000番ポートでサーバー起動
server.listen(3000);
console.log('server start!');


