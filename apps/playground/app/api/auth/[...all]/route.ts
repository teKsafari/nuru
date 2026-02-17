import { auth, toNextJsHandler } from "@nuru/auth/server";

export const { POST, GET } = toNextJsHandler(auth);
