import { Box, TextField } from "@material-ui/core";
import React from "react";
import beautifyPrice from "../helpers/beautifyPrice";

interface clientBudgetInputProps {
  value: number;
  onChange: Function;
}

const ClientBudgetInput: React.FC<clientBudgetInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box marginY={10}>
      <h2>Hello! What's the Budget for your Project?</h2>
      <TextField
        variant="outlined"
        value={beautifyPrice(value, "standard")}
        fullWidth={true}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newPrice = parseInt(e.target.value.replace(/[^0-9]/g, ""));
          if (isNaN(newPrice)) {
            onChange(0);
          } else {
            onChange(newPrice * 100);
          }
        }}
        style={{ background: "#ffffff" }}
      />
    </Box>
  );
};

export default ClientBudgetInput;
