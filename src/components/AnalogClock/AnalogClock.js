import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core";
import clsx from "clsx";
import moment from "moment";

const styles = () => ({
  root: {
    background: "#888",
    padding: "1rem"
  },
  clock: {
    background: "#ececec",
    height: "300px",
    width: "300px",
    margin: "0 auto 0",
    borderRadius: "50%",
    border: "14px solid #333",
    position: "relative",
    boxShadow: "0 2vw 4vw -1vw rgba(0,0,0,0.8)"
  },
  dot: {
    height: "14px",
    width: "14px",
    background: "#ccc",
    borderRadius: "50%",
    margin: "auto",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    boxShadow: "0 2px 4px -1px black",
    zIndex: 10
  },
  hourHand: {
    position: "absolute",
    zIndex: 5,
    height: "65px",
    width: "4px",
    top: "79px",
    left: "50%",
    marginLeft: "-2px",
    background: "black",
    borderRadius: "50% 50% 0 0",
    transformOrigin: "50% 72px"
  },
  minuteHand: {
    position: "absolute",
    zIndex: 6,
    top: "46px",
    left: "50%",
    marginLeft: "-2px",
    height: "100px",
    width: "4px",
    background: "blue",
    borderRadius: "50% 50% 0 0",
    transformOrigin: "50% 105px"
  },
  secondHand: {
    position: "absolute",
    zIndex: 7,
    top: "26px",
    left: "50%",
    marginLeft: "-2px",
    height: "120px",
    width: "4px",
    background: "red",
    borderRadius: "50% 50% 0 0",
    transformOrigin: "50% 125px"
  },
  span: {
    display: "inline-block",
    position: "absolute",
    color: "#222",
    fontSize: "22px",
    fontFamily: "Poiret One",
    fontWeight: 700,
    zIndex: 4
  },
  h3: {
    right: "30px",
    top: "140px"
  },
  h6: {
    bottom: "30px",
    left: "50%"
  },
  h9: {
    top: "140px",
    left: "30px"
  },
  h12: {
    left: "50%",
    marginLeft: "-12px",
    top: "30px"
  },
  dialliness: {
    position: "absolute",
    zIndex: 2,
    width: "2px",
    height: "15px",
    background: "#666",
    left: "50%",
    marginLeft: "-1px",
    transformOrigin: "50% 150px",
    "&:nth-of-type(5)": {
      position: "absolute",
      zIndex: 2,
      width: "4px",
      height: "15px",
      background: "#666",
      left: "50%",
      marginLeft: "-1px",
      transformOrigin: "50% 150px"
    }
  },
  date: {
    position: "absolute",
    top: "80px",
    left: "50%",
    marginLeft: "-60px",
    width: "120px",
    height: "20px",
    textAlign: "center",
    backgroundColor: "#888",
    color: "#fff",
    borderRadius: "7px",
    fontSize: "11px",
    fontFamily: "Poiret One",
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "3px",
    zIndex: 3
  },
  day: {
    position: "absolute",
    top: "200px",
    left: "50%",
    marginLeft: "-60px",
    width: "120px",
    height: "20px",
    textAlign: "center",
    backgroundColor: "#888",
    color: "#fff",
    borderRadius: "7px",
    fontSize: "11px",
    fontFamily: "Poiret One",
    fontWeight: 700,
    lineHeight: "20px",
    letterSpacing: "3px",
    zIndex: 3
  }
});
export function AnalogClock({ classes }) {
  const [seconds, setSeconds] = useState("");
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    setInterval(handleDate, 1000);
    return () => {
      clearInterval();
    };
  }, []);

  const handleDate = () => {
    let date = new Date();
    let hours = 5; //(date.getHours() + 24)%12 || 12;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  };
  const secondStyle = {
    transform: `rotate(${seconds * 6}deg)`
  };

  const minutesStyle = {
    transform: `rotate(${minutes * 6}deg)`
  };
  const hoursStyle = {
    transform: `rotate(${hours * 6}deg)`
  };
  return (
    <div className={classes.root}>
      <div className={classes.clock}>
        <div>
          <div className={classes.date}></div>
          <div className={classes.day}></div>
        </div>
        <div className={classes.dot}></div>
        <div>
          <div className={classes.hourHand} style={hoursStyle}></div>
          <div className={classes.minuteHand} style={minutesStyle}></div>
          <div className={classes.secondHand} style={secondStyle}></div>
        </div>
        <div>
          <span className={clsx(classes.span, classes.h3)}>3</span>
          <span className={clsx(classes.span, classes.h6)}>6</span>
          <span className={clsx(classes.span, classes.h9)}>9</span>
          <span className={clsx(classes.span, classes.h12)}>12</span>
        </div>
        <div className={classes.date}>{moment().format("YYYY/MM/DD")}</div>
        <div className={classes.day}>{moment().format("dddd")}</div>

        <div className={classes.dialliness}></div>
      </div>
    </div>
  );
}

export default withStyles(styles)(AnalogClock);
