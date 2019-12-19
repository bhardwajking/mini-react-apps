import React from "react";
import { withStyles } from "@material-ui/core";
import AnalogClock from "./components/AnalogClock/AnalogClock";
import SignUp1 from "./components/SignUp/SignUp1";
import SignUp2 from "./components/SignUp/SignUp2";
import backgroundImage from "./assets/background.jpg";

const styles = () => ({
  root: {
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: "cover",
    fontFamily:'sans-serif'
  }
});
function App({ classes }) {
  return (
    <div className={classes.root}>
      <AnalogClock />
      <SignUp1 />
      <SignUp2 />
    </div>
  );
}

export default withStyles(styles)(App);
