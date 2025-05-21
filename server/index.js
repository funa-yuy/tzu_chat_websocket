//ローカルサーバーを用意

//以下２行で、expressのフレームワークを使えるようになる
const express = require("express");
const { SlowBuffer } = require("node:buffer");
const { Socket } = require("node:dgram");
const { createServer } = require("node:http");
const path = require("path");

const app = express();
const server = createServer(app);
const { Server } = require("socket.io");//Socket.ioライブラリからServerクラスを取り出す

// 本番環境の場合のみ、静的ファイルを提供
if (process.env.NODE_ENV === "production") {
	// 静的ファイル提供
	app.use(express.static(path.join(__dirname, "../client/.next")));
	app.use(express.static(path.join(__dirname, "../client/public")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/.next/server/app/index.html"));
	});
}

const io = new Server(server, {
	cors: {
		origin: process.env.NODE_ENV === "production"
			? false
			: ["http://localhost:3000"]
	},
});

const PORT = process.env.PORT || 8000;

//クライアントと通信 onメソッドは受け取るメソッド
io.on("connection", (socket) => {
	console.log("クライアントと接続しました");

	//クライアントからの受信
	socket.on("send_message", (data) => {
		const messageId = Date.now().toString();
		console.log(data);
		//クライアントへ送信 メッセージを一緒にidも送る
		io.emit("received_message", { message: data.message, id: messageId });
	});
	//もし、クライアントとの接続が切れたら
	socket.on("disconnect", () => {
		console.log("クライアントと接続が切れました");
	});
});

server.listen(PORT, () => console.log(`server is running on ${PORT}`));
