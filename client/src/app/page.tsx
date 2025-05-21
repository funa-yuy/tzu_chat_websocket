'use client'

// import Image from "next/image";
// import { handleClientScriptLoad } from "next/script";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

// Socket.io接続
// const socket = io(
// 	process.env.NODE_ENV === "production"
// 		? window.location.origin
// 		: "http://localhost:8000"
// );

export default function Home() {
	const [message, setMessage] = useState("");
	type ChatMessage = { message: string; id: string };
	const [list, setList] = useState<ChatMessage[]>([]);//過去のメッセージを保持しておくリスト。初めは空[]
	const [socket, setSocket] = useState<Socket | null>(null);

	// クライアント側のみで実行されるコード
	useEffect(() => {
		// ブラウザでのみソケットを初期化
		const socketConnection = io(
			process.env.NODE_ENV === "production"
				? window.location.origin
				: "http://localhost:8000"
		);

		setSocket(socketConnection);

		// サーバーから受信
		socketConnection.on("received_message", (data) => {
			console.log(data);
			setList((prevList) => [...prevList, data]);
		});

		// クリーンアップ関数
		return () => {
			socketConnection.disconnect();
		};
	}, []);

	const handleSendMessage = () => {
		if (socket) {
			//サーバーへ送信
			socket.emit("send_message", { message: message });
			setMessage("");//メッセージを送信したら、入力欄は空に戻す ("")
		}
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

			<div className="container">
				<h2>チャットアプリ</h2>
				<div className="chatInputButton">
					<input
						type="text"
						placeholder="入力してください"
						onChange={(e) => setMessage(e.target.value)}
						value={message}
					/>
					<button onClick={() => handleSendMessage()}>チャット送信</button>
				</div>
				<div className="messageContainer">
					{/* listをループで表示している */}
					{list.map((chat) => (
						<div className="chatArea" key={chat.id}>
							{chat.message}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
