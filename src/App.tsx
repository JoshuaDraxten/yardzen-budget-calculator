import React, { useEffect, useState } from "react";
import "./App.css";

// This is a Yardzen app, so let's use Yardzen's branding
import "./fonts/domaine-display-web-regular.woff";
import "./fonts/apercu-regular.woff";

import { BudgetItem, PriceRange } from "./types";
import getBudgetItems from "./api/getBudgetItems";

import filterDuplicates from "./helpers/filterDuplicates";
import beautifySlug from "./helpers/beautifySlug";

import Box from "@material-ui/core/Box";
import MultipleChoiceBudgetQuestion from "./components/multipleChoiceBudgetQuestion";
import ClientBudgetInput from "./components/clientBudgetInput";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

function App() {
  const [clientBudget, setClientBudget] = useState(3000000);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[] | undefined>();
  const [budgetItemTypes, setBudgetItemTypes] = useState<string[]>([]);
  // Which step of the questions the user is on
  const [step, setStep] = useState(0);
  // The budgetItems that the user has selected for each item type
  const [budgetSelections, setBudgetSelections] = useState<{
    [key: string]: BudgetItem;
  }>({});
  const [priceRange, setPriceRange] = useState<PriceRange>({
    lowPrice: 0,
    highPrice: 0,
  });

  useEffect(function () {
    getBudgetItems().then(setBudgetItems);
  }, []);

  // In order to group the BudgetItems by type, we need to know the types that exist
  useEffect(
    function () {
      if (budgetItems === undefined) return;
      setBudgetItemTypes(
        filterDuplicates(budgetItems.map((budgetItem) => budgetItem.type))
      );
    },
    [budgetItems]
  );

  useEffect(
    function () {
      // Get the pricerange
      const newPriceRange = budgetItemTypes
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
      setPriceRange(newPriceRange);
    },
    [budgetItemTypes, budgetSelections]
  );

  if (budgetItems === undefined) return <p>loading...</p>;

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

  const totalSteps = budgetItemTypes.length + 2;

  return (
    <Box className="container">
      <AppHeader
        step={step}
        totalSteps={totalSteps}
        clientBudget={clientBudget}
        priceRange={priceRange}
      />
      {currentStep}
      <AppFooter
        step={step}
        totalSteps={totalSteps}
        prevStep={() => setStep((x) => x - 1)}
        nextStep={() => setStep((x) => x + 1)}
      />
    </Box>
  );
}

export default App;
