// import { useState } from "react";
// import "/MernProjects/Ecommerce-Site/Frontend/src/App.css"
// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: "user", text: input };
//     setMessages([...messages, userMessage]);


    
//     const response = await fetch("http://localhost:8080/chat/addchat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: input }),
//     });

//     const data = await response.json();
//     setMessages([...messages, userMessage, { sender: "bot", text: data.reply }]);
//     setInput("");
//   };

//   return (
//     <div className="w-[95%] my-8 mx-auto custom-scrollbar border p-4 shadow-lg rounded-lg bg-blue-300">
//       <div className="h-64 overflow-y-auto border-b mb-2 p-2">
//         {messages.map((msg, i) => (
//           <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
//             <p className={`p-2 my-1 inline-block rounded-lg ${
//               msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}>
//               {msg.text}
//             </p>
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input
//           type="text"
//           className="flex-1 border p-2 rounded-lg"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
