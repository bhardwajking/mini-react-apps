import React from "react";
import { withStyles } from "@material-ui/core";

const styles = () => ({
    root:{
        background:'#753',
        padding:'1rem'
    },
  constainer: {
    width: "500px",
    margin: "auto",
    background: "rgba(0,0,0,.5)",
    textAlign: "center",
    padding: "2rem",
    borderRadius: "12px",
    boxSizing:'border-box',
    boxShadow:'0 16px 26px rgba(0,0,0,.5)'
  },
  h2:{
color:'#fff',
fontFamily:'cursive',
fontSize:'2rem',
fontWeight:100
  },
  input: {
    borderRadius: "20px",
    width: "70%",
    padding: "0.8rem",
    border:'none'
  },
  btn1: {
    background: "#0072ff",
    color:'#fff',
    borderRadius:'5px',
    border:'none',
    padding:'0.6rem',
    width:'20%'
  }
});

export function SignUp2({ classes }) {
  return (
    <div className={classes.root}>
      <div className={classes.constainer}>
        <h2 className={classes.h2}>SIGN UP</h2>
        <form action={() => {}}>
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
            placeholder="Last Name"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="text"
            placeholder="Phone Number"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="email"
            placeholder="Email"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="password"
            placeholder="Password"
          ></input>
          <br />
          <br />
          <input
            className={classes.input}
            type="password"
            placeholder="Confirm Password"
          ></input>
          <br />
          <br />
          <button className={classes.btn1} type="submit">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}

export default withStyles(styles)(SignUp2);
