import { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

// Register custom Handlebars helper for JSON stringification
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endPoint: string;
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context, //data from prev node
  step,
  publish,
}) => {
  await publish(
    httpRequestChannel().status({
      nodeId: nodeId,
      status: "loading",
    })
  );

  if (!data.endPoint) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("HTTP request node: No endpoint configured");
  }

  if (!data.variableName) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Variable name is not configured");
  }

  if (!data.method) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw new NonRetriableError("Method is not configured");
  }

  if (["POST", "PUT", "PATCH"].includes(data.method) && !data.body) {
    throw new NonRetriableError(
      `Request body is required for ${data.method} requests. ` +
        `Please configure the request body in the node settings.`
    );
  }

  // EXECUTION: Make HTTP request with template rendering

  try {
    const result = await step.run("http-request", async () => {
      // Render endpoint URL template
      const endpoint = Handlebars.compile(data.endPoint)(context);
      const method = data.method;

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved);
        options.body = resolved;
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
        [data.variableName]: payload,
      };
    });

    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      })
    );

    return result;
  } catch (err) {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      })
    );
    throw err;
  }
};









































// ┌──────────────────────────────────────────────────────────────────────┐
// │        HTTP REQUEST NODE WITH VARIABLE NAMES - EXECUTION FLOW         │
// └──────────────────────────────────────────────────────────────────────┘

// STEP 1: Node Configuration (from React Flow)
// ────────────────────────────────────────────
// User configured node with:
// {
//   variableName: "apiResponse",     ← NEW: User-defined variable name
//   endPoint: "{{baseUrl}}/users/{{userId}}",  ← NEW: Template support
//   method: "GET",
//   body: undefined
// }

//     ↓

// STEP 2: Executor Called
// ────────────────────────
// httpRequestExecutor({
//   data: {
//     variableName: "apiResponse",
//     endPoint: "{{baseUrl}}/users/{{userId}}",
//     method: "GET"
//   },
//   nodeId: "node-2",
//   context: {                    ← Contains template variables
//     baseUrl: "https://api.example.com",
//     userId: "123"
//   },
//   step: inngestStepHelper
// })

//     ↓

// STEP 3: Validation Phase
// ────────────────────────
// ✅ endPoint exists? YES (after template resolution)
// ✅ variableName exists? YES
// ✅ method exists? YES
// ✅ POST/PUT/PATCH has body? N/A for GET
// All validations pass...

//     ↓

// STEP 4: Template Rendering & Request Preparation
// ──────────────────────────────────────────────────
// endpoint = Handlebars.compile("{{baseUrl}}/users/{{userId}}")({
//   baseUrl: "https://api.example.com",
//   userId: "123"
// })
// → endpoint = "https://api.example.com/users/123"

// method = "GET"
// options = { method: "GET" }

// Is method POST/PUT/PATCH? NO
// → Skip body processing

//     ↓

// STEP 5: Execute HTTP Request (Wrapped in Step)
// ──────────────────────────────────────────────
// await step.run("http-request", async () => {
//   const response = await ky("https://api.example.com/users/123", { method: "GET" });
//   return result;
// })

//     ↓ (Network call happens)

// Response received:
//   Status: 200 OK
//   Headers: { "content-type": "application/json; charset=utf-8" }
//   Body: {
//     "id": 123,
//     "name": "John Doe",
//     "email": "john@example.com"
//   }

//     ↓

// STEP 6: Response Processing & Content Type Detection
// ─────────────────────────────────────────────────────
// contentType = "application/json; charset=utf-8"
// contentType.includes("application/json")? YES
// → Use response.json()

// responseData = {
//   id: 123,
//   name: "John Doe",
//   email: "john@example.com"
// }

//     ↓

// STEP 7: Create Standardized Response Payload
// ──────────────────────────────────────────────
// payload = {
//   httpResponse: {
//     status: 200,
//     statusText: "OK",
//     data: {
//       id: 123,
//       name: "John Doe",
//       email: "john@example.com"
//     }
//   }
// }

//     ↓

// STEP 8: Dynamic Context Update with Variable Name
// ───────────────────────────────────────────────────
// variableName = "apiResponse"

// Return updated context:
// {
//   ...context,                 ← Preserve existing context
//   apiResponse: {              ← Dynamic key from user input
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
// Orchestrator receives:
// {
//   baseUrl: "https://api.example.com",
//   userId: "123",
//   apiResponse: {
//     httpResponse: {
//       status: 200,
//       statusText: "OK",
//       data: {
//         id: 123,
//         name: "John Doe",
//         email: "john@example.com"
//       }
//     }
//   }
// }

//     ↓

// STEP 10: Next Node Access Pattern
// ──────────────────────────────────
// Next node can now access:
// - context.apiResponse.httpResponse.data.name    ← Via user-defined variable
// - context.apiResponse.httpResponse.data.email
// - context.apiResponse.httpResponse.status
// - context.baseUrl                               ← From original context
// - context.userId                                ← From original context

// ┌──────────────────────────────────────────────────────────────────────┐
// │                        ERROR HANDLING FLOW                           │
// └──────────────────────────────────────────────────────────────────────┘

// For POST/PUT/PATCH requests without body:
// If data.method = "POST" and !data.body:
// → Throws: "Request body is required for POST requests..."

// For missing required fields:
// If !data.variableName → "Variable name is not configured"
// If !data.endPoint → "HTTP request node: No endpoint configured"
// If !data.method → "Method is not configured"

// For malformed JSON in body:
// During body compilation and JSON.parse(resolved):
// → Will throw parsing error if template renders invalid JSON

// ┌──────────────────────────────────────────────────────────────────────┐
// │                      TEMPLATE RENDERING EXAMPLE                      │
// └──────────────────────────────────────────────────────────────────────┘

// Original template: "{{baseUrl}}/users/{{userId}}"
// Context: { baseUrl: "https://api.com", userId: 123 }
// Result: "https://api.com/users/123"

// For POST body template: "{{#json userData}}{{/json}}"
// Context: { userData: { name: "John", age: 30 } }
// Result: "{\n  \"name\": \"John\",\n  \"age\": 30\n}"
