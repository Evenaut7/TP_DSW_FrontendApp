/**
 * Extracts a human-readable message from a value caught in a `catch` block.
 * Caught values are typed `unknown`, so we narrow before reading `.message`.
 */
export function getErrorMessage(error: unknown, fallback = 'Error inesperado'): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const FOREIGN_KEY_PATTERN = /foreign key constraint|cannot delete or update a parent row/i;
const DUPLICATE_PATTERN = /duplicate entry|unique constraint/i;
const RAW_SQL_PATTERN = /\b(select|insert|update|delete)\b[\s\S]*\b(from|into|set|where)\b/i;

interface TranslateApiErrorOptions {
  /** Message used when the raw error is empty or must not be shown to the user. */
  fallback?: string;
  /** What blocks a delete, e.g. "localidades asociadas". Used when a foreign key rejects the delete. */
  dependents?: string;
}

/**
 * Converts a raw error coming from the API into a message that is safe and
 * understandable for the end user. Database errors (foreign keys, unique
 * constraints, raw SQL) are translated or replaced, never shown as-is.
 */
export function translateApiError(
  raw: string | null | undefined,
  { fallback = 'Ocurrió un error inesperado. Intentá nuevamente.', dependents }: TranslateApiErrorOptions = {},
): string {
  if (!raw) return fallback;
  if (FOREIGN_KEY_PATTERN.test(raw)) {
    return dependents
      ? `No se puede eliminar porque tiene ${dependents}. Eliminá o reasigná esos elementos primero.`
      : 'No se puede completar la operación porque hay datos relacionados.';
  }
  if (DUPLICATE_PATTERN.test(raw)) return 'Ya existe un registro con esos datos.';
  if (RAW_SQL_PATTERN.test(raw)) return fallback;
  return raw;
}
