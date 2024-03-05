import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

let socket;

export const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const location = useLocation();

  const ENDPOINT = import.meta.env.VITE_SERVER_BASE_URl;

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    setName(name);
    setRoom(room);
    socket = io(ENDPOINT);

    // trigger and event to join the room
    socket.emit("joinRoom", { name, room }, (error) => {
      if (error) {
        console.error(error);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("newMessageInTheRoom", (details) => {
      setMessageList([...messageList, details]);
      console.log(details);
    });
  }, [messageList]);

  const sendMessage = () => {
    if (message) {
      socket.emit("newMessage", message, () => {});
      setMessage("");
    }
  };

  return (
    <>
      <div className="text-center text-3xl font-bold p-8">
        <h1>Chat app</h1>
        <h1>
          {name} joined {room}
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            placeholder="write your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button>Submit</button>
        </form>
        <div>
          {messageList.map((message, index) => (
            <div key={index}>
              <span className="text-red-500 uppercase">{message.user}</span> =={" "}
              <span>{message.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
