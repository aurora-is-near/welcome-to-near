// Example
// {
//   "index": 0,
//   "kind": {
//     "index": 0,
//     "kind": {
//       "FunctionCallError": {
//         "ExecutionError": "Smart contract panicked: Only validator can distribute tokens"
//       }
//     }
//   }
// }
export default function isFtExecutionError(error: string): string | null {
  try {
    const parsedErr = JSON.parse(error);
    const errMessage = parsedErr.kind.kind.FunctionCallError.ExecutionError;
    if (typeof errMessage !== "string") return null;
    return errMessage;
  } catch (e) {
    console.error(e);
    return null;
  }
}
