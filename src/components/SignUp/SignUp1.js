import React from "react";
import { withStyles, Checkbox } from "@material-ui/core";

const styles = () => ({
  root: {
    background: "#647",
    padding: "1rem"
  },
  container: {
    margin: "auto",
    width: "40%",
    padding: "1rem",
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: "2%",
    textAlign: "center",
    borderRadius: "10px"
  },
  btn1: {
    background: "#3b5998",
    color: "#fff",
    borderRadius: "15px",
    border: "none",
    padding: "0.5rem 2rem"
  },
  hr: {
    width: "80%"
  },
  input: {
    borderRadius: "5px",
    textAlign: "center",
    padding: "0.5rem 0",
    width: "70%"
  },
  btn2: {
    background: "#2ecc71",
    fontSize: "1rem",
    width: "50%",
    borderRadius: "7px",
    border: "none",
    padding: "1rem"
  }
});

export function SignUp1({classes}) {
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h3>Create an Account</h3>
        <button className={classes.btn1}>Sign Up with facebook</button>
        <br />
        <hr className={classes.hr} />
        <h5>Register Now</h5>
        <form className={classes.form}>
          <input
            className={classes.input}
            type="text"
            placeholder="First Name"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="text"
            placeholder="Email"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="text"
            placeholder="Password"
          ></input>
          <br />
          <br />
          <Checkbox></Checkbox>I agree with{" "}
          <a style={{ textDecoration: "none" }} href="./">
            Terms and Conditions
          </a>{" "}
          &{" "}
          <a style={{ textDecoration: "none" }} href="./">
            Privacy Policy
          </a>
          <br />
          <button className={classes.btn2}>Sign Up Now !</button>
        </form>
      </div>
    </div>
  );
}

export default withStyles(styles)(SignUp1);
