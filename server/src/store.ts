
import session from "express-session";
const MemoryStore = require("memorystore")(session);
export const store = new MemoryStore({});