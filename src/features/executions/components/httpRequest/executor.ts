import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  endPoint?: string;
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context, //data from prev node
  step,
}) => {
  // if not configured
  if (!data.endPoint) {
    throw new NonRetriableError("HTTP request node: No endpoint configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endPoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  return result;
};
































// ┌──────────────────────────────────────────────────────────────────────┐
// │              HTTP REQUEST NODE EXECUTION FLOW                         │
// └──────────────────────────────────────────────────────────────────────┘

// STEP 1: Node Configuration (from React Flow)
// ────────────────────────────────────────────
// User configured node with:
// {
//   endpoint: "https://jsonplaceholder.typicode.com/users/1",
//   method: "GET",
//   body: undefined
// }

//     ↓

// STEP 2: Executor Called
// ────────────────────────
// httpRequestExecutor({
//   data: {
//     endpoint: "https://jsonplaceholder.typicode.com/users/1",
//     method: "GET"
//   },
//   nodeId: "node-2",
//   context: {}, // Empty if first action node
//   step: inngestStepHelper
// })

//     ↓

// STEP 3: Validate Configuration
// ───────────────────────────────
// ✅ endpoint exists? YES
// Continue...

//     ↓

// STEP 4: Prepare Request
// ───────────────────────
// endpoint = "https://jsonplaceholder.typicode.com/users/1"
// method = "GET"
// options = { method: "GET" }

// Is method POST/PUT/PATCH? NO
// → Don't add body

//     ↓

// STEP 5: Make HTTP Request
// ──────────────────────────
// await ky("https://jsonplaceholder.typicode.com/users/1", { method: "GET" })

//     ↓ (Network call happens)

// Response received:
//   Status: 200 OK
//   Headers: { "content-type": "application/json; charset=utf-8" }
//   Body: {
//     "id": 1,
//     "name": "Leanne Graham",
//     "username": "Bret",
//     "email": "Sincere@april.biz"
//   }

//     ↓

// STEP 6: Parse Response
// ──────────────────────
// contentType = "application/json; charset=utf-8"
// contentType includes "application/json"? YES
// → Use response.json()

// responseData = {
//   id: 1,
//   name: "Leanne Graham",
//   username: "Bret",
//   email: "Sincere@april.biz"
// }

//     ↓

// STEP 7: Add to Context
// ───────────────────────
// Return:
// {
//   ...context, // Spread existing context (empty in this case)
//   httpResponse: {
//     status: 200,
//     statusText: "OK",
//     data: {
//       id: 1,
//       name: "Leanne Graham",
//       username: "Bret",
//       email: "Sincere@april.biz"
//     }
//   }
// }

//     ↓

// STEP 8: Return to Orchestrator
// ───────────────────────────────
// Orchestrator receives updated context:
// {
//   httpResponse: {
//     status: 200,
//     statusText: "OK",
//     data: { ... }
//   }
// }

//     ↓

// STEP 9: Pass to Next Node
// ──────────────────────────
// Next node (e.g., Email node) can now access:
// - context.httpResponse.data.name
// - context.httpResponse.data.email
// - etc.
