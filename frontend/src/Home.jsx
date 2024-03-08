import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate();

  const handleJoinChat = () => {
    if (name !== "" && room !== "") {
      navigate(`/chat?name=${name.toLowerCase()}&room=${room.toLowerCase()}`);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-sm p-4 flex flex-col justify-center items-center">
          <div className="flex w-full justify-center items-center">
            <h1 className="btn text-2xl text-center">Welcome to Chat App</h1>
          </div>
          <div className="flex flex-col w-full justify-center items-center gap-4 mt-16">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Your first name only</span>
              </div>
              <input
                type="text"
                placeholder="john"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Chat room name</span>
              </div>
              <input
                type="text"
                placeholder="xyz"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <a onClick={handleJoinChat} className="btn btn-primary">
              Join Chat
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
