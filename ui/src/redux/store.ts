import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createStructuredSelector } from "reselect";

import communicator from "communicator";
import loadTimelineGrammar from "protobuf/timelineGrammarUtil";

import missionReducer from "./reducers/missionReducer";
import settingsReducer from "./reducers/settingsReducer";
import telemetryReducer from "./reducers/telemetryReducer";

import missionSelector from "./selectors/missionSelector";

const reducer = combineReducers({
  settings: settingsReducer,
  telemetry: telemetryReducer,
  mission: missionReducer
});
export type AppState = ReturnType<typeof reducer>;

export const selector = createStructuredSelector({
  mission: missionSelector
});

const middleware = applyMiddleware(communicator);

const store = createStore(reducer, composeWithDevTools(middleware));

loadTimelineGrammar(store.dispatch);

export default store;
