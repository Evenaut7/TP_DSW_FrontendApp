/**
 * Extracts a human-readable message from a value caught in a `catch` block.
 * Caught values are typed `unknown`, so we narrow before reading `.message`.
 */
export function getErrorMessage(error: unknown, fallback = 'Error inesperado'): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
