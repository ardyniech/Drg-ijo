export function reportLovableError(error: Error, metadata?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.error("[ErrorReporting]", error, metadata);
  }
}
