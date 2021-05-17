import React from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import withRoot from "../withRoot";

const App = () => {
  return (
    <>
      <Header />
      <Map />
    </>
  );
};

// 'withRoot' is part of materialUI
export default withRoot(App);
