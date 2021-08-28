import React from "react";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Chat from "./Components/Chats/Chat";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import { useStateValue } from "./Datalayer/StateProvider";
function App() {
  const [{ user, mode }, dispatch] = useStateValue();
  return (
    <div className={`${mode ? "app" : "night"}`}>
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Switch>
              {/* render the chats based on the id */}
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
