import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createStructuredSelector } from "utils/reselectUtils";

import communicator from "communicator";

import missionReducer from "./reducers/missionReducer";
import settingsReducer from "./reducers/settingsReducer";
import telemetryReducer from "./reducers/telemetryReducer";

import * as missionSelectors from "./selectors/missionSelector";

const { getStateWith, registerSelectors } = require("reselect-tools"); // Use require when no TypeScript support

// Reducer setup
const reducer = combineReducers({
  settings: settingsReducer,
  telemetry: telemetryReducer,
  mission: missionReducer
});

// Apply communicator middleware for sending and receiving data from server
const middleware = applyMiddleware(communicator);

// Create store
const store = createStore(reducer, composeWithDevTools(middleware));
export type AppState = ReturnType<typeof store.getState>;

// Reselect setup
const selectors = {
  mission: createStructuredSelector<AppState>()(missionSelectors)
};
export const selector = createStructuredSelector<AppState>()(selectors);
// Reselect Devtools setup:
registerSelectors({ ...missionSelectors, ...selectors, selector }); // register string names for selectors
getStateWith(() => store.getState()); // allows you to get selector inputs and outputs

export default store;
