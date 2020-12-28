import React  from "react";
import Button from "@material-ui/core/Button";

export const PrimaryButton = ({ onClick, children }) => {
  return (
    <Button color="primary" onClick={onClick}>
      {children}
    </Button>
  );
};
