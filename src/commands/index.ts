import * as ping from "./ping";
import * as createRoom from "./create-room";
import * as configureRoom from "./configure-room";
import * as configureBatch from "./configure-batch";

export const commands = {
    ping,
    "create-room": createRoom,
    "configure-room": configureRoom,
    "configure-batch": configureBatch,
};
