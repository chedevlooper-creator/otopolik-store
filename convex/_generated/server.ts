// =============================================================
// OTO POLIK - Convex Generated Server (Gecici Tipler)
// =============================================================
// BU DOSYA `npx convex dev` veya `npx convex codegen` ile Convex CLI
// tarafindan otomatik uretilir ve uzerine yazilir.
// Bu placeholder surum, deployment baglanmadan TypeScript build'inin
// gecmesini saglamak icin minimal tanimlar sunar.
// =============================================================

type Handler<Ctx = any, Args = any, Result = any> = (
  ctx: Ctx,
  args: Args
) => Result | Promise<Result>;

type FunctionRegistration<Ctx = any, Args = any, Result = any> = {
  args?: unknown;
  handler: Handler<Ctx, Args, Result>;
};

function defineFunction<Ctx = any>() {
  return function <Args = any, Result = any>(
    registration: FunctionRegistration<Ctx, Args, Result>
  ) {
    return registration;
  };
}

export const query = defineFunction();
export const mutation = defineFunction();
export const internalQuery = defineFunction();
export const internalMutation = defineFunction();
export const action = defineFunction();
export const internalAction = defineFunction();
