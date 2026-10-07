import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const fetchHandler = createStartHandler(defaultStreamHandler);

export const fetch = fetchHandler;

export default {
  fetch: fetchHandler,
};
