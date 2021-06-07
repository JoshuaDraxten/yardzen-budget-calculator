import React from "react";
import RadioBox from "./radioBox";
import { BudgetItem } from "../types";
import beautifyPrice from "../helpers/beautifyPrice";

import Box from "@material-ui/core/Box";

interface budgetQuestionProps {
  title: String;
  options: BudgetItem[];
  onChange: Function;
  value: BudgetItem | undefined;
}

const MultipleChoiceBudgetQuestion: React.FC<budgetQuestionProps> = ({
  title,
  options,
  value,
  onChange,
}) => {
  // We want to display the options from cheapest to most expensive.
  // If the cheapest end of the range is the same, compare the most expensive end
  options.sort((a, b) => {
    const lowComparison = a.lowPrice - b.lowPrice;
    const highComparison = a.highPrice - b.highPrice;
    return lowComparison !== 0 ? lowComparison : highComparison;
  });

  return (
    <Box>
      <h2>{title}</h2>
      <Box className="budget-question-box">
        {options.map((budgetItem) => (
          <RadioBox
            key={budgetItem.name}
            isSelected={value?.name === budgetItem.name}
            // If this is selected, deselect when clicked
            onClick={() =>
              onChange(value?.name === budgetItem.name ? undefined : budgetItem)
            }
          >
            <b>{budgetItem.name}</b>
            <br />
            {beautifyPrice(budgetItem.lowPrice)}—
            {beautifyPrice(budgetItem.highPrice)}
          </RadioBox>
        ))}
      </Box>
    </Box>
  );
};

export default MultipleChoiceBudgetQuestion;
