/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _types from "../_types.js";
import type * as cms from "../cms.js";
import type * as cmsSeedData from "../cmsSeedData.js";
import type * as defaults from "../defaults.js";
import type * as files from "../files.js";
import type * as lib_adminAuth from "../lib/adminAuth.js";
import type * as lib_validators from "../lib/validators.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as siteSettings from "../siteSettings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  _types: typeof _types;
  cms: typeof cms;
  cmsSeedData: typeof cmsSeedData;
  defaults: typeof defaults;
  files: typeof files;
  "lib/adminAuth": typeof lib_adminAuth;
  "lib/validators": typeof lib_validators;
  orders: typeof orders;
  products: typeof products;
  seed: typeof seed;
  seedData: typeof seedData;
  siteSettings: typeof siteSettings;
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
