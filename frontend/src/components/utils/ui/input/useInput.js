import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    margin: "0.5rem auto",
    width: "100%",
    height: "3rem"
  }
});

const defaultFunc = () => {};

function useInput({ type = "text", placeholder = "", handleKeyPress = defaultFunc, onUpdate = defaultFunc, label = "" }) {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const handleChange = e => {
    onUpdate();
    setValue(e.target.value);
  };

  const input = (
    <TextField
      value={value}
      label={label}
      onChange={handleChange}
      placeholder={placeholder}
      type={type}
      onKeyPress={handleKeyPress}
      className={classes.root}
      width="100%"
    />
  );
  return [value, input];
}

export default useInput;
