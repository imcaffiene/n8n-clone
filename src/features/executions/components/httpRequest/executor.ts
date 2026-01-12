import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
  variableName?: string;
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

  if (!data.variableName) {
    throw new NonRetriableError("Variable name is not configured");
  }

  const result = await step.run("http-request", async () => {
    const endpoint = data.endPoint!;
    const method = data.method || "GET";

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = data.body;
      options.headers = {
        "Content-type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type");
    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const payload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName as string]: payload,
    };
  });

  return result;
};


















// ┌──────────────────────────────────────────────────────────────────────┐
// │        HTTP REQUEST NODE WITH VARIABLE NAMES - EXECUTION FLOW         │
// └──────────────────────────────────────────────────────────────────────┘

// STEP 1: Node Configuration (from React Flow)
// ────────────────────────────────────────────
// User configured node with:
// {
//   variableName: "userInfo",  ← NEW: User-defined name
//   endPoint: "https://jsonplaceholder.typicode.com/users/1",
//   method: "GET",
//   body: undefined
// }

//     ↓

// STEP 2: Executor Called
// ────────────────────────
// httpRequestExecutor({
//   data: {
//     variableName: "userInfo",
//     endPoint: "https://jsonplaceholder.typicode.com/users/1",
//     method: "GET"
//   },
//   nodeId: "node-2",
//   context: {},
//   step: inngestStepHelper
// })

//     ↓

// STEP 3: Validate Configuration
// ───────────────────────────────
// ✅ endPoint exists? YES
// ✅ variableName exists? YES  ← NEW validation
// Continue...

//     ↓

// STEP 4: Prepare Request
// ───────────────────────
// endpoint = "https://jsonplaceholder.typicode.com/users/1"
// method = "GET"
// options = { method: "GET" }

// Is method POST/PUT/PATCH? NO
// → Don't add body or headers

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

// STEP 7: Create Payload
// ───────────────────────
// payload = {
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

// STEP 8: Add to Context with Variable Name  ← NEW
// ────────────────────────────────────────────
// variableName = "userInfo"

// Return:
// {
//   ...context,
//   userInfo: {  ← Dynamic key from variableName
//     httpResponse: {
//       status: 200,
//       statusText: "OK",
//       data: { ... }
//     }
//   }
// }

//     ↓

// STEP 9: Return to Orchestrator
// ───────────────────────────────
// Orchestrator receives updated context:
// {
//   userInfo: {
//     httpResponse: {
//       status: 200,
//       statusText: "OK",
//       data: { ... }
//     }
//   }
// }

//     ↓

// STEP 10: Pass to Next Node
// ───────────────────────────
// Next node can access:
// - context.userInfo.httpResponse.data.name
// - context.userInfo.httpResponse.data.email
// - context.userInfo.httpResponse.status
