import React, { useEffect, useState } from 'react';
import './App.css';

import { BudgetItem } from './types';
import getItems from './api/getItems';

import filterDuplicates from './helpers/filterDuplicates';
import beautifySlug from './helpers/beautifySlug';
import beautifyPrice from './helpers/beautifyPrice';

function ListBudgetItems(props: { budgetItems: BudgetItem[] }) {
  // We want to display the options from cheapest to most expensive.
  // If the cheapest end of the range is the same, compare the most expensive end 
  props.budgetItems.sort((a,b) => {
    const lowComparison = a.lowPrice - b.lowPrice;
    const highComparison = a.highPrice - b.highPrice;
    return lowComparison !== 0 ? lowComparison : highComparison;
  });
  return <ul>
    {props.budgetItems.map(
      budgetItem => <li>{budgetItem.name} | {beautifyPrice(budgetItem.lowPrice)} – {beautifyPrice(budgetItem.highPrice)}</li>
    )}
  </ul>
}

function App() {
  const [ budgetItems, setBudgetItems ] = useState<BudgetItem[] | undefined>();

  useEffect(function(){
    getItems().then( setBudgetItems );
  }, []);

  if ( budgetItems === undefined ) return <p>loading...</p>;

  const budgetItemTypes = filterDuplicates(budgetItems.map( budgetItem => budgetItem.type ));
  return (
    <div className="App">
      { budgetItemTypes.map( budgetItemType => <div key={budgetItemType}>
        <h3>{beautifySlug(budgetItemType)}</h3>
        <ListBudgetItems budgetItems={budgetItems.filter(budgetItem => budgetItem.type === budgetItemType)}/>
      </div>)}
    </div>
  );
}

export default App;
