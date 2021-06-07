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

import ClientBudgetInput from "./components/clientBudgetInput";
import { Button } from "@material-ui/core";

function App() {
  const [step, setStep] = useState(0);
  const [clientBudget, setClientBudget] = useState(3000000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[] | undefined>();
  const [budgetSelections, setBudgetSelections] = useState<{
    [key: string]: BudgetItem;
  }>({});

  useEffect(function () {
    getBudgetItems().then(setBudgetItems);
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

  let currentStep;
  if (step === 0) {
    currentStep = (
      <ClientBudgetInput value={clientBudget} onChange={setClientBudget} />
    );
  } else if (step < budgetItemTypes.length + 1) {
    const budgetItemType = budgetItemTypes[step - 1];
    currentStep = (
      <MultipleChoiceBudgetQuestion
        key={budgetItemType}
        value={budgetSelections[budgetItemType]}
        onChange={(value: BudgetItem) =>
          updateBudgetSelection(budgetItemType, value)
        }
        title={beautifySlug(budgetItemType)}
        options={budgetItems.filter(
          (budgetItem) => budgetItem.type === budgetItemType
        )}
      />
    );
  } else {
    currentStep = <p>That's all folks!</p>;
  }

  const showBackButton = step > 0;
  const showNextButton = step < budgetItemTypes.length + 1;

  return (
    <Box className="container">
      <p>
        Price Range: {beautifyPrice(priceRange.lowPrice, "compact")}—
        {beautifyPrice(priceRange.highPrice, "compact")}
      </p>
      {clientBudget > priceRange.lowPrice ? "Within Budget" : "Over Budget!"}
      {currentStep}
      <Box marginTop={4}>
        {showBackButton ? (
          <Button onClick={() => setStep((x) => x - 1)}>Back</Button>
        ) : null}
        {showNextButton ? (
          <Button
            onClick={() => setStep((x) => x + 1)}
            variant="contained"
            color="primary"
            style={{ float: "right" }}
          >
            Next Step
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
