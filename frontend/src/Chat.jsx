import queryString from "query-string";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";

import { useNavigate } from "react-router-dom";

let socket;

export const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const navigate = useNavigate();

  const chatWindowRef = useRef(null);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on("newMessageInTheRoom", (details) => {
      setMessageList([...messageList, details]);
    });

    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messageList]);

  const sendMessage = () => {
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    if (message) {
      socket.emit("newMessage", message, () => {});
      setMessage("");
    }
  };

  return (
    <>
      <div className="flex justify-start items-center flex-col gap-4 h-screen">
        <div className="w-full max-w-sm p-4 flex flex-col gap-2 justify-center items-center">
          <h1 className="btn text-xl text-center">
            {name.toUpperCase()} JOINED {room.toUpperCase()}
          </h1>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="btn btn-sm"
          >
            Join new Chat
          </button>
        </div>
        <div
          ref={chatWindowRef}
          className="w-full max-w-sm p-4 overflow-y-auto pb-20"
        >
          {messageList.map((message, index) => (
            <Fragment key={index}>
              <div
                className={`chat ${
                  message.user !== name ? "chat-start" : "chat-end"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={`https://api.nilskoepke.com/profile-image/?name=${message.user}&backgroundColor=rgb(33,194,87)`}
                    />
                  </div>
                </div>
                <div className="chat-header">{message.user.toUpperCase()}</div>
                <div className="chat-bubble">{message.text}</div>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="w-full max-w-sm p-4 absolute bottom-0">
          <label className="input input-bordered flex items-center gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              type="text"
              className="grow"
              placeholder="Send Message"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="btn btn-success btn-sm"
            >
              Send
            </button>
          </label>
        </div>
      </div>
    </>
  );
};
