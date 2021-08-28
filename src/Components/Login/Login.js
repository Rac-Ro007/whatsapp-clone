import React from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import { auth, provider, onlineUsers } from "../../Config/firebase";
import { useStateValue } from "../../Datalayer/StateProvider";
import { actionType } from "../../Datalayer/reducer";
const Login = () => {
  const [{}, dispatch] = useStateValue();
  const signIn = e => {
    e.preventDefault();
    //   before this enable the authentication in your firebase and select the google //method

    // signin with the auth protocol
    auth
      .signInWithPopup(provider)
      .then(result => {
        dispatch({
          // dispatches the data into data layer after login
          type: actionType.SET_USER,
          user: result.user
        });
        // adding to user list
        onlineUsers.join(result.user.uid, result.user.email);
        console.log(result.user.uid, result.user.email)
      })
      .catch(err => alert(err.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://pngimg.com/uploads/whatsapp/whatsapp_PNG20.png"
          alt="logo"
        />
        <div className="login__text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <Button type="submit" onClick={signIn}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
