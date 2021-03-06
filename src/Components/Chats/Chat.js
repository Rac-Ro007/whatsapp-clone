import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import DoneAllRoundedIcon from '@material-ui/icons/DoneAllRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import CachedRoundedIcon from '@material-ui/icons/CachedRounded';
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "../../Config/firebase";
import { useStateValue } from "../../Datalayer/StateProvider";
import firebase from "firebase";
import {onlineUsers} from "../../Config/firebase";

const Chat = () => {
  const [{ user }, dispatch] = useStateValue();
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const ref = useRef(null);

  const { roomId } = useParams(); // getting the parameter passed as a url

  const [roomName, setRoomName] = useState("");

  const [roomMembers, setRoomMembers] = useState([]);

  const [messages, setMessages] = useState([]); //for storing a messages or chats

  // const [receipentStatus, setReceipentStatus] = useState("");// for receipient status
  useEffect(() => {
    //   to render the chat based on the roomid provided as a url params and run for each roomId changes
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot(snapshot => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .onSnapshot(snapshot => setRoomMembers(snapshot.data().participants));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot(snapshot => {
          setMessages(snapshot.docs.map(doc => doc.data()));
        });      
    }
  }, [roomId]);

  const updateRecieveMessages = () => {
      // Update all received messages
      db.collection("rooms").doc(roomId).collection("messages").where('name', '!=', onlineUsers.myName)
        .onSnapshot(snapshots => {
          if (snapshots.size > 0) {
            snapshots.forEach(msg => {
              db.collection("rooms").doc(roomId).collection("messages").doc(msg.id).update({ status: 'seen' })
            })
          }
        })
      // var unReadMessages = db.collection("rooms").doc(roomId).collection("messages")

      // unReadMessages.where('name', '!=', onlineUsers.myName)
      //   .get()
      //   .then(snapshots => {
      //     if (snapshots.size > 0) {
      //       snapshots.forEach(msg => {
      //         unReadMessages.doc(msg.id).update({ status: 'seen' })
      //       })
      //     }
      //   })
  }
  
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    if (roomId) {
      updateRecieveMessages()
    }
  }, [roomId]);

  const sendMessage = e => {
    e.preventDefault();
    if (input) {
      
      // fetching status of user
      var receipentStatus = '';

      console.log(onlineUsers)
      console.log(user)
      onlineUsers.onUpdated(function(count, users) {
        for(var userRole in users) {
            console.log({roomMembers})
            console.log(users[userRole])
            for (var member in roomMembers) {
              if (roomMembers[member] === users[userRole] && users[userRole] !== onlineUsers.myName) {
                console.log(roomMembers[member] === users[userRole])
                receipentStatus = 'delivered'
                break
              }
            }
        }
        if (receipentStatus === '') {
          receipentStatus = 'sent'
        }
      });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
          message: input,
          name: user.email,
          // to add the timestamp of the server time
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          // status of message
          status: receipentStatus
        });
      setInput("");
      ref.current.scrollTo(0, ref.current.scrollHeight + 100);
    }
  };

  const getStatus = (status) => {
    if (status === 'delivered'){
      return <DoneAllRoundedIcon style={{color:'grey'}} />
    }
    else if (status === 'seen') {
      return <DoneAllRoundedIcon style={{color:'blue'}} />
    } 
    else {
      return <DoneRoundedIcon style={{color:'grey'}} />
    }
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          {/* the last seen is implemented by checking the time of the last message from the chat */}
          <p>
            {messages.length !== 0
              ? new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()
              : ""}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <CachedRoundedIcon style={{color:'green', float:'right'}} onClick={updateRecieveMessages}/>
          </IconButton>
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body" ref={ref}>
        {messages.map((message, index) => {
          return (
            <p
              className={`chat__message ${
                message.name === user.email && "chat__receiver"
                //to check if the messaging user is same as the logged in user then it //////will be on right side
              }`}
              key={index}
            >
              <span className="chat__name">{message.name}</span>
              {message.message}
              <br></br>
              <span className="chat__timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
              &nbsp;&nbsp;
              {getStatus(message.status)}
            </p>
          );
        })}
      </div>
      <div className="chat__footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Send Message"
          />
          <button onClick={sendMessage}>Send a message</button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
