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
  const [clientBudget, setClientBudget] = useState(3000000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[] | undefined>();
  // Which step of the questions the user is on
  const [step, setStep] = useState(0);

  // The budgetItems that the user has selected for each item type
  const [budgetSelections, setBudgetSelections] = useState<{
    [key: string]: BudgetItem;
  }>({});

  useEffect(function () {
    getBudgetItems().then(setBudgetItems);
  }, []);

  if (budgetItems === undefined) return <p>loading...</p>;

  // In order to group the BudgetItems by type, we need to know the types
  const budgetItemTypes = filterDuplicates(
    budgetItems.map((budgetItem) => budgetItem.type)
  );

  // Get the pricerange
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
    // The last step
    currentStep = (
      <h2 style={{ textAlign: "center", lineHeight: 10 }}>
        {clientBudget > priceRange.lowPrice
          ? "Nice! You're Within Budget!"
          : "Oh no! You're Over Budget 😭"}
      </h2>
    );
  }

  const updateBudgetSelection = (budgetItemType: string, value: BudgetItem) => {
    setBudgetSelections((budgetSelections) => ({
      ...budgetSelections,
      [budgetItemType]: value,
    }));
  };

  const showBackButton = step > 0;
  const showNextButton = step < budgetItemTypes.length + 1;

  return (
    <Box className="container">
      <div style={{ marginBottom: 32 }}>
        <span>
          {step + 1}/<b>{budgetItemTypes.length + 2}</b>
        </span>
        {step !== 0 ? (
          <div style={{ float: "right" }}>
            Budget: {beautifyPrice(clientBudget, "compact")} &nbsp;|&nbsp; Total
            Range:{" "}
            <span
              style={{
                color: clientBudget > priceRange.lowPrice ? "inherit" : "red",
              }}
            >
              {beautifyPrice(priceRange.lowPrice, "compact")}-
              {beautifyPrice(priceRange.highPrice, "compact")}
            </span>
          </div>
        ) : null}
      </div>
      {currentStep}
      <Box marginTop={4}>
        {showBackButton ? (
          <Button onClick={() => setStep((x) => x - 1)} size="large">
            Back
          </Button>
        ) : null}
        {showNextButton ? (
          <Button
            onClick={() => setStep((x) => x + 1)}
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            size="large"
          >
            Next Step
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

export default App;
