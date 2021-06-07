import React, { CSSProperties, MouseEvent } from "react";

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
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div
      tabIndex={0}
      className={"radio-button" + (isSelected ? " selected" : "")}
      onClick={handleClick}
      style={style}
    >
      {children}
    </div>
  );
};
export default RadioBox;
