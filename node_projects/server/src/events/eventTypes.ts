// This file is used purely to define a type definition encompassing all possible events

import * as events from "./events";

const allEvents = {
  ...events
};

const allEventsArray = Object.values(allEvents);

export type AppAction = ReturnType<typeof allEventsArray[number]>;
