import { createContext } from "react";

const Context = createContext({
  currentUser: null,
  isAuth: false,
  loading: false,
  draft: null,
});

export default Context;
