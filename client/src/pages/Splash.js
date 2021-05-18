import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Context from "../context";
import Login from "../components/Auth/Login";

const Splash = () => {
  const { state } = useContext(Context);

  // console.log(state.isAuth);
  // console.log(state.currentUser);

  // while (!state.isAuth) {
  //   return <p>Loading...</p>;
  // }

  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;
