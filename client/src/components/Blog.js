import React, { useContext } from "react";
import Context from "../context";
import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import PinContent from "./Pin/PinContent";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const Blog = ({ classes }) => {
  const { state } = useContext(Context);
  const { draft, currentPin } = state;
  const mobileSize = useMediaQuery("(max-width:650px)");

  let BlogContent;

  if (!draft && !currentPin) {
    // no Content
    BlogContent = NoContent;
  } else if (draft && !currentPin) {
    // Create Pin
    BlogContent = CreatePin;
  } else if (!draft && currentPin) {
    BlogContent = PinContent;
  }
  return (
    <Paper className={mobileSize ? classes.mobileSize : classes.root}>
      <BlogContent />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll",
  },
};

export default withStyles(styles)(Blog);
