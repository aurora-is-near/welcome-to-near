export function isUserRejectedError(error: any) {
  try {
    if (
      error &&
      (error?.cause?.code === 4001 ||
        (typeof error === "string" && error?.includes("canceled")) ||
        (typeof error?.message === "string" &&
          error?.message?.includes("rejected")))
    ) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
