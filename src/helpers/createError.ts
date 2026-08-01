export interface AppError extends Error {
  status?: number
}

export function createError(message: string, status: number): AppError {
  const err = new Error(message) as AppError
  err.status = status
  return err
}
