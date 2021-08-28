import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton, Button } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import CachedRoundedIcon from '@material-ui/icons/CachedRounded';
import SidebarChat from "../SidebarChat/SidebarChat";
import db from "../../Config/firebase";
import { useStateValue } from "../../Datalayer/StateProvider";
import Switch from "@material-ui/core/Switch";
import { actionType } from "../../Datalayer/reducer";
import { useHistory } from "react-router-dom";
import {onlineUsers} from "../../Config/firebase";
import { Label } from "@material-ui/icons";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const [activecount, setActiveCount] = useState(0);
  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot(snapshot => {
      setRooms(
        snapshot.docs.map(doc => {
          return {
            id: doc.id,
            data: doc.data()
          };
        })
      );
    });
    return () => {
      unsubscribe(); //to perform the cleanup actions
    };
  }, []);
  const filteredRoom = rooms.filter(room => {
    return room.data.name.includes(search.toLowerCase());
  });

  const handleChange = () => {
    setChecked(!checked);
    dispatch({
      type: actionType.SET_MODE,
      mode: checked
    });
  };

  const logout = () => {
    dispatch({
      type: actionType.SET_USER,
      user: null
    });
    onlineUsers.leave()
    history.push("/");
    window.location.reload(true);
  };

  const currentUsers = () => {
    onlineUsers.onUpdated(function(count, users) {
      setActiveCount(count)
  });
}

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__callToAction">
        <div className="sidebar__callToActionLeft">
          <p>{`${checked ? "Disable" : "Enable"} Dark Mode`}</p>
          <Switch
            checked={checked}
            onChange={handleChange}
            name="checkedA"
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        </div>
        <Button onClick={logout}>Logout</Button>
      </div>

      <div className="sidebar_search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input
            placeholder="Search or Start new Chat"
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {filteredRoom.map(room => {
          return (
            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
          );
        })}
      </div>
      <div className="sidebar_search">
        <AccountCircleRoundedIcon />
        
        <label style={{color:'green'}}>{activecount} member online</label>
        <CachedRoundedIcon onClick={currentUsers}/>
      </div>
    </div>
  );
};

export default Sidebar;
