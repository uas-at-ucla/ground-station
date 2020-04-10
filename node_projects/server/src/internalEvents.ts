import { EventEmitter } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { InteropData } from "messages";

interface Events {
  INTEROP_DATA: (interopData: InteropData | undefined) => void;
  INTEROP_UPLOAD_FAIL: () => void;
  INTEROP_UPLOAD_SUCCESS: () => void;
}

const eventEmitter: StrictEventEmitter<
  EventEmitter,
  Events
> = new EventEmitter();
export default eventEmitter;
