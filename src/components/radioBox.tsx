import React, { CSSProperties, MouseEvent } from "react";
import Box from "@material-ui/core/Box";

interface RadioBoxProps {
  isSelected: Boolean;
  onClick: Function;
  style?: CSSProperties;
}

const RadioBox: React.FC<RadioBoxProps> = ({
  isSelected,
  onClick,
  children,
  style,
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <Box
      className={"radio-button" + (isSelected ? " selected" : "")}
      onClick={handleClick}
      style={style}
    >
      {children}
    </Box>
  );
};
export default RadioBox;
