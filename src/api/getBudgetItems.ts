import firebase from "firebase/app";
import "firebase/firestore";

import { BudgetItem } from '../types';

import filterDuplicates from "../helpers/filterDuplicates";

const firebaseConfig = {
  apiKey: "AIzaSyD7NUVfrImccSo8FuCBG7bXVk0oLFqgE-k",
  authDomain: "yardzen-demo.firebaseapp.com",
  databaseURL: "https://yardzen-demo.firebaseio.com",
  projectId: "yardzen-demo",
  storageBucket: "yardzen-demo.appspot.com",
  messagingSenderId: "509183652730",
  appId: "1:509183652730:web:ba2208f7d8e0882f009cc3"
}

// Sometimes CRA Hotloading re-initializes the firebase app. So before
// we initialiae a new one, lets check if one already exists.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var db = firebase.firestore();

// Since there are few responses, we can store all the budget items in an array
export default function getItems(){
  return db.collection("items").get().then((querySnapshot) => {
    let items : BudgetItem[] = [];
    querySnapshot.forEach((doc) => {
      const itemData = doc.data() as BudgetItem;
      items.push(itemData);
    });

    // We assume the name is unique for each Budget item given the data we have
    return filterDuplicates( items, "name" );
  });
}