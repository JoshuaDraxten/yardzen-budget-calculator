import React, { useEffect, useState } from "react";
import "./App.css";

// This is a Yardzen app, so let's use Yardzen's branding
import "./fonts/domaine-display-web-regular.woff";
import "./fonts/apercu-regular.woff";

import { BudgetItem } from "./types";
import getBudgetItems from "./api/getBudgetItems";

import filterDuplicates from "./helpers/filterDuplicates";
import beautifySlug from "./helpers/beautifySlug";

import Box from "@material-ui/core/Box";
import MultipleChoiceBudgetQuestion from "./components/multipleChoiceBudgetQuestion";
import beautifyPrice from "./helpers/beautifyPrice";

function App() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[] | undefined>();
  const [budgetSelections, setBudgetSelections] = useState<{
    [key: string]: BudgetItem;
  }>({});

  useEffect(function () {
    getBudgetItems().then(function (budgetItems) {
      setBudgetItems(budgetItems);
    });
  }, []);

  if (budgetItems === undefined) return <p>loading...</p>;

  const budgetItemTypes = filterDuplicates(
    budgetItems.map((budgetItem) => budgetItem.type)
  );

  const updateBudgetSelection = (budgetItemType: string, value: BudgetItem) => {
    setBudgetSelections((budgetSelections) => ({
      ...budgetSelections,
      [budgetItemType]: value,
    }));
  };

  const priceRange = budgetItemTypes
    // Get an array of all selected budget items
    .map((type) => budgetSelections[type])
    // Filter down to only the defined budget items
    .filter((selection) => selection)
    // Add their prices
    .reduce(
      (a, b) => ({
        lowPrice: a.lowPrice + b.lowPrice,
        highPrice: a.highPrice + b.highPrice,
      }),
      { lowPrice: 0, highPrice: 0 }
    );

  return (
    <Box className="container">
      <p>
        Price Range: {beautifyPrice(priceRange.lowPrice)}—
        {beautifyPrice(priceRange.highPrice)}
      </p>
      {budgetItemTypes.map((budgetItemType) => (
        <Box key={budgetItemType}>
          <MultipleChoiceBudgetQuestion
            value={budgetSelections[budgetItemType]}
            onChange={(value: BudgetItem) =>
              updateBudgetSelection(budgetItemType, value)
            }
            title={beautifySlug(budgetItemType)}
            options={budgetItems.filter(
              (budgetItem) => budgetItem.type === budgetItemType
            )}
          />
        </Box>
      ))}
    </Box>
  );
}

export default App;
