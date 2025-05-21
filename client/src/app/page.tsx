'use client'

// import Image from "next/image";
// import { handleClientScriptLoad } from "next/script";
import { useState } from "react";
import io from "socket.io-client";


const socket = io("http://localhost:8000");

export default function Home() {
	const [message, setMessage] = useState("");
	const [list, setList] = useState([]);//過去のメッセージを保持しておくリスト。初めは空[]

	const handleSendMessage = () => {
		//サーバーへ送信
		socket.emit("send_message", { message: message })
		setMessage("");//メッセージを送信したら、入力欄は空に戻す ("")
	};

	//サーバーから受信
	socket.on("received_message", (data) => {
		console.log(data);
		setList([...list, data]);//スプレット構文で書いてる ...list→以前の配列, これにdataを追加する
	});

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
