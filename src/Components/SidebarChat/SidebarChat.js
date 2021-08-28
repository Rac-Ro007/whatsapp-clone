import React, { useEffect, useState } from "react";
import { Avatar, TextField, Button } from "@material-ui/core";
import "./SidebarChat.css";
import db from "../../Config/firebase";
import { Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
const SidebarChat = ({ addNewChat, id, name }) => {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  useEffect(() => {
    //for getting the last message that was sent
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot =>
          setMessages(snapshot.docs.map(doc => doc.data()))
        );
    }
  }, [id]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const createChat = e => {
    e.preventDefault();
    if (input) {
      //do some stuffs in db
      db.collection("rooms").add({
        name: input
      });
      setInput("");
      handleClose();
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className="sidebarChat__modal"
      >
        <div className="sidebarChat__modalContainer">
          <h1>Add a New Chat</h1>
          <TextField
            variant="outlined"
            placeholder="Enter room name"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button onClick={createChat}>Create</Button>
        </div>
      </Modal>
      <div className="sidebarChat" onClick={handleOpen}>
        <h2>Add New Chat</h2>
      </div>
    </>
  );
};

export default SidebarChat;
