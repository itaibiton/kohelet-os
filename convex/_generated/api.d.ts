/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents from "../agents.js";
import type * as cronJobs from "../cronJobs.js";
import type * as http from "../http.js";
import type * as memoryStore from "../memoryStore.js";
import type * as messages from "../messages.js";
import type * as seed from "../seed.js";
import type * as sessions from "../sessions.js";
import type * as standups from "../standups.js";
import type * as stats from "../stats.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agents: typeof agents;
  cronJobs: typeof cronJobs;
  http: typeof http;
  memoryStore: typeof memoryStore;
  messages: typeof messages;
  seed: typeof seed;
  sessions: typeof sessions;
  standups: typeof standups;
  stats: typeof stats;
  tasks: typeof tasks;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
