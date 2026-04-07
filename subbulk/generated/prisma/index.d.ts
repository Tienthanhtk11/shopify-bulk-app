
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Merchant
 * 
 */
export type Merchant = $Result.DefaultSelection<Prisma.$MerchantPayload>
/**
 * Model MerchantPlan
 * 
 */
export type MerchantPlan = $Result.DefaultSelection<Prisma.$MerchantPlanPayload>
/**
 * Model MerchantEvent
 * 
 */
export type MerchantEvent = $Result.DefaultSelection<Prisma.$MerchantEventPayload>
/**
 * Model MerchantDataDeletionRequest
 * 
 */
export type MerchantDataDeletionRequest = $Result.DefaultSelection<Prisma.$MerchantDataDeletionRequestPayload>
/**
 * Model AdminPlanDefinition
 * 
 */
export type AdminPlanDefinition = $Result.DefaultSelection<Prisma.$AdminPlanDefinitionPayload>
/**
 * Model InternalAdminAccount
 * 
 */
export type InternalAdminAccount = $Result.DefaultSelection<Prisma.$InternalAdminAccountPayload>
/**
 * Model SubscriptionRule
 * Một rule subscribe chung (kiểu Seal): một selling plan group trên Shopify gắn nhiều sản phẩm.
 */
export type SubscriptionRule = $Result.DefaultSelection<Prisma.$SubscriptionRulePayload>
/**
 * Model SubscriptionOffer
 * Gói subscribe gắn 1 product + selling plan group trên Shopify.
 */
export type SubscriptionOffer = $Result.DefaultSelection<Prisma.$SubscriptionOfferPayload>
/**
 * Model WidgetSettings
 * Tuỳ biến copy/màu widget (đọc từ storefront qua metafield shop hoặc API — phase 1 lưu DB).
 */
export type WidgetSettings = $Result.DefaultSelection<Prisma.$WidgetSettingsPayload>
/**
 * Model WidgetEnabledProduct
 * Sản phẩm được phép hiển thị widget (đồng bộ metafield app.subbulk_widget_enabled).
 */
export type WidgetEnabledProduct = $Result.DefaultSelection<Prisma.$WidgetEnabledProductPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Sessions
 * const sessions = await prisma.session.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Sessions
   * const sessions = await prisma.session.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.merchant`: Exposes CRUD operations for the **Merchant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Merchants
    * const merchants = await prisma.merchant.findMany()
    * ```
    */
  get merchant(): Prisma.MerchantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.merchantPlan`: Exposes CRUD operations for the **MerchantPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MerchantPlans
    * const merchantPlans = await prisma.merchantPlan.findMany()
    * ```
    */
  get merchantPlan(): Prisma.MerchantPlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.merchantEvent`: Exposes CRUD operations for the **MerchantEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MerchantEvents
    * const merchantEvents = await prisma.merchantEvent.findMany()
    * ```
    */
  get merchantEvent(): Prisma.MerchantEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.merchantDataDeletionRequest`: Exposes CRUD operations for the **MerchantDataDeletionRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MerchantDataDeletionRequests
    * const merchantDataDeletionRequests = await prisma.merchantDataDeletionRequest.findMany()
    * ```
    */
  get merchantDataDeletionRequest(): Prisma.MerchantDataDeletionRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminPlanDefinition`: Exposes CRUD operations for the **AdminPlanDefinition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminPlanDefinitions
    * const adminPlanDefinitions = await prisma.adminPlanDefinition.findMany()
    * ```
    */
  get adminPlanDefinition(): Prisma.AdminPlanDefinitionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.internalAdminAccount`: Exposes CRUD operations for the **InternalAdminAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InternalAdminAccounts
    * const internalAdminAccounts = await prisma.internalAdminAccount.findMany()
    * ```
    */
  get internalAdminAccount(): Prisma.InternalAdminAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionRule`: Exposes CRUD operations for the **SubscriptionRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionRules
    * const subscriptionRules = await prisma.subscriptionRule.findMany()
    * ```
    */
  get subscriptionRule(): Prisma.SubscriptionRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscriptionOffer`: Exposes CRUD operations for the **SubscriptionOffer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubscriptionOffers
    * const subscriptionOffers = await prisma.subscriptionOffer.findMany()
    * ```
    */
  get subscriptionOffer(): Prisma.SubscriptionOfferDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.widgetSettings`: Exposes CRUD operations for the **WidgetSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WidgetSettings
    * const widgetSettings = await prisma.widgetSettings.findMany()
    * ```
    */
  get widgetSettings(): Prisma.WidgetSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.widgetEnabledProduct`: Exposes CRUD operations for the **WidgetEnabledProduct** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WidgetEnabledProducts
    * const widgetEnabledProducts = await prisma.widgetEnabledProduct.findMany()
    * ```
    */
  get widgetEnabledProduct(): Prisma.WidgetEnabledProductDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Session: 'Session',
    Merchant: 'Merchant',
    MerchantPlan: 'MerchantPlan',
    MerchantEvent: 'MerchantEvent',
    MerchantDataDeletionRequest: 'MerchantDataDeletionRequest',
    AdminPlanDefinition: 'AdminPlanDefinition',
    InternalAdminAccount: 'InternalAdminAccount',
    SubscriptionRule: 'SubscriptionRule',
    SubscriptionOffer: 'SubscriptionOffer',
    WidgetSettings: 'WidgetSettings',
    WidgetEnabledProduct: 'WidgetEnabledProduct'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "session" | "merchant" | "merchantPlan" | "merchantEvent" | "merchantDataDeletionRequest" | "adminPlanDefinition" | "internalAdminAccount" | "subscriptionRule" | "subscriptionOffer" | "widgetSettings" | "widgetEnabledProduct"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Merchant: {
        payload: Prisma.$MerchantPayload<ExtArgs>
        fields: Prisma.MerchantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          findFirst: {
            args: Prisma.MerchantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          findMany: {
            args: Prisma.MerchantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>[]
          }
          create: {
            args: Prisma.MerchantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          createMany: {
            args: Prisma.MerchantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>[]
          }
          delete: {
            args: Prisma.MerchantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          update: {
            args: Prisma.MerchantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          deleteMany: {
            args: Prisma.MerchantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MerchantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>[]
          }
          upsert: {
            args: Prisma.MerchantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPayload>
          }
          aggregate: {
            args: Prisma.MerchantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchant>
          }
          groupBy: {
            args: Prisma.MerchantGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchantGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchantCountArgs<ExtArgs>
            result: $Utils.Optional<MerchantCountAggregateOutputType> | number
          }
        }
      }
      MerchantPlan: {
        payload: Prisma.$MerchantPlanPayload<ExtArgs>
        fields: Prisma.MerchantPlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchantPlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchantPlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          findFirst: {
            args: Prisma.MerchantPlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchantPlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          findMany: {
            args: Prisma.MerchantPlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>[]
          }
          create: {
            args: Prisma.MerchantPlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          createMany: {
            args: Prisma.MerchantPlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchantPlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>[]
          }
          delete: {
            args: Prisma.MerchantPlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          update: {
            args: Prisma.MerchantPlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          deleteMany: {
            args: Prisma.MerchantPlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchantPlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MerchantPlanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>[]
          }
          upsert: {
            args: Prisma.MerchantPlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantPlanPayload>
          }
          aggregate: {
            args: Prisma.MerchantPlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchantPlan>
          }
          groupBy: {
            args: Prisma.MerchantPlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchantPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchantPlanCountArgs<ExtArgs>
            result: $Utils.Optional<MerchantPlanCountAggregateOutputType> | number
          }
        }
      }
      MerchantEvent: {
        payload: Prisma.$MerchantEventPayload<ExtArgs>
        fields: Prisma.MerchantEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchantEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchantEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          findFirst: {
            args: Prisma.MerchantEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchantEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          findMany: {
            args: Prisma.MerchantEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>[]
          }
          create: {
            args: Prisma.MerchantEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          createMany: {
            args: Prisma.MerchantEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchantEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>[]
          }
          delete: {
            args: Prisma.MerchantEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          update: {
            args: Prisma.MerchantEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          deleteMany: {
            args: Prisma.MerchantEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchantEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MerchantEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>[]
          }
          upsert: {
            args: Prisma.MerchantEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantEventPayload>
          }
          aggregate: {
            args: Prisma.MerchantEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchantEvent>
          }
          groupBy: {
            args: Prisma.MerchantEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchantEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchantEventCountArgs<ExtArgs>
            result: $Utils.Optional<MerchantEventCountAggregateOutputType> | number
          }
        }
      }
      MerchantDataDeletionRequest: {
        payload: Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>
        fields: Prisma.MerchantDataDeletionRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MerchantDataDeletionRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MerchantDataDeletionRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          findFirst: {
            args: Prisma.MerchantDataDeletionRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MerchantDataDeletionRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          findMany: {
            args: Prisma.MerchantDataDeletionRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>[]
          }
          create: {
            args: Prisma.MerchantDataDeletionRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          createMany: {
            args: Prisma.MerchantDataDeletionRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MerchantDataDeletionRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>[]
          }
          delete: {
            args: Prisma.MerchantDataDeletionRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          update: {
            args: Prisma.MerchantDataDeletionRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          deleteMany: {
            args: Prisma.MerchantDataDeletionRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MerchantDataDeletionRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MerchantDataDeletionRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>[]
          }
          upsert: {
            args: Prisma.MerchantDataDeletionRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MerchantDataDeletionRequestPayload>
          }
          aggregate: {
            args: Prisma.MerchantDataDeletionRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMerchantDataDeletionRequest>
          }
          groupBy: {
            args: Prisma.MerchantDataDeletionRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<MerchantDataDeletionRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.MerchantDataDeletionRequestCountArgs<ExtArgs>
            result: $Utils.Optional<MerchantDataDeletionRequestCountAggregateOutputType> | number
          }
        }
      }
      AdminPlanDefinition: {
        payload: Prisma.$AdminPlanDefinitionPayload<ExtArgs>
        fields: Prisma.AdminPlanDefinitionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminPlanDefinitionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminPlanDefinitionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          findFirst: {
            args: Prisma.AdminPlanDefinitionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminPlanDefinitionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          findMany: {
            args: Prisma.AdminPlanDefinitionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>[]
          }
          create: {
            args: Prisma.AdminPlanDefinitionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          createMany: {
            args: Prisma.AdminPlanDefinitionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminPlanDefinitionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>[]
          }
          delete: {
            args: Prisma.AdminPlanDefinitionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          update: {
            args: Prisma.AdminPlanDefinitionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          deleteMany: {
            args: Prisma.AdminPlanDefinitionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminPlanDefinitionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminPlanDefinitionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>[]
          }
          upsert: {
            args: Prisma.AdminPlanDefinitionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPlanDefinitionPayload>
          }
          aggregate: {
            args: Prisma.AdminPlanDefinitionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminPlanDefinition>
          }
          groupBy: {
            args: Prisma.AdminPlanDefinitionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminPlanDefinitionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminPlanDefinitionCountArgs<ExtArgs>
            result: $Utils.Optional<AdminPlanDefinitionCountAggregateOutputType> | number
          }
        }
      }
      InternalAdminAccount: {
        payload: Prisma.$InternalAdminAccountPayload<ExtArgs>
        fields: Prisma.InternalAdminAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InternalAdminAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InternalAdminAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          findFirst: {
            args: Prisma.InternalAdminAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InternalAdminAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          findMany: {
            args: Prisma.InternalAdminAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>[]
          }
          create: {
            args: Prisma.InternalAdminAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          createMany: {
            args: Prisma.InternalAdminAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InternalAdminAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>[]
          }
          delete: {
            args: Prisma.InternalAdminAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          update: {
            args: Prisma.InternalAdminAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          deleteMany: {
            args: Prisma.InternalAdminAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InternalAdminAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InternalAdminAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>[]
          }
          upsert: {
            args: Prisma.InternalAdminAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InternalAdminAccountPayload>
          }
          aggregate: {
            args: Prisma.InternalAdminAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInternalAdminAccount>
          }
          groupBy: {
            args: Prisma.InternalAdminAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<InternalAdminAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.InternalAdminAccountCountArgs<ExtArgs>
            result: $Utils.Optional<InternalAdminAccountCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionRule: {
        payload: Prisma.$SubscriptionRulePayload<ExtArgs>
        fields: Prisma.SubscriptionRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          findFirst: {
            args: Prisma.SubscriptionRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          findMany: {
            args: Prisma.SubscriptionRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>[]
          }
          create: {
            args: Prisma.SubscriptionRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          createMany: {
            args: Prisma.SubscriptionRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>[]
          }
          delete: {
            args: Prisma.SubscriptionRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          update: {
            args: Prisma.SubscriptionRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionRulePayload>
          }
          aggregate: {
            args: Prisma.SubscriptionRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionRule>
          }
          groupBy: {
            args: Prisma.SubscriptionRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionRuleCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionRuleCountAggregateOutputType> | number
          }
        }
      }
      SubscriptionOffer: {
        payload: Prisma.$SubscriptionOfferPayload<ExtArgs>
        fields: Prisma.SubscriptionOfferFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionOfferFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionOfferFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionOfferFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionOfferFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          findMany: {
            args: Prisma.SubscriptionOfferFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>[]
          }
          create: {
            args: Prisma.SubscriptionOfferCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          createMany: {
            args: Prisma.SubscriptionOfferCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionOfferCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionOfferDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          update: {
            args: Prisma.SubscriptionOfferUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionOfferDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionOfferUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionOfferUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionOfferUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionOfferPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionOfferAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscriptionOffer>
          }
          groupBy: {
            args: Prisma.SubscriptionOfferGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionOfferGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionOfferCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionOfferCountAggregateOutputType> | number
          }
        }
      }
      WidgetSettings: {
        payload: Prisma.$WidgetSettingsPayload<ExtArgs>
        fields: Prisma.WidgetSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WidgetSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WidgetSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          findFirst: {
            args: Prisma.WidgetSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WidgetSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          findMany: {
            args: Prisma.WidgetSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>[]
          }
          create: {
            args: Prisma.WidgetSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          createMany: {
            args: Prisma.WidgetSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WidgetSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>[]
          }
          delete: {
            args: Prisma.WidgetSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          update: {
            args: Prisma.WidgetSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          deleteMany: {
            args: Prisma.WidgetSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WidgetSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WidgetSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>[]
          }
          upsert: {
            args: Prisma.WidgetSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetSettingsPayload>
          }
          aggregate: {
            args: Prisma.WidgetSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWidgetSettings>
          }
          groupBy: {
            args: Prisma.WidgetSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<WidgetSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.WidgetSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<WidgetSettingsCountAggregateOutputType> | number
          }
        }
      }
      WidgetEnabledProduct: {
        payload: Prisma.$WidgetEnabledProductPayload<ExtArgs>
        fields: Prisma.WidgetEnabledProductFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WidgetEnabledProductFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WidgetEnabledProductFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          findFirst: {
            args: Prisma.WidgetEnabledProductFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WidgetEnabledProductFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          findMany: {
            args: Prisma.WidgetEnabledProductFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>[]
          }
          create: {
            args: Prisma.WidgetEnabledProductCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          createMany: {
            args: Prisma.WidgetEnabledProductCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WidgetEnabledProductCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>[]
          }
          delete: {
            args: Prisma.WidgetEnabledProductDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          update: {
            args: Prisma.WidgetEnabledProductUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          deleteMany: {
            args: Prisma.WidgetEnabledProductDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WidgetEnabledProductUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WidgetEnabledProductUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>[]
          }
          upsert: {
            args: Prisma.WidgetEnabledProductUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WidgetEnabledProductPayload>
          }
          aggregate: {
            args: Prisma.WidgetEnabledProductAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWidgetEnabledProduct>
          }
          groupBy: {
            args: Prisma.WidgetEnabledProductGroupByArgs<ExtArgs>
            result: $Utils.Optional<WidgetEnabledProductGroupByOutputType>[]
          }
          count: {
            args: Prisma.WidgetEnabledProductCountArgs<ExtArgs>
            result: $Utils.Optional<WidgetEnabledProductCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    session?: SessionOmit
    merchant?: MerchantOmit
    merchantPlan?: MerchantPlanOmit
    merchantEvent?: MerchantEventOmit
    merchantDataDeletionRequest?: MerchantDataDeletionRequestOmit
    adminPlanDefinition?: AdminPlanDefinitionOmit
    internalAdminAccount?: InternalAdminAccountOmit
    subscriptionRule?: SubscriptionRuleOmit
    subscriptionOffer?: SubscriptionOfferOmit
    widgetSettings?: WidgetSettingsOmit
    widgetEnabledProduct?: WidgetEnabledProductOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MerchantCountOutputType
   */

  export type MerchantCountOutputType = {
    plans: number
    events: number
    deletionRequests: number
  }

  export type MerchantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | MerchantCountOutputTypeCountPlansArgs
    events?: boolean | MerchantCountOutputTypeCountEventsArgs
    deletionRequests?: boolean | MerchantCountOutputTypeCountDeletionRequestsArgs
  }

  // Custom InputTypes
  /**
   * MerchantCountOutputType without action
   */
  export type MerchantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantCountOutputType
     */
    select?: MerchantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MerchantCountOutputType without action
   */
  export type MerchantCountOutputTypeCountPlansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantPlanWhereInput
  }

  /**
   * MerchantCountOutputType without action
   */
  export type MerchantCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantEventWhereInput
  }

  /**
   * MerchantCountOutputType without action
   */
  export type MerchantCountOutputTypeCountDeletionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantDataDeletionRequestWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionAvgAggregateOutputType = {
    userId: number | null
  }

  export type SessionSumAggregateOutputType = {
    userId: bigint | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    shop: string | null
    state: string | null
    isOnline: boolean | null
    scope: string | null
    expires: Date | null
    accessToken: string | null
    userId: bigint | null
    firstName: string | null
    lastName: string | null
    email: string | null
    accountOwner: boolean | null
    locale: string | null
    collaborator: boolean | null
    emailVerified: boolean | null
    refreshToken: string | null
    refreshTokenExpires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    shop: string | null
    state: string | null
    isOnline: boolean | null
    scope: string | null
    expires: Date | null
    accessToken: string | null
    userId: bigint | null
    firstName: string | null
    lastName: string | null
    email: string | null
    accountOwner: boolean | null
    locale: string | null
    collaborator: boolean | null
    emailVerified: boolean | null
    refreshToken: string | null
    refreshTokenExpires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    shop: number
    state: number
    isOnline: number
    scope: number
    expires: number
    accessToken: number
    userId: number
    firstName: number
    lastName: number
    email: number
    accountOwner: number
    locale: number
    collaborator: number
    emailVerified: number
    refreshToken: number
    refreshTokenExpires: number
    _all: number
  }


  export type SessionAvgAggregateInputType = {
    userId?: true
  }

  export type SessionSumAggregateInputType = {
    userId?: true
  }

  export type SessionMinAggregateInputType = {
    id?: true
    shop?: true
    state?: true
    isOnline?: true
    scope?: true
    expires?: true
    accessToken?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    accountOwner?: true
    locale?: true
    collaborator?: true
    emailVerified?: true
    refreshToken?: true
    refreshTokenExpires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    shop?: true
    state?: true
    isOnline?: true
    scope?: true
    expires?: true
    accessToken?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    accountOwner?: true
    locale?: true
    collaborator?: true
    emailVerified?: true
    refreshToken?: true
    refreshTokenExpires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    shop?: true
    state?: true
    isOnline?: true
    scope?: true
    expires?: true
    accessToken?: true
    userId?: true
    firstName?: true
    lastName?: true
    email?: true
    accountOwner?: true
    locale?: true
    collaborator?: true
    emailVerified?: true
    refreshToken?: true
    refreshTokenExpires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _avg?: SessionAvgAggregateInputType
    _sum?: SessionSumAggregateInputType
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    shop: string
    state: string
    isOnline: boolean
    scope: string | null
    expires: Date | null
    accessToken: string
    userId: bigint | null
    firstName: string | null
    lastName: string | null
    email: string | null
    accountOwner: boolean
    locale: string | null
    collaborator: boolean | null
    emailVerified: boolean | null
    refreshToken: string | null
    refreshTokenExpires: Date | null
    _count: SessionCountAggregateOutputType | null
    _avg: SessionAvgAggregateOutputType | null
    _sum: SessionSumAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    state?: boolean
    isOnline?: boolean
    scope?: boolean
    expires?: boolean
    accessToken?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    accountOwner?: boolean
    locale?: boolean
    collaborator?: boolean
    emailVerified?: boolean
    refreshToken?: boolean
    refreshTokenExpires?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    state?: boolean
    isOnline?: boolean
    scope?: boolean
    expires?: boolean
    accessToken?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    accountOwner?: boolean
    locale?: boolean
    collaborator?: boolean
    emailVerified?: boolean
    refreshToken?: boolean
    refreshTokenExpires?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    state?: boolean
    isOnline?: boolean
    scope?: boolean
    expires?: boolean
    accessToken?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    accountOwner?: boolean
    locale?: boolean
    collaborator?: boolean
    emailVerified?: boolean
    refreshToken?: boolean
    refreshTokenExpires?: boolean
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    shop?: boolean
    state?: boolean
    isOnline?: boolean
    scope?: boolean
    expires?: boolean
    accessToken?: boolean
    userId?: boolean
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    accountOwner?: boolean
    locale?: boolean
    collaborator?: boolean
    emailVerified?: boolean
    refreshToken?: boolean
    refreshTokenExpires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shop" | "state" | "isOnline" | "scope" | "expires" | "accessToken" | "userId" | "firstName" | "lastName" | "email" | "accountOwner" | "locale" | "collaborator" | "emailVerified" | "refreshToken" | "refreshTokenExpires", ExtArgs["result"]["session"]>

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shop: string
      state: string
      isOnline: boolean
      scope: string | null
      expires: Date | null
      accessToken: string
      userId: bigint | null
      firstName: string | null
      lastName: string | null
      email: string | null
      accountOwner: boolean
      locale: string | null
      collaborator: boolean | null
      emailVerified: boolean | null
      refreshToken: string | null
      refreshTokenExpires: Date | null
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly shop: FieldRef<"Session", 'String'>
    readonly state: FieldRef<"Session", 'String'>
    readonly isOnline: FieldRef<"Session", 'Boolean'>
    readonly scope: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly accessToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'BigInt'>
    readonly firstName: FieldRef<"Session", 'String'>
    readonly lastName: FieldRef<"Session", 'String'>
    readonly email: FieldRef<"Session", 'String'>
    readonly accountOwner: FieldRef<"Session", 'Boolean'>
    readonly locale: FieldRef<"Session", 'String'>
    readonly collaborator: FieldRef<"Session", 'Boolean'>
    readonly emailVerified: FieldRef<"Session", 'Boolean'>
    readonly refreshToken: FieldRef<"Session", 'String'>
    readonly refreshTokenExpires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
  }


  /**
   * Model Merchant
   */

  export type AggregateMerchant = {
    _count: MerchantCountAggregateOutputType | null
    _min: MerchantMinAggregateOutputType | null
    _max: MerchantMaxAggregateOutputType | null
  }

  export type MerchantMinAggregateOutputType = {
    id: string | null
    shopDomain: string | null
    shopGid: string | null
    shopName: string | null
    email: string | null
    countryCode: string | null
    currencyCode: string | null
    timezone: string | null
    status: string | null
    installedAt: Date | null
    uninstalledAt: Date | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantMaxAggregateOutputType = {
    id: string | null
    shopDomain: string | null
    shopGid: string | null
    shopName: string | null
    email: string | null
    countryCode: string | null
    currencyCode: string | null
    timezone: string | null
    status: string | null
    installedAt: Date | null
    uninstalledAt: Date | null
    lastSeenAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantCountAggregateOutputType = {
    id: number
    shopDomain: number
    shopGid: number
    shopName: number
    email: number
    countryCode: number
    currencyCode: number
    timezone: number
    status: number
    installedAt: number
    uninstalledAt: number
    lastSeenAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MerchantMinAggregateInputType = {
    id?: true
    shopDomain?: true
    shopGid?: true
    shopName?: true
    email?: true
    countryCode?: true
    currencyCode?: true
    timezone?: true
    status?: true
    installedAt?: true
    uninstalledAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantMaxAggregateInputType = {
    id?: true
    shopDomain?: true
    shopGid?: true
    shopName?: true
    email?: true
    countryCode?: true
    currencyCode?: true
    timezone?: true
    status?: true
    installedAt?: true
    uninstalledAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantCountAggregateInputType = {
    id?: true
    shopDomain?: true
    shopGid?: true
    shopName?: true
    email?: true
    countryCode?: true
    currencyCode?: true
    timezone?: true
    status?: true
    installedAt?: true
    uninstalledAt?: true
    lastSeenAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MerchantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Merchant to aggregate.
     */
    where?: MerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Merchants to fetch.
     */
    orderBy?: MerchantOrderByWithRelationInput | MerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Merchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Merchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Merchants
    **/
    _count?: true | MerchantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchantMaxAggregateInputType
  }

  export type GetMerchantAggregateType<T extends MerchantAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchant[P]>
      : GetScalarType<T[P], AggregateMerchant[P]>
  }




  export type MerchantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantWhereInput
    orderBy?: MerchantOrderByWithAggregationInput | MerchantOrderByWithAggregationInput[]
    by: MerchantScalarFieldEnum[] | MerchantScalarFieldEnum
    having?: MerchantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchantCountAggregateInputType | true
    _min?: MerchantMinAggregateInputType
    _max?: MerchantMaxAggregateInputType
  }

  export type MerchantGroupByOutputType = {
    id: string
    shopDomain: string
    shopGid: string | null
    shopName: string | null
    email: string | null
    countryCode: string | null
    currencyCode: string | null
    timezone: string | null
    status: string
    installedAt: Date
    uninstalledAt: Date | null
    lastSeenAt: Date
    createdAt: Date
    updatedAt: Date
    _count: MerchantCountAggregateOutputType | null
    _min: MerchantMinAggregateOutputType | null
    _max: MerchantMaxAggregateOutputType | null
  }

  type GetMerchantGroupByPayload<T extends MerchantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchantGroupByOutputType[P]>
            : GetScalarType<T[P], MerchantGroupByOutputType[P]>
        }
      >
    >


  export type MerchantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shopDomain?: boolean
    shopGid?: boolean
    shopName?: boolean
    email?: boolean
    countryCode?: boolean
    currencyCode?: boolean
    timezone?: boolean
    status?: boolean
    installedAt?: boolean
    uninstalledAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    plans?: boolean | Merchant$plansArgs<ExtArgs>
    events?: boolean | Merchant$eventsArgs<ExtArgs>
    deletionRequests?: boolean | Merchant$deletionRequestsArgs<ExtArgs>
    _count?: boolean | MerchantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchant"]>

  export type MerchantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shopDomain?: boolean
    shopGid?: boolean
    shopName?: boolean
    email?: boolean
    countryCode?: boolean
    currencyCode?: boolean
    timezone?: boolean
    status?: boolean
    installedAt?: boolean
    uninstalledAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["merchant"]>

  export type MerchantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shopDomain?: boolean
    shopGid?: boolean
    shopName?: boolean
    email?: boolean
    countryCode?: boolean
    currencyCode?: boolean
    timezone?: boolean
    status?: boolean
    installedAt?: boolean
    uninstalledAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["merchant"]>

  export type MerchantSelectScalar = {
    id?: boolean
    shopDomain?: boolean
    shopGid?: boolean
    shopName?: boolean
    email?: boolean
    countryCode?: boolean
    currencyCode?: boolean
    timezone?: boolean
    status?: boolean
    installedAt?: boolean
    uninstalledAt?: boolean
    lastSeenAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MerchantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shopDomain" | "shopGid" | "shopName" | "email" | "countryCode" | "currencyCode" | "timezone" | "status" | "installedAt" | "uninstalledAt" | "lastSeenAt" | "createdAt" | "updatedAt", ExtArgs["result"]["merchant"]>
  export type MerchantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plans?: boolean | Merchant$plansArgs<ExtArgs>
    events?: boolean | Merchant$eventsArgs<ExtArgs>
    deletionRequests?: boolean | Merchant$deletionRequestsArgs<ExtArgs>
    _count?: boolean | MerchantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MerchantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MerchantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MerchantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Merchant"
    objects: {
      plans: Prisma.$MerchantPlanPayload<ExtArgs>[]
      events: Prisma.$MerchantEventPayload<ExtArgs>[]
      deletionRequests: Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shopDomain: string
      shopGid: string | null
      shopName: string | null
      email: string | null
      countryCode: string | null
      currencyCode: string | null
      timezone: string | null
      status: string
      installedAt: Date
      uninstalledAt: Date | null
      lastSeenAt: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["merchant"]>
    composites: {}
  }

  type MerchantGetPayload<S extends boolean | null | undefined | MerchantDefaultArgs> = $Result.GetResult<Prisma.$MerchantPayload, S>

  type MerchantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MerchantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MerchantCountAggregateInputType | true
    }

  export interface MerchantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Merchant'], meta: { name: 'Merchant' } }
    /**
     * Find zero or one Merchant that matches the filter.
     * @param {MerchantFindUniqueArgs} args - Arguments to find a Merchant
     * @example
     * // Get one Merchant
     * const merchant = await prisma.merchant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchantFindUniqueArgs>(args: SelectSubset<T, MerchantFindUniqueArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Merchant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MerchantFindUniqueOrThrowArgs} args - Arguments to find a Merchant
     * @example
     * // Get one Merchant
     * const merchant = await prisma.merchant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchantFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Merchant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantFindFirstArgs} args - Arguments to find a Merchant
     * @example
     * // Get one Merchant
     * const merchant = await prisma.merchant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchantFindFirstArgs>(args?: SelectSubset<T, MerchantFindFirstArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Merchant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantFindFirstOrThrowArgs} args - Arguments to find a Merchant
     * @example
     * // Get one Merchant
     * const merchant = await prisma.merchant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchantFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchantFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Merchants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Merchants
     * const merchants = await prisma.merchant.findMany()
     * 
     * // Get first 10 Merchants
     * const merchants = await prisma.merchant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchantWithIdOnly = await prisma.merchant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchantFindManyArgs>(args?: SelectSubset<T, MerchantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Merchant.
     * @param {MerchantCreateArgs} args - Arguments to create a Merchant.
     * @example
     * // Create one Merchant
     * const Merchant = await prisma.merchant.create({
     *   data: {
     *     // ... data to create a Merchant
     *   }
     * })
     * 
     */
    create<T extends MerchantCreateArgs>(args: SelectSubset<T, MerchantCreateArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Merchants.
     * @param {MerchantCreateManyArgs} args - Arguments to create many Merchants.
     * @example
     * // Create many Merchants
     * const merchant = await prisma.merchant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchantCreateManyArgs>(args?: SelectSubset<T, MerchantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Merchants and returns the data saved in the database.
     * @param {MerchantCreateManyAndReturnArgs} args - Arguments to create many Merchants.
     * @example
     * // Create many Merchants
     * const merchant = await prisma.merchant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Merchants and only return the `id`
     * const merchantWithIdOnly = await prisma.merchant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchantCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Merchant.
     * @param {MerchantDeleteArgs} args - Arguments to delete one Merchant.
     * @example
     * // Delete one Merchant
     * const Merchant = await prisma.merchant.delete({
     *   where: {
     *     // ... filter to delete one Merchant
     *   }
     * })
     * 
     */
    delete<T extends MerchantDeleteArgs>(args: SelectSubset<T, MerchantDeleteArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Merchant.
     * @param {MerchantUpdateArgs} args - Arguments to update one Merchant.
     * @example
     * // Update one Merchant
     * const merchant = await prisma.merchant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchantUpdateArgs>(args: SelectSubset<T, MerchantUpdateArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Merchants.
     * @param {MerchantDeleteManyArgs} args - Arguments to filter Merchants to delete.
     * @example
     * // Delete a few Merchants
     * const { count } = await prisma.merchant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchantDeleteManyArgs>(args?: SelectSubset<T, MerchantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Merchants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Merchants
     * const merchant = await prisma.merchant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchantUpdateManyArgs>(args: SelectSubset<T, MerchantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Merchants and returns the data updated in the database.
     * @param {MerchantUpdateManyAndReturnArgs} args - Arguments to update many Merchants.
     * @example
     * // Update many Merchants
     * const merchant = await prisma.merchant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Merchants and only return the `id`
     * const merchantWithIdOnly = await prisma.merchant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MerchantUpdateManyAndReturnArgs>(args: SelectSubset<T, MerchantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Merchant.
     * @param {MerchantUpsertArgs} args - Arguments to update or create a Merchant.
     * @example
     * // Update or create a Merchant
     * const merchant = await prisma.merchant.upsert({
     *   create: {
     *     // ... data to create a Merchant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Merchant we want to update
     *   }
     * })
     */
    upsert<T extends MerchantUpsertArgs>(args: SelectSubset<T, MerchantUpsertArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Merchants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantCountArgs} args - Arguments to filter Merchants to count.
     * @example
     * // Count the number of Merchants
     * const count = await prisma.merchant.count({
     *   where: {
     *     // ... the filter for the Merchants we want to count
     *   }
     * })
    **/
    count<T extends MerchantCountArgs>(
      args?: Subset<T, MerchantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Merchant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchantAggregateArgs>(args: Subset<T, MerchantAggregateArgs>): Prisma.PrismaPromise<GetMerchantAggregateType<T>>

    /**
     * Group by Merchant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchantGroupByArgs['orderBy'] }
        : { orderBy?: MerchantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Merchant model
   */
  readonly fields: MerchantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Merchant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    plans<T extends Merchant$plansArgs<ExtArgs> = {}>(args?: Subset<T, Merchant$plansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Merchant$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Merchant$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deletionRequests<T extends Merchant$deletionRequestsArgs<ExtArgs> = {}>(args?: Subset<T, Merchant$deletionRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Merchant model
   */
  interface MerchantFieldRefs {
    readonly id: FieldRef<"Merchant", 'String'>
    readonly shopDomain: FieldRef<"Merchant", 'String'>
    readonly shopGid: FieldRef<"Merchant", 'String'>
    readonly shopName: FieldRef<"Merchant", 'String'>
    readonly email: FieldRef<"Merchant", 'String'>
    readonly countryCode: FieldRef<"Merchant", 'String'>
    readonly currencyCode: FieldRef<"Merchant", 'String'>
    readonly timezone: FieldRef<"Merchant", 'String'>
    readonly status: FieldRef<"Merchant", 'String'>
    readonly installedAt: FieldRef<"Merchant", 'DateTime'>
    readonly uninstalledAt: FieldRef<"Merchant", 'DateTime'>
    readonly lastSeenAt: FieldRef<"Merchant", 'DateTime'>
    readonly createdAt: FieldRef<"Merchant", 'DateTime'>
    readonly updatedAt: FieldRef<"Merchant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Merchant findUnique
   */
  export type MerchantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter, which Merchant to fetch.
     */
    where: MerchantWhereUniqueInput
  }

  /**
   * Merchant findUniqueOrThrow
   */
  export type MerchantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter, which Merchant to fetch.
     */
    where: MerchantWhereUniqueInput
  }

  /**
   * Merchant findFirst
   */
  export type MerchantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter, which Merchant to fetch.
     */
    where?: MerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Merchants to fetch.
     */
    orderBy?: MerchantOrderByWithRelationInput | MerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Merchants.
     */
    cursor?: MerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Merchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Merchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Merchants.
     */
    distinct?: MerchantScalarFieldEnum | MerchantScalarFieldEnum[]
  }

  /**
   * Merchant findFirstOrThrow
   */
  export type MerchantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter, which Merchant to fetch.
     */
    where?: MerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Merchants to fetch.
     */
    orderBy?: MerchantOrderByWithRelationInput | MerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Merchants.
     */
    cursor?: MerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Merchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Merchants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Merchants.
     */
    distinct?: MerchantScalarFieldEnum | MerchantScalarFieldEnum[]
  }

  /**
   * Merchant findMany
   */
  export type MerchantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter, which Merchants to fetch.
     */
    where?: MerchantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Merchants to fetch.
     */
    orderBy?: MerchantOrderByWithRelationInput | MerchantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Merchants.
     */
    cursor?: MerchantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Merchants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Merchants.
     */
    skip?: number
    distinct?: MerchantScalarFieldEnum | MerchantScalarFieldEnum[]
  }

  /**
   * Merchant create
   */
  export type MerchantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * The data needed to create a Merchant.
     */
    data: XOR<MerchantCreateInput, MerchantUncheckedCreateInput>
  }

  /**
   * Merchant createMany
   */
  export type MerchantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Merchants.
     */
    data: MerchantCreateManyInput | MerchantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Merchant createManyAndReturn
   */
  export type MerchantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * The data used to create many Merchants.
     */
    data: MerchantCreateManyInput | MerchantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Merchant update
   */
  export type MerchantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * The data needed to update a Merchant.
     */
    data: XOR<MerchantUpdateInput, MerchantUncheckedUpdateInput>
    /**
     * Choose, which Merchant to update.
     */
    where: MerchantWhereUniqueInput
  }

  /**
   * Merchant updateMany
   */
  export type MerchantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Merchants.
     */
    data: XOR<MerchantUpdateManyMutationInput, MerchantUncheckedUpdateManyInput>
    /**
     * Filter which Merchants to update
     */
    where?: MerchantWhereInput
    /**
     * Limit how many Merchants to update.
     */
    limit?: number
  }

  /**
   * Merchant updateManyAndReturn
   */
  export type MerchantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * The data used to update Merchants.
     */
    data: XOR<MerchantUpdateManyMutationInput, MerchantUncheckedUpdateManyInput>
    /**
     * Filter which Merchants to update
     */
    where?: MerchantWhereInput
    /**
     * Limit how many Merchants to update.
     */
    limit?: number
  }

  /**
   * Merchant upsert
   */
  export type MerchantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * The filter to search for the Merchant to update in case it exists.
     */
    where: MerchantWhereUniqueInput
    /**
     * In case the Merchant found by the `where` argument doesn't exist, create a new Merchant with this data.
     */
    create: XOR<MerchantCreateInput, MerchantUncheckedCreateInput>
    /**
     * In case the Merchant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchantUpdateInput, MerchantUncheckedUpdateInput>
  }

  /**
   * Merchant delete
   */
  export type MerchantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
    /**
     * Filter which Merchant to delete.
     */
    where: MerchantWhereUniqueInput
  }

  /**
   * Merchant deleteMany
   */
  export type MerchantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Merchants to delete
     */
    where?: MerchantWhereInput
    /**
     * Limit how many Merchants to delete.
     */
    limit?: number
  }

  /**
   * Merchant.plans
   */
  export type Merchant$plansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    where?: MerchantPlanWhereInput
    orderBy?: MerchantPlanOrderByWithRelationInput | MerchantPlanOrderByWithRelationInput[]
    cursor?: MerchantPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MerchantPlanScalarFieldEnum | MerchantPlanScalarFieldEnum[]
  }

  /**
   * Merchant.events
   */
  export type Merchant$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    where?: MerchantEventWhereInput
    orderBy?: MerchantEventOrderByWithRelationInput | MerchantEventOrderByWithRelationInput[]
    cursor?: MerchantEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MerchantEventScalarFieldEnum | MerchantEventScalarFieldEnum[]
  }

  /**
   * Merchant.deletionRequests
   */
  export type Merchant$deletionRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    where?: MerchantDataDeletionRequestWhereInput
    orderBy?: MerchantDataDeletionRequestOrderByWithRelationInput | MerchantDataDeletionRequestOrderByWithRelationInput[]
    cursor?: MerchantDataDeletionRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MerchantDataDeletionRequestScalarFieldEnum | MerchantDataDeletionRequestScalarFieldEnum[]
  }

  /**
   * Merchant without action
   */
  export type MerchantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Merchant
     */
    select?: MerchantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Merchant
     */
    omit?: MerchantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantInclude<ExtArgs> | null
  }


  /**
   * Model MerchantPlan
   */

  export type AggregateMerchantPlan = {
    _count: MerchantPlanCountAggregateOutputType | null
    _min: MerchantPlanMinAggregateOutputType | null
    _max: MerchantPlanMaxAggregateOutputType | null
  }

  export type MerchantPlanMinAggregateOutputType = {
    id: string | null
    merchantId: string | null
    shopifySubscriptionGid: string | null
    planKey: string | null
    planName: string | null
    billingModel: string | null
    billingInterval: string | null
    status: string | null
    isTest: boolean | null
    activatedAt: Date | null
    currentPeriodEndAt: Date | null
    trialEndsAt: Date | null
    canceledAt: Date | null
    rawPayloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantPlanMaxAggregateOutputType = {
    id: string | null
    merchantId: string | null
    shopifySubscriptionGid: string | null
    planKey: string | null
    planName: string | null
    billingModel: string | null
    billingInterval: string | null
    status: string | null
    isTest: boolean | null
    activatedAt: Date | null
    currentPeriodEndAt: Date | null
    trialEndsAt: Date | null
    canceledAt: Date | null
    rawPayloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantPlanCountAggregateOutputType = {
    id: number
    merchantId: number
    shopifySubscriptionGid: number
    planKey: number
    planName: number
    billingModel: number
    billingInterval: number
    status: number
    isTest: number
    activatedAt: number
    currentPeriodEndAt: number
    trialEndsAt: number
    canceledAt: number
    rawPayloadJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MerchantPlanMinAggregateInputType = {
    id?: true
    merchantId?: true
    shopifySubscriptionGid?: true
    planKey?: true
    planName?: true
    billingModel?: true
    billingInterval?: true
    status?: true
    isTest?: true
    activatedAt?: true
    currentPeriodEndAt?: true
    trialEndsAt?: true
    canceledAt?: true
    rawPayloadJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantPlanMaxAggregateInputType = {
    id?: true
    merchantId?: true
    shopifySubscriptionGid?: true
    planKey?: true
    planName?: true
    billingModel?: true
    billingInterval?: true
    status?: true
    isTest?: true
    activatedAt?: true
    currentPeriodEndAt?: true
    trialEndsAt?: true
    canceledAt?: true
    rawPayloadJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantPlanCountAggregateInputType = {
    id?: true
    merchantId?: true
    shopifySubscriptionGid?: true
    planKey?: true
    planName?: true
    billingModel?: true
    billingInterval?: true
    status?: true
    isTest?: true
    activatedAt?: true
    currentPeriodEndAt?: true
    trialEndsAt?: true
    canceledAt?: true
    rawPayloadJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MerchantPlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantPlan to aggregate.
     */
    where?: MerchantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantPlans to fetch.
     */
    orderBy?: MerchantPlanOrderByWithRelationInput | MerchantPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MerchantPlans
    **/
    _count?: true | MerchantPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchantPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchantPlanMaxAggregateInputType
  }

  export type GetMerchantPlanAggregateType<T extends MerchantPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchantPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchantPlan[P]>
      : GetScalarType<T[P], AggregateMerchantPlan[P]>
  }




  export type MerchantPlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantPlanWhereInput
    orderBy?: MerchantPlanOrderByWithAggregationInput | MerchantPlanOrderByWithAggregationInput[]
    by: MerchantPlanScalarFieldEnum[] | MerchantPlanScalarFieldEnum
    having?: MerchantPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchantPlanCountAggregateInputType | true
    _min?: MerchantPlanMinAggregateInputType
    _max?: MerchantPlanMaxAggregateInputType
  }

  export type MerchantPlanGroupByOutputType = {
    id: string
    merchantId: string
    shopifySubscriptionGid: string | null
    planKey: string
    planName: string
    billingModel: string
    billingInterval: string | null
    status: string
    isTest: boolean
    activatedAt: Date | null
    currentPeriodEndAt: Date | null
    trialEndsAt: Date | null
    canceledAt: Date | null
    rawPayloadJson: string
    createdAt: Date
    updatedAt: Date
    _count: MerchantPlanCountAggregateOutputType | null
    _min: MerchantPlanMinAggregateOutputType | null
    _max: MerchantPlanMaxAggregateOutputType | null
  }

  type GetMerchantPlanGroupByPayload<T extends MerchantPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchantPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchantPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchantPlanGroupByOutputType[P]>
            : GetScalarType<T[P], MerchantPlanGroupByOutputType[P]>
        }
      >
    >


  export type MerchantPlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    shopifySubscriptionGid?: boolean
    planKey?: boolean
    planName?: boolean
    billingModel?: boolean
    billingInterval?: boolean
    status?: boolean
    isTest?: boolean
    activatedAt?: boolean
    currentPeriodEndAt?: boolean
    trialEndsAt?: boolean
    canceledAt?: boolean
    rawPayloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantPlan"]>

  export type MerchantPlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    shopifySubscriptionGid?: boolean
    planKey?: boolean
    planName?: boolean
    billingModel?: boolean
    billingInterval?: boolean
    status?: boolean
    isTest?: boolean
    activatedAt?: boolean
    currentPeriodEndAt?: boolean
    trialEndsAt?: boolean
    canceledAt?: boolean
    rawPayloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantPlan"]>

  export type MerchantPlanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    shopifySubscriptionGid?: boolean
    planKey?: boolean
    planName?: boolean
    billingModel?: boolean
    billingInterval?: boolean
    status?: boolean
    isTest?: boolean
    activatedAt?: boolean
    currentPeriodEndAt?: boolean
    trialEndsAt?: boolean
    canceledAt?: boolean
    rawPayloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantPlan"]>

  export type MerchantPlanSelectScalar = {
    id?: boolean
    merchantId?: boolean
    shopifySubscriptionGid?: boolean
    planKey?: boolean
    planName?: boolean
    billingModel?: boolean
    billingInterval?: boolean
    status?: boolean
    isTest?: boolean
    activatedAt?: boolean
    currentPeriodEndAt?: boolean
    trialEndsAt?: boolean
    canceledAt?: boolean
    rawPayloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MerchantPlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "merchantId" | "shopifySubscriptionGid" | "planKey" | "planName" | "billingModel" | "billingInterval" | "status" | "isTest" | "activatedAt" | "currentPeriodEndAt" | "trialEndsAt" | "canceledAt" | "rawPayloadJson" | "createdAt" | "updatedAt", ExtArgs["result"]["merchantPlan"]>
  export type MerchantPlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantPlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantPlanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }

  export type $MerchantPlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MerchantPlan"
    objects: {
      merchant: Prisma.$MerchantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      merchantId: string
      shopifySubscriptionGid: string | null
      planKey: string
      planName: string
      billingModel: string
      billingInterval: string | null
      status: string
      isTest: boolean
      activatedAt: Date | null
      currentPeriodEndAt: Date | null
      trialEndsAt: Date | null
      canceledAt: Date | null
      rawPayloadJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["merchantPlan"]>
    composites: {}
  }

  type MerchantPlanGetPayload<S extends boolean | null | undefined | MerchantPlanDefaultArgs> = $Result.GetResult<Prisma.$MerchantPlanPayload, S>

  type MerchantPlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MerchantPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MerchantPlanCountAggregateInputType | true
    }

  export interface MerchantPlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MerchantPlan'], meta: { name: 'MerchantPlan' } }
    /**
     * Find zero or one MerchantPlan that matches the filter.
     * @param {MerchantPlanFindUniqueArgs} args - Arguments to find a MerchantPlan
     * @example
     * // Get one MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchantPlanFindUniqueArgs>(args: SelectSubset<T, MerchantPlanFindUniqueArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MerchantPlan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MerchantPlanFindUniqueOrThrowArgs} args - Arguments to find a MerchantPlan
     * @example
     * // Get one MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchantPlanFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchantPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanFindFirstArgs} args - Arguments to find a MerchantPlan
     * @example
     * // Get one MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchantPlanFindFirstArgs>(args?: SelectSubset<T, MerchantPlanFindFirstArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantPlan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanFindFirstOrThrowArgs} args - Arguments to find a MerchantPlan
     * @example
     * // Get one MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchantPlanFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchantPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MerchantPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MerchantPlans
     * const merchantPlans = await prisma.merchantPlan.findMany()
     * 
     * // Get first 10 MerchantPlans
     * const merchantPlans = await prisma.merchantPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchantPlanWithIdOnly = await prisma.merchantPlan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchantPlanFindManyArgs>(args?: SelectSubset<T, MerchantPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MerchantPlan.
     * @param {MerchantPlanCreateArgs} args - Arguments to create a MerchantPlan.
     * @example
     * // Create one MerchantPlan
     * const MerchantPlan = await prisma.merchantPlan.create({
     *   data: {
     *     // ... data to create a MerchantPlan
     *   }
     * })
     * 
     */
    create<T extends MerchantPlanCreateArgs>(args: SelectSubset<T, MerchantPlanCreateArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MerchantPlans.
     * @param {MerchantPlanCreateManyArgs} args - Arguments to create many MerchantPlans.
     * @example
     * // Create many MerchantPlans
     * const merchantPlan = await prisma.merchantPlan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchantPlanCreateManyArgs>(args?: SelectSubset<T, MerchantPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MerchantPlans and returns the data saved in the database.
     * @param {MerchantPlanCreateManyAndReturnArgs} args - Arguments to create many MerchantPlans.
     * @example
     * // Create many MerchantPlans
     * const merchantPlan = await prisma.merchantPlan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MerchantPlans and only return the `id`
     * const merchantPlanWithIdOnly = await prisma.merchantPlan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchantPlanCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchantPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MerchantPlan.
     * @param {MerchantPlanDeleteArgs} args - Arguments to delete one MerchantPlan.
     * @example
     * // Delete one MerchantPlan
     * const MerchantPlan = await prisma.merchantPlan.delete({
     *   where: {
     *     // ... filter to delete one MerchantPlan
     *   }
     * })
     * 
     */
    delete<T extends MerchantPlanDeleteArgs>(args: SelectSubset<T, MerchantPlanDeleteArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MerchantPlan.
     * @param {MerchantPlanUpdateArgs} args - Arguments to update one MerchantPlan.
     * @example
     * // Update one MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchantPlanUpdateArgs>(args: SelectSubset<T, MerchantPlanUpdateArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MerchantPlans.
     * @param {MerchantPlanDeleteManyArgs} args - Arguments to filter MerchantPlans to delete.
     * @example
     * // Delete a few MerchantPlans
     * const { count } = await prisma.merchantPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchantPlanDeleteManyArgs>(args?: SelectSubset<T, MerchantPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MerchantPlans
     * const merchantPlan = await prisma.merchantPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchantPlanUpdateManyArgs>(args: SelectSubset<T, MerchantPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantPlans and returns the data updated in the database.
     * @param {MerchantPlanUpdateManyAndReturnArgs} args - Arguments to update many MerchantPlans.
     * @example
     * // Update many MerchantPlans
     * const merchantPlan = await prisma.merchantPlan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MerchantPlans and only return the `id`
     * const merchantPlanWithIdOnly = await prisma.merchantPlan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MerchantPlanUpdateManyAndReturnArgs>(args: SelectSubset<T, MerchantPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MerchantPlan.
     * @param {MerchantPlanUpsertArgs} args - Arguments to update or create a MerchantPlan.
     * @example
     * // Update or create a MerchantPlan
     * const merchantPlan = await prisma.merchantPlan.upsert({
     *   create: {
     *     // ... data to create a MerchantPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MerchantPlan we want to update
     *   }
     * })
     */
    upsert<T extends MerchantPlanUpsertArgs>(args: SelectSubset<T, MerchantPlanUpsertArgs<ExtArgs>>): Prisma__MerchantPlanClient<$Result.GetResult<Prisma.$MerchantPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MerchantPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanCountArgs} args - Arguments to filter MerchantPlans to count.
     * @example
     * // Count the number of MerchantPlans
     * const count = await prisma.merchantPlan.count({
     *   where: {
     *     // ... the filter for the MerchantPlans we want to count
     *   }
     * })
    **/
    count<T extends MerchantPlanCountArgs>(
      args?: Subset<T, MerchantPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchantPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MerchantPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchantPlanAggregateArgs>(args: Subset<T, MerchantPlanAggregateArgs>): Prisma.PrismaPromise<GetMerchantPlanAggregateType<T>>

    /**
     * Group by MerchantPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantPlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchantPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchantPlanGroupByArgs['orderBy'] }
        : { orderBy?: MerchantPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchantPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchantPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MerchantPlan model
   */
  readonly fields: MerchantPlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MerchantPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchantPlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    merchant<T extends MerchantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MerchantDefaultArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MerchantPlan model
   */
  interface MerchantPlanFieldRefs {
    readonly id: FieldRef<"MerchantPlan", 'String'>
    readonly merchantId: FieldRef<"MerchantPlan", 'String'>
    readonly shopifySubscriptionGid: FieldRef<"MerchantPlan", 'String'>
    readonly planKey: FieldRef<"MerchantPlan", 'String'>
    readonly planName: FieldRef<"MerchantPlan", 'String'>
    readonly billingModel: FieldRef<"MerchantPlan", 'String'>
    readonly billingInterval: FieldRef<"MerchantPlan", 'String'>
    readonly status: FieldRef<"MerchantPlan", 'String'>
    readonly isTest: FieldRef<"MerchantPlan", 'Boolean'>
    readonly activatedAt: FieldRef<"MerchantPlan", 'DateTime'>
    readonly currentPeriodEndAt: FieldRef<"MerchantPlan", 'DateTime'>
    readonly trialEndsAt: FieldRef<"MerchantPlan", 'DateTime'>
    readonly canceledAt: FieldRef<"MerchantPlan", 'DateTime'>
    readonly rawPayloadJson: FieldRef<"MerchantPlan", 'String'>
    readonly createdAt: FieldRef<"MerchantPlan", 'DateTime'>
    readonly updatedAt: FieldRef<"MerchantPlan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MerchantPlan findUnique
   */
  export type MerchantPlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter, which MerchantPlan to fetch.
     */
    where: MerchantPlanWhereUniqueInput
  }

  /**
   * MerchantPlan findUniqueOrThrow
   */
  export type MerchantPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter, which MerchantPlan to fetch.
     */
    where: MerchantPlanWhereUniqueInput
  }

  /**
   * MerchantPlan findFirst
   */
  export type MerchantPlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter, which MerchantPlan to fetch.
     */
    where?: MerchantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantPlans to fetch.
     */
    orderBy?: MerchantPlanOrderByWithRelationInput | MerchantPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantPlans.
     */
    cursor?: MerchantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantPlans.
     */
    distinct?: MerchantPlanScalarFieldEnum | MerchantPlanScalarFieldEnum[]
  }

  /**
   * MerchantPlan findFirstOrThrow
   */
  export type MerchantPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter, which MerchantPlan to fetch.
     */
    where?: MerchantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantPlans to fetch.
     */
    orderBy?: MerchantPlanOrderByWithRelationInput | MerchantPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantPlans.
     */
    cursor?: MerchantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantPlans.
     */
    distinct?: MerchantPlanScalarFieldEnum | MerchantPlanScalarFieldEnum[]
  }

  /**
   * MerchantPlan findMany
   */
  export type MerchantPlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter, which MerchantPlans to fetch.
     */
    where?: MerchantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantPlans to fetch.
     */
    orderBy?: MerchantPlanOrderByWithRelationInput | MerchantPlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MerchantPlans.
     */
    cursor?: MerchantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantPlans.
     */
    skip?: number
    distinct?: MerchantPlanScalarFieldEnum | MerchantPlanScalarFieldEnum[]
  }

  /**
   * MerchantPlan create
   */
  export type MerchantPlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a MerchantPlan.
     */
    data: XOR<MerchantPlanCreateInput, MerchantPlanUncheckedCreateInput>
  }

  /**
   * MerchantPlan createMany
   */
  export type MerchantPlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MerchantPlans.
     */
    data: MerchantPlanCreateManyInput | MerchantPlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MerchantPlan createManyAndReturn
   */
  export type MerchantPlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * The data used to create many MerchantPlans.
     */
    data: MerchantPlanCreateManyInput | MerchantPlanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantPlan update
   */
  export type MerchantPlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a MerchantPlan.
     */
    data: XOR<MerchantPlanUpdateInput, MerchantPlanUncheckedUpdateInput>
    /**
     * Choose, which MerchantPlan to update.
     */
    where: MerchantPlanWhereUniqueInput
  }

  /**
   * MerchantPlan updateMany
   */
  export type MerchantPlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MerchantPlans.
     */
    data: XOR<MerchantPlanUpdateManyMutationInput, MerchantPlanUncheckedUpdateManyInput>
    /**
     * Filter which MerchantPlans to update
     */
    where?: MerchantPlanWhereInput
    /**
     * Limit how many MerchantPlans to update.
     */
    limit?: number
  }

  /**
   * MerchantPlan updateManyAndReturn
   */
  export type MerchantPlanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * The data used to update MerchantPlans.
     */
    data: XOR<MerchantPlanUpdateManyMutationInput, MerchantPlanUncheckedUpdateManyInput>
    /**
     * Filter which MerchantPlans to update
     */
    where?: MerchantPlanWhereInput
    /**
     * Limit how many MerchantPlans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantPlan upsert
   */
  export type MerchantPlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the MerchantPlan to update in case it exists.
     */
    where: MerchantPlanWhereUniqueInput
    /**
     * In case the MerchantPlan found by the `where` argument doesn't exist, create a new MerchantPlan with this data.
     */
    create: XOR<MerchantPlanCreateInput, MerchantPlanUncheckedCreateInput>
    /**
     * In case the MerchantPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchantPlanUpdateInput, MerchantPlanUncheckedUpdateInput>
  }

  /**
   * MerchantPlan delete
   */
  export type MerchantPlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
    /**
     * Filter which MerchantPlan to delete.
     */
    where: MerchantPlanWhereUniqueInput
  }

  /**
   * MerchantPlan deleteMany
   */
  export type MerchantPlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantPlans to delete
     */
    where?: MerchantPlanWhereInput
    /**
     * Limit how many MerchantPlans to delete.
     */
    limit?: number
  }

  /**
   * MerchantPlan without action
   */
  export type MerchantPlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantPlan
     */
    select?: MerchantPlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantPlan
     */
    omit?: MerchantPlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantPlanInclude<ExtArgs> | null
  }


  /**
   * Model MerchantEvent
   */

  export type AggregateMerchantEvent = {
    _count: MerchantEventCountAggregateOutputType | null
    _min: MerchantEventMinAggregateOutputType | null
    _max: MerchantEventMaxAggregateOutputType | null
  }

  export type MerchantEventMinAggregateOutputType = {
    id: string | null
    merchantId: string | null
    type: string | null
    severity: string | null
    source: string | null
    payloadJson: string | null
    createdAt: Date | null
  }

  export type MerchantEventMaxAggregateOutputType = {
    id: string | null
    merchantId: string | null
    type: string | null
    severity: string | null
    source: string | null
    payloadJson: string | null
    createdAt: Date | null
  }

  export type MerchantEventCountAggregateOutputType = {
    id: number
    merchantId: number
    type: number
    severity: number
    source: number
    payloadJson: number
    createdAt: number
    _all: number
  }


  export type MerchantEventMinAggregateInputType = {
    id?: true
    merchantId?: true
    type?: true
    severity?: true
    source?: true
    payloadJson?: true
    createdAt?: true
  }

  export type MerchantEventMaxAggregateInputType = {
    id?: true
    merchantId?: true
    type?: true
    severity?: true
    source?: true
    payloadJson?: true
    createdAt?: true
  }

  export type MerchantEventCountAggregateInputType = {
    id?: true
    merchantId?: true
    type?: true
    severity?: true
    source?: true
    payloadJson?: true
    createdAt?: true
    _all?: true
  }

  export type MerchantEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantEvent to aggregate.
     */
    where?: MerchantEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantEvents to fetch.
     */
    orderBy?: MerchantEventOrderByWithRelationInput | MerchantEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchantEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MerchantEvents
    **/
    _count?: true | MerchantEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchantEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchantEventMaxAggregateInputType
  }

  export type GetMerchantEventAggregateType<T extends MerchantEventAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchantEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchantEvent[P]>
      : GetScalarType<T[P], AggregateMerchantEvent[P]>
  }




  export type MerchantEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantEventWhereInput
    orderBy?: MerchantEventOrderByWithAggregationInput | MerchantEventOrderByWithAggregationInput[]
    by: MerchantEventScalarFieldEnum[] | MerchantEventScalarFieldEnum
    having?: MerchantEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchantEventCountAggregateInputType | true
    _min?: MerchantEventMinAggregateInputType
    _max?: MerchantEventMaxAggregateInputType
  }

  export type MerchantEventGroupByOutputType = {
    id: string
    merchantId: string
    type: string
    severity: string
    source: string
    payloadJson: string
    createdAt: Date
    _count: MerchantEventCountAggregateOutputType | null
    _min: MerchantEventMinAggregateOutputType | null
    _max: MerchantEventMaxAggregateOutputType | null
  }

  type GetMerchantEventGroupByPayload<T extends MerchantEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchantEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchantEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchantEventGroupByOutputType[P]>
            : GetScalarType<T[P], MerchantEventGroupByOutputType[P]>
        }
      >
    >


  export type MerchantEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    type?: boolean
    severity?: boolean
    source?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantEvent"]>

  export type MerchantEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    type?: boolean
    severity?: boolean
    source?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantEvent"]>

  export type MerchantEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    type?: boolean
    severity?: boolean
    source?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantEvent"]>

  export type MerchantEventSelectScalar = {
    id?: boolean
    merchantId?: boolean
    type?: boolean
    severity?: boolean
    source?: boolean
    payloadJson?: boolean
    createdAt?: boolean
  }

  export type MerchantEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "merchantId" | "type" | "severity" | "source" | "payloadJson" | "createdAt", ExtArgs["result"]["merchantEvent"]>
  export type MerchantEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }

  export type $MerchantEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MerchantEvent"
    objects: {
      merchant: Prisma.$MerchantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      merchantId: string
      type: string
      severity: string
      source: string
      payloadJson: string
      createdAt: Date
    }, ExtArgs["result"]["merchantEvent"]>
    composites: {}
  }

  type MerchantEventGetPayload<S extends boolean | null | undefined | MerchantEventDefaultArgs> = $Result.GetResult<Prisma.$MerchantEventPayload, S>

  type MerchantEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MerchantEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MerchantEventCountAggregateInputType | true
    }

  export interface MerchantEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MerchantEvent'], meta: { name: 'MerchantEvent' } }
    /**
     * Find zero or one MerchantEvent that matches the filter.
     * @param {MerchantEventFindUniqueArgs} args - Arguments to find a MerchantEvent
     * @example
     * // Get one MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchantEventFindUniqueArgs>(args: SelectSubset<T, MerchantEventFindUniqueArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MerchantEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MerchantEventFindUniqueOrThrowArgs} args - Arguments to find a MerchantEvent
     * @example
     * // Get one MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchantEventFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchantEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventFindFirstArgs} args - Arguments to find a MerchantEvent
     * @example
     * // Get one MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchantEventFindFirstArgs>(args?: SelectSubset<T, MerchantEventFindFirstArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventFindFirstOrThrowArgs} args - Arguments to find a MerchantEvent
     * @example
     * // Get one MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchantEventFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchantEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MerchantEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MerchantEvents
     * const merchantEvents = await prisma.merchantEvent.findMany()
     * 
     * // Get first 10 MerchantEvents
     * const merchantEvents = await prisma.merchantEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchantEventWithIdOnly = await prisma.merchantEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchantEventFindManyArgs>(args?: SelectSubset<T, MerchantEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MerchantEvent.
     * @param {MerchantEventCreateArgs} args - Arguments to create a MerchantEvent.
     * @example
     * // Create one MerchantEvent
     * const MerchantEvent = await prisma.merchantEvent.create({
     *   data: {
     *     // ... data to create a MerchantEvent
     *   }
     * })
     * 
     */
    create<T extends MerchantEventCreateArgs>(args: SelectSubset<T, MerchantEventCreateArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MerchantEvents.
     * @param {MerchantEventCreateManyArgs} args - Arguments to create many MerchantEvents.
     * @example
     * // Create many MerchantEvents
     * const merchantEvent = await prisma.merchantEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchantEventCreateManyArgs>(args?: SelectSubset<T, MerchantEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MerchantEvents and returns the data saved in the database.
     * @param {MerchantEventCreateManyAndReturnArgs} args - Arguments to create many MerchantEvents.
     * @example
     * // Create many MerchantEvents
     * const merchantEvent = await prisma.merchantEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MerchantEvents and only return the `id`
     * const merchantEventWithIdOnly = await prisma.merchantEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchantEventCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchantEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MerchantEvent.
     * @param {MerchantEventDeleteArgs} args - Arguments to delete one MerchantEvent.
     * @example
     * // Delete one MerchantEvent
     * const MerchantEvent = await prisma.merchantEvent.delete({
     *   where: {
     *     // ... filter to delete one MerchantEvent
     *   }
     * })
     * 
     */
    delete<T extends MerchantEventDeleteArgs>(args: SelectSubset<T, MerchantEventDeleteArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MerchantEvent.
     * @param {MerchantEventUpdateArgs} args - Arguments to update one MerchantEvent.
     * @example
     * // Update one MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchantEventUpdateArgs>(args: SelectSubset<T, MerchantEventUpdateArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MerchantEvents.
     * @param {MerchantEventDeleteManyArgs} args - Arguments to filter MerchantEvents to delete.
     * @example
     * // Delete a few MerchantEvents
     * const { count } = await prisma.merchantEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchantEventDeleteManyArgs>(args?: SelectSubset<T, MerchantEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MerchantEvents
     * const merchantEvent = await prisma.merchantEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchantEventUpdateManyArgs>(args: SelectSubset<T, MerchantEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantEvents and returns the data updated in the database.
     * @param {MerchantEventUpdateManyAndReturnArgs} args - Arguments to update many MerchantEvents.
     * @example
     * // Update many MerchantEvents
     * const merchantEvent = await prisma.merchantEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MerchantEvents and only return the `id`
     * const merchantEventWithIdOnly = await prisma.merchantEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MerchantEventUpdateManyAndReturnArgs>(args: SelectSubset<T, MerchantEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MerchantEvent.
     * @param {MerchantEventUpsertArgs} args - Arguments to update or create a MerchantEvent.
     * @example
     * // Update or create a MerchantEvent
     * const merchantEvent = await prisma.merchantEvent.upsert({
     *   create: {
     *     // ... data to create a MerchantEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MerchantEvent we want to update
     *   }
     * })
     */
    upsert<T extends MerchantEventUpsertArgs>(args: SelectSubset<T, MerchantEventUpsertArgs<ExtArgs>>): Prisma__MerchantEventClient<$Result.GetResult<Prisma.$MerchantEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MerchantEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventCountArgs} args - Arguments to filter MerchantEvents to count.
     * @example
     * // Count the number of MerchantEvents
     * const count = await prisma.merchantEvent.count({
     *   where: {
     *     // ... the filter for the MerchantEvents we want to count
     *   }
     * })
    **/
    count<T extends MerchantEventCountArgs>(
      args?: Subset<T, MerchantEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchantEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MerchantEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchantEventAggregateArgs>(args: Subset<T, MerchantEventAggregateArgs>): Prisma.PrismaPromise<GetMerchantEventAggregateType<T>>

    /**
     * Group by MerchantEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchantEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchantEventGroupByArgs['orderBy'] }
        : { orderBy?: MerchantEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchantEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchantEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MerchantEvent model
   */
  readonly fields: MerchantEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MerchantEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchantEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    merchant<T extends MerchantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MerchantDefaultArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MerchantEvent model
   */
  interface MerchantEventFieldRefs {
    readonly id: FieldRef<"MerchantEvent", 'String'>
    readonly merchantId: FieldRef<"MerchantEvent", 'String'>
    readonly type: FieldRef<"MerchantEvent", 'String'>
    readonly severity: FieldRef<"MerchantEvent", 'String'>
    readonly source: FieldRef<"MerchantEvent", 'String'>
    readonly payloadJson: FieldRef<"MerchantEvent", 'String'>
    readonly createdAt: FieldRef<"MerchantEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MerchantEvent findUnique
   */
  export type MerchantEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter, which MerchantEvent to fetch.
     */
    where: MerchantEventWhereUniqueInput
  }

  /**
   * MerchantEvent findUniqueOrThrow
   */
  export type MerchantEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter, which MerchantEvent to fetch.
     */
    where: MerchantEventWhereUniqueInput
  }

  /**
   * MerchantEvent findFirst
   */
  export type MerchantEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter, which MerchantEvent to fetch.
     */
    where?: MerchantEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantEvents to fetch.
     */
    orderBy?: MerchantEventOrderByWithRelationInput | MerchantEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantEvents.
     */
    cursor?: MerchantEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantEvents.
     */
    distinct?: MerchantEventScalarFieldEnum | MerchantEventScalarFieldEnum[]
  }

  /**
   * MerchantEvent findFirstOrThrow
   */
  export type MerchantEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter, which MerchantEvent to fetch.
     */
    where?: MerchantEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantEvents to fetch.
     */
    orderBy?: MerchantEventOrderByWithRelationInput | MerchantEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantEvents.
     */
    cursor?: MerchantEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantEvents.
     */
    distinct?: MerchantEventScalarFieldEnum | MerchantEventScalarFieldEnum[]
  }

  /**
   * MerchantEvent findMany
   */
  export type MerchantEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter, which MerchantEvents to fetch.
     */
    where?: MerchantEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantEvents to fetch.
     */
    orderBy?: MerchantEventOrderByWithRelationInput | MerchantEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MerchantEvents.
     */
    cursor?: MerchantEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantEvents.
     */
    skip?: number
    distinct?: MerchantEventScalarFieldEnum | MerchantEventScalarFieldEnum[]
  }

  /**
   * MerchantEvent create
   */
  export type MerchantEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * The data needed to create a MerchantEvent.
     */
    data: XOR<MerchantEventCreateInput, MerchantEventUncheckedCreateInput>
  }

  /**
   * MerchantEvent createMany
   */
  export type MerchantEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MerchantEvents.
     */
    data: MerchantEventCreateManyInput | MerchantEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MerchantEvent createManyAndReturn
   */
  export type MerchantEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * The data used to create many MerchantEvents.
     */
    data: MerchantEventCreateManyInput | MerchantEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantEvent update
   */
  export type MerchantEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * The data needed to update a MerchantEvent.
     */
    data: XOR<MerchantEventUpdateInput, MerchantEventUncheckedUpdateInput>
    /**
     * Choose, which MerchantEvent to update.
     */
    where: MerchantEventWhereUniqueInput
  }

  /**
   * MerchantEvent updateMany
   */
  export type MerchantEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MerchantEvents.
     */
    data: XOR<MerchantEventUpdateManyMutationInput, MerchantEventUncheckedUpdateManyInput>
    /**
     * Filter which MerchantEvents to update
     */
    where?: MerchantEventWhereInput
    /**
     * Limit how many MerchantEvents to update.
     */
    limit?: number
  }

  /**
   * MerchantEvent updateManyAndReturn
   */
  export type MerchantEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * The data used to update MerchantEvents.
     */
    data: XOR<MerchantEventUpdateManyMutationInput, MerchantEventUncheckedUpdateManyInput>
    /**
     * Filter which MerchantEvents to update
     */
    where?: MerchantEventWhereInput
    /**
     * Limit how many MerchantEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantEvent upsert
   */
  export type MerchantEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * The filter to search for the MerchantEvent to update in case it exists.
     */
    where: MerchantEventWhereUniqueInput
    /**
     * In case the MerchantEvent found by the `where` argument doesn't exist, create a new MerchantEvent with this data.
     */
    create: XOR<MerchantEventCreateInput, MerchantEventUncheckedCreateInput>
    /**
     * In case the MerchantEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchantEventUpdateInput, MerchantEventUncheckedUpdateInput>
  }

  /**
   * MerchantEvent delete
   */
  export type MerchantEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
    /**
     * Filter which MerchantEvent to delete.
     */
    where: MerchantEventWhereUniqueInput
  }

  /**
   * MerchantEvent deleteMany
   */
  export type MerchantEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantEvents to delete
     */
    where?: MerchantEventWhereInput
    /**
     * Limit how many MerchantEvents to delete.
     */
    limit?: number
  }

  /**
   * MerchantEvent without action
   */
  export type MerchantEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantEvent
     */
    select?: MerchantEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantEvent
     */
    omit?: MerchantEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantEventInclude<ExtArgs> | null
  }


  /**
   * Model MerchantDataDeletionRequest
   */

  export type AggregateMerchantDataDeletionRequest = {
    _count: MerchantDataDeletionRequestCountAggregateOutputType | null
    _min: MerchantDataDeletionRequestMinAggregateOutputType | null
    _max: MerchantDataDeletionRequestMaxAggregateOutputType | null
  }

  export type MerchantDataDeletionRequestMinAggregateOutputType = {
    id: string | null
    merchantId: string | null
    requestedBy: string | null
    status: string | null
    scopeJson: string | null
    completedAt: Date | null
    failureReason: string | null
    auditNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantDataDeletionRequestMaxAggregateOutputType = {
    id: string | null
    merchantId: string | null
    requestedBy: string | null
    status: string | null
    scopeJson: string | null
    completedAt: Date | null
    failureReason: string | null
    auditNotes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MerchantDataDeletionRequestCountAggregateOutputType = {
    id: number
    merchantId: number
    requestedBy: number
    status: number
    scopeJson: number
    completedAt: number
    failureReason: number
    auditNotes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MerchantDataDeletionRequestMinAggregateInputType = {
    id?: true
    merchantId?: true
    requestedBy?: true
    status?: true
    scopeJson?: true
    completedAt?: true
    failureReason?: true
    auditNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantDataDeletionRequestMaxAggregateInputType = {
    id?: true
    merchantId?: true
    requestedBy?: true
    status?: true
    scopeJson?: true
    completedAt?: true
    failureReason?: true
    auditNotes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MerchantDataDeletionRequestCountAggregateInputType = {
    id?: true
    merchantId?: true
    requestedBy?: true
    status?: true
    scopeJson?: true
    completedAt?: true
    failureReason?: true
    auditNotes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MerchantDataDeletionRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantDataDeletionRequest to aggregate.
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantDataDeletionRequests to fetch.
     */
    orderBy?: MerchantDataDeletionRequestOrderByWithRelationInput | MerchantDataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MerchantDataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantDataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantDataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MerchantDataDeletionRequests
    **/
    _count?: true | MerchantDataDeletionRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MerchantDataDeletionRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MerchantDataDeletionRequestMaxAggregateInputType
  }

  export type GetMerchantDataDeletionRequestAggregateType<T extends MerchantDataDeletionRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateMerchantDataDeletionRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMerchantDataDeletionRequest[P]>
      : GetScalarType<T[P], AggregateMerchantDataDeletionRequest[P]>
  }




  export type MerchantDataDeletionRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MerchantDataDeletionRequestWhereInput
    orderBy?: MerchantDataDeletionRequestOrderByWithAggregationInput | MerchantDataDeletionRequestOrderByWithAggregationInput[]
    by: MerchantDataDeletionRequestScalarFieldEnum[] | MerchantDataDeletionRequestScalarFieldEnum
    having?: MerchantDataDeletionRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MerchantDataDeletionRequestCountAggregateInputType | true
    _min?: MerchantDataDeletionRequestMinAggregateInputType
    _max?: MerchantDataDeletionRequestMaxAggregateInputType
  }

  export type MerchantDataDeletionRequestGroupByOutputType = {
    id: string
    merchantId: string
    requestedBy: string
    status: string
    scopeJson: string
    completedAt: Date | null
    failureReason: string | null
    auditNotes: string | null
    createdAt: Date
    updatedAt: Date
    _count: MerchantDataDeletionRequestCountAggregateOutputType | null
    _min: MerchantDataDeletionRequestMinAggregateOutputType | null
    _max: MerchantDataDeletionRequestMaxAggregateOutputType | null
  }

  type GetMerchantDataDeletionRequestGroupByPayload<T extends MerchantDataDeletionRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MerchantDataDeletionRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MerchantDataDeletionRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MerchantDataDeletionRequestGroupByOutputType[P]>
            : GetScalarType<T[P], MerchantDataDeletionRequestGroupByOutputType[P]>
        }
      >
    >


  export type MerchantDataDeletionRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    requestedBy?: boolean
    status?: boolean
    scopeJson?: boolean
    completedAt?: boolean
    failureReason?: boolean
    auditNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantDataDeletionRequest"]>

  export type MerchantDataDeletionRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    requestedBy?: boolean
    status?: boolean
    scopeJson?: boolean
    completedAt?: boolean
    failureReason?: boolean
    auditNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantDataDeletionRequest"]>

  export type MerchantDataDeletionRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    merchantId?: boolean
    requestedBy?: boolean
    status?: boolean
    scopeJson?: boolean
    completedAt?: boolean
    failureReason?: boolean
    auditNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["merchantDataDeletionRequest"]>

  export type MerchantDataDeletionRequestSelectScalar = {
    id?: boolean
    merchantId?: boolean
    requestedBy?: boolean
    status?: boolean
    scopeJson?: boolean
    completedAt?: boolean
    failureReason?: boolean
    auditNotes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MerchantDataDeletionRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "merchantId" | "requestedBy" | "status" | "scopeJson" | "completedAt" | "failureReason" | "auditNotes" | "createdAt" | "updatedAt", ExtArgs["result"]["merchantDataDeletionRequest"]>
  export type MerchantDataDeletionRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantDataDeletionRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }
  export type MerchantDataDeletionRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    merchant?: boolean | MerchantDefaultArgs<ExtArgs>
  }

  export type $MerchantDataDeletionRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MerchantDataDeletionRequest"
    objects: {
      merchant: Prisma.$MerchantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      merchantId: string
      requestedBy: string
      status: string
      scopeJson: string
      completedAt: Date | null
      failureReason: string | null
      auditNotes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["merchantDataDeletionRequest"]>
    composites: {}
  }

  type MerchantDataDeletionRequestGetPayload<S extends boolean | null | undefined | MerchantDataDeletionRequestDefaultArgs> = $Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload, S>

  type MerchantDataDeletionRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MerchantDataDeletionRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MerchantDataDeletionRequestCountAggregateInputType | true
    }

  export interface MerchantDataDeletionRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MerchantDataDeletionRequest'], meta: { name: 'MerchantDataDeletionRequest' } }
    /**
     * Find zero or one MerchantDataDeletionRequest that matches the filter.
     * @param {MerchantDataDeletionRequestFindUniqueArgs} args - Arguments to find a MerchantDataDeletionRequest
     * @example
     * // Get one MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MerchantDataDeletionRequestFindUniqueArgs>(args: SelectSubset<T, MerchantDataDeletionRequestFindUniqueArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MerchantDataDeletionRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MerchantDataDeletionRequestFindUniqueOrThrowArgs} args - Arguments to find a MerchantDataDeletionRequest
     * @example
     * // Get one MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MerchantDataDeletionRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, MerchantDataDeletionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantDataDeletionRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestFindFirstArgs} args - Arguments to find a MerchantDataDeletionRequest
     * @example
     * // Get one MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MerchantDataDeletionRequestFindFirstArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestFindFirstArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MerchantDataDeletionRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestFindFirstOrThrowArgs} args - Arguments to find a MerchantDataDeletionRequest
     * @example
     * // Get one MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MerchantDataDeletionRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MerchantDataDeletionRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MerchantDataDeletionRequests
     * const merchantDataDeletionRequests = await prisma.merchantDataDeletionRequest.findMany()
     * 
     * // Get first 10 MerchantDataDeletionRequests
     * const merchantDataDeletionRequests = await prisma.merchantDataDeletionRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const merchantDataDeletionRequestWithIdOnly = await prisma.merchantDataDeletionRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MerchantDataDeletionRequestFindManyArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MerchantDataDeletionRequest.
     * @param {MerchantDataDeletionRequestCreateArgs} args - Arguments to create a MerchantDataDeletionRequest.
     * @example
     * // Create one MerchantDataDeletionRequest
     * const MerchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.create({
     *   data: {
     *     // ... data to create a MerchantDataDeletionRequest
     *   }
     * })
     * 
     */
    create<T extends MerchantDataDeletionRequestCreateArgs>(args: SelectSubset<T, MerchantDataDeletionRequestCreateArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MerchantDataDeletionRequests.
     * @param {MerchantDataDeletionRequestCreateManyArgs} args - Arguments to create many MerchantDataDeletionRequests.
     * @example
     * // Create many MerchantDataDeletionRequests
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MerchantDataDeletionRequestCreateManyArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MerchantDataDeletionRequests and returns the data saved in the database.
     * @param {MerchantDataDeletionRequestCreateManyAndReturnArgs} args - Arguments to create many MerchantDataDeletionRequests.
     * @example
     * // Create many MerchantDataDeletionRequests
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MerchantDataDeletionRequests and only return the `id`
     * const merchantDataDeletionRequestWithIdOnly = await prisma.merchantDataDeletionRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MerchantDataDeletionRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MerchantDataDeletionRequest.
     * @param {MerchantDataDeletionRequestDeleteArgs} args - Arguments to delete one MerchantDataDeletionRequest.
     * @example
     * // Delete one MerchantDataDeletionRequest
     * const MerchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.delete({
     *   where: {
     *     // ... filter to delete one MerchantDataDeletionRequest
     *   }
     * })
     * 
     */
    delete<T extends MerchantDataDeletionRequestDeleteArgs>(args: SelectSubset<T, MerchantDataDeletionRequestDeleteArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MerchantDataDeletionRequest.
     * @param {MerchantDataDeletionRequestUpdateArgs} args - Arguments to update one MerchantDataDeletionRequest.
     * @example
     * // Update one MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MerchantDataDeletionRequestUpdateArgs>(args: SelectSubset<T, MerchantDataDeletionRequestUpdateArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MerchantDataDeletionRequests.
     * @param {MerchantDataDeletionRequestDeleteManyArgs} args - Arguments to filter MerchantDataDeletionRequests to delete.
     * @example
     * // Delete a few MerchantDataDeletionRequests
     * const { count } = await prisma.merchantDataDeletionRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MerchantDataDeletionRequestDeleteManyArgs>(args?: SelectSubset<T, MerchantDataDeletionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantDataDeletionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MerchantDataDeletionRequests
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MerchantDataDeletionRequestUpdateManyArgs>(args: SelectSubset<T, MerchantDataDeletionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MerchantDataDeletionRequests and returns the data updated in the database.
     * @param {MerchantDataDeletionRequestUpdateManyAndReturnArgs} args - Arguments to update many MerchantDataDeletionRequests.
     * @example
     * // Update many MerchantDataDeletionRequests
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MerchantDataDeletionRequests and only return the `id`
     * const merchantDataDeletionRequestWithIdOnly = await prisma.merchantDataDeletionRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MerchantDataDeletionRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, MerchantDataDeletionRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MerchantDataDeletionRequest.
     * @param {MerchantDataDeletionRequestUpsertArgs} args - Arguments to update or create a MerchantDataDeletionRequest.
     * @example
     * // Update or create a MerchantDataDeletionRequest
     * const merchantDataDeletionRequest = await prisma.merchantDataDeletionRequest.upsert({
     *   create: {
     *     // ... data to create a MerchantDataDeletionRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MerchantDataDeletionRequest we want to update
     *   }
     * })
     */
    upsert<T extends MerchantDataDeletionRequestUpsertArgs>(args: SelectSubset<T, MerchantDataDeletionRequestUpsertArgs<ExtArgs>>): Prisma__MerchantDataDeletionRequestClient<$Result.GetResult<Prisma.$MerchantDataDeletionRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MerchantDataDeletionRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestCountArgs} args - Arguments to filter MerchantDataDeletionRequests to count.
     * @example
     * // Count the number of MerchantDataDeletionRequests
     * const count = await prisma.merchantDataDeletionRequest.count({
     *   where: {
     *     // ... the filter for the MerchantDataDeletionRequests we want to count
     *   }
     * })
    **/
    count<T extends MerchantDataDeletionRequestCountArgs>(
      args?: Subset<T, MerchantDataDeletionRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MerchantDataDeletionRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MerchantDataDeletionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MerchantDataDeletionRequestAggregateArgs>(args: Subset<T, MerchantDataDeletionRequestAggregateArgs>): Prisma.PrismaPromise<GetMerchantDataDeletionRequestAggregateType<T>>

    /**
     * Group by MerchantDataDeletionRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MerchantDataDeletionRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MerchantDataDeletionRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MerchantDataDeletionRequestGroupByArgs['orderBy'] }
        : { orderBy?: MerchantDataDeletionRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MerchantDataDeletionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMerchantDataDeletionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MerchantDataDeletionRequest model
   */
  readonly fields: MerchantDataDeletionRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MerchantDataDeletionRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MerchantDataDeletionRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    merchant<T extends MerchantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MerchantDefaultArgs<ExtArgs>>): Prisma__MerchantClient<$Result.GetResult<Prisma.$MerchantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MerchantDataDeletionRequest model
   */
  interface MerchantDataDeletionRequestFieldRefs {
    readonly id: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly merchantId: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly requestedBy: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly status: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly scopeJson: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly completedAt: FieldRef<"MerchantDataDeletionRequest", 'DateTime'>
    readonly failureReason: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly auditNotes: FieldRef<"MerchantDataDeletionRequest", 'String'>
    readonly createdAt: FieldRef<"MerchantDataDeletionRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"MerchantDataDeletionRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MerchantDataDeletionRequest findUnique
   */
  export type MerchantDataDeletionRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter, which MerchantDataDeletionRequest to fetch.
     */
    where: MerchantDataDeletionRequestWhereUniqueInput
  }

  /**
   * MerchantDataDeletionRequest findUniqueOrThrow
   */
  export type MerchantDataDeletionRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter, which MerchantDataDeletionRequest to fetch.
     */
    where: MerchantDataDeletionRequestWhereUniqueInput
  }

  /**
   * MerchantDataDeletionRequest findFirst
   */
  export type MerchantDataDeletionRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter, which MerchantDataDeletionRequest to fetch.
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantDataDeletionRequests to fetch.
     */
    orderBy?: MerchantDataDeletionRequestOrderByWithRelationInput | MerchantDataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantDataDeletionRequests.
     */
    cursor?: MerchantDataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantDataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantDataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantDataDeletionRequests.
     */
    distinct?: MerchantDataDeletionRequestScalarFieldEnum | MerchantDataDeletionRequestScalarFieldEnum[]
  }

  /**
   * MerchantDataDeletionRequest findFirstOrThrow
   */
  export type MerchantDataDeletionRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter, which MerchantDataDeletionRequest to fetch.
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantDataDeletionRequests to fetch.
     */
    orderBy?: MerchantDataDeletionRequestOrderByWithRelationInput | MerchantDataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MerchantDataDeletionRequests.
     */
    cursor?: MerchantDataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantDataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantDataDeletionRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MerchantDataDeletionRequests.
     */
    distinct?: MerchantDataDeletionRequestScalarFieldEnum | MerchantDataDeletionRequestScalarFieldEnum[]
  }

  /**
   * MerchantDataDeletionRequest findMany
   */
  export type MerchantDataDeletionRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter, which MerchantDataDeletionRequests to fetch.
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MerchantDataDeletionRequests to fetch.
     */
    orderBy?: MerchantDataDeletionRequestOrderByWithRelationInput | MerchantDataDeletionRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MerchantDataDeletionRequests.
     */
    cursor?: MerchantDataDeletionRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MerchantDataDeletionRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MerchantDataDeletionRequests.
     */
    skip?: number
    distinct?: MerchantDataDeletionRequestScalarFieldEnum | MerchantDataDeletionRequestScalarFieldEnum[]
  }

  /**
   * MerchantDataDeletionRequest create
   */
  export type MerchantDataDeletionRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a MerchantDataDeletionRequest.
     */
    data: XOR<MerchantDataDeletionRequestCreateInput, MerchantDataDeletionRequestUncheckedCreateInput>
  }

  /**
   * MerchantDataDeletionRequest createMany
   */
  export type MerchantDataDeletionRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MerchantDataDeletionRequests.
     */
    data: MerchantDataDeletionRequestCreateManyInput | MerchantDataDeletionRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MerchantDataDeletionRequest createManyAndReturn
   */
  export type MerchantDataDeletionRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * The data used to create many MerchantDataDeletionRequests.
     */
    data: MerchantDataDeletionRequestCreateManyInput | MerchantDataDeletionRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantDataDeletionRequest update
   */
  export type MerchantDataDeletionRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a MerchantDataDeletionRequest.
     */
    data: XOR<MerchantDataDeletionRequestUpdateInput, MerchantDataDeletionRequestUncheckedUpdateInput>
    /**
     * Choose, which MerchantDataDeletionRequest to update.
     */
    where: MerchantDataDeletionRequestWhereUniqueInput
  }

  /**
   * MerchantDataDeletionRequest updateMany
   */
  export type MerchantDataDeletionRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MerchantDataDeletionRequests.
     */
    data: XOR<MerchantDataDeletionRequestUpdateManyMutationInput, MerchantDataDeletionRequestUncheckedUpdateManyInput>
    /**
     * Filter which MerchantDataDeletionRequests to update
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * Limit how many MerchantDataDeletionRequests to update.
     */
    limit?: number
  }

  /**
   * MerchantDataDeletionRequest updateManyAndReturn
   */
  export type MerchantDataDeletionRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * The data used to update MerchantDataDeletionRequests.
     */
    data: XOR<MerchantDataDeletionRequestUpdateManyMutationInput, MerchantDataDeletionRequestUncheckedUpdateManyInput>
    /**
     * Filter which MerchantDataDeletionRequests to update
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * Limit how many MerchantDataDeletionRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MerchantDataDeletionRequest upsert
   */
  export type MerchantDataDeletionRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the MerchantDataDeletionRequest to update in case it exists.
     */
    where: MerchantDataDeletionRequestWhereUniqueInput
    /**
     * In case the MerchantDataDeletionRequest found by the `where` argument doesn't exist, create a new MerchantDataDeletionRequest with this data.
     */
    create: XOR<MerchantDataDeletionRequestCreateInput, MerchantDataDeletionRequestUncheckedCreateInput>
    /**
     * In case the MerchantDataDeletionRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MerchantDataDeletionRequestUpdateInput, MerchantDataDeletionRequestUncheckedUpdateInput>
  }

  /**
   * MerchantDataDeletionRequest delete
   */
  export type MerchantDataDeletionRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
    /**
     * Filter which MerchantDataDeletionRequest to delete.
     */
    where: MerchantDataDeletionRequestWhereUniqueInput
  }

  /**
   * MerchantDataDeletionRequest deleteMany
   */
  export type MerchantDataDeletionRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MerchantDataDeletionRequests to delete
     */
    where?: MerchantDataDeletionRequestWhereInput
    /**
     * Limit how many MerchantDataDeletionRequests to delete.
     */
    limit?: number
  }

  /**
   * MerchantDataDeletionRequest without action
   */
  export type MerchantDataDeletionRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MerchantDataDeletionRequest
     */
    select?: MerchantDataDeletionRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MerchantDataDeletionRequest
     */
    omit?: MerchantDataDeletionRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MerchantDataDeletionRequestInclude<ExtArgs> | null
  }


  /**
   * Model AdminPlanDefinition
   */

  export type AggregateAdminPlanDefinition = {
    _count: AdminPlanDefinitionCountAggregateOutputType | null
    _avg: AdminPlanDefinitionAvgAggregateOutputType | null
    _sum: AdminPlanDefinitionSumAggregateOutputType | null
    _min: AdminPlanDefinitionMinAggregateOutputType | null
    _max: AdminPlanDefinitionMaxAggregateOutputType | null
  }

  export type AdminPlanDefinitionAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type AdminPlanDefinitionSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type AdminPlanDefinitionMinAggregateOutputType = {
    id: string | null
    planKey: string | null
    displayName: string | null
    monthlyPrice: string | null
    yearlyPrice: string | null
    tagline: string | null
    bestFor: string | null
    merchantFacingHighlightsJson: string | null
    opsHighlightsJson: string | null
    isActive: boolean | null
    isPublic: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminPlanDefinitionMaxAggregateOutputType = {
    id: string | null
    planKey: string | null
    displayName: string | null
    monthlyPrice: string | null
    yearlyPrice: string | null
    tagline: string | null
    bestFor: string | null
    merchantFacingHighlightsJson: string | null
    opsHighlightsJson: string | null
    isActive: boolean | null
    isPublic: boolean | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminPlanDefinitionCountAggregateOutputType = {
    id: number
    planKey: number
    displayName: number
    monthlyPrice: number
    yearlyPrice: number
    tagline: number
    bestFor: number
    merchantFacingHighlightsJson: number
    opsHighlightsJson: number
    isActive: number
    isPublic: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminPlanDefinitionAvgAggregateInputType = {
    sortOrder?: true
  }

  export type AdminPlanDefinitionSumAggregateInputType = {
    sortOrder?: true
  }

  export type AdminPlanDefinitionMinAggregateInputType = {
    id?: true
    planKey?: true
    displayName?: true
    monthlyPrice?: true
    yearlyPrice?: true
    tagline?: true
    bestFor?: true
    merchantFacingHighlightsJson?: true
    opsHighlightsJson?: true
    isActive?: true
    isPublic?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminPlanDefinitionMaxAggregateInputType = {
    id?: true
    planKey?: true
    displayName?: true
    monthlyPrice?: true
    yearlyPrice?: true
    tagline?: true
    bestFor?: true
    merchantFacingHighlightsJson?: true
    opsHighlightsJson?: true
    isActive?: true
    isPublic?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminPlanDefinitionCountAggregateInputType = {
    id?: true
    planKey?: true
    displayName?: true
    monthlyPrice?: true
    yearlyPrice?: true
    tagline?: true
    bestFor?: true
    merchantFacingHighlightsJson?: true
    opsHighlightsJson?: true
    isActive?: true
    isPublic?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminPlanDefinitionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminPlanDefinition to aggregate.
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminPlanDefinitions to fetch.
     */
    orderBy?: AdminPlanDefinitionOrderByWithRelationInput | AdminPlanDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminPlanDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminPlanDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminPlanDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminPlanDefinitions
    **/
    _count?: true | AdminPlanDefinitionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminPlanDefinitionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminPlanDefinitionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminPlanDefinitionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminPlanDefinitionMaxAggregateInputType
  }

  export type GetAdminPlanDefinitionAggregateType<T extends AdminPlanDefinitionAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminPlanDefinition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminPlanDefinition[P]>
      : GetScalarType<T[P], AggregateAdminPlanDefinition[P]>
  }




  export type AdminPlanDefinitionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminPlanDefinitionWhereInput
    orderBy?: AdminPlanDefinitionOrderByWithAggregationInput | AdminPlanDefinitionOrderByWithAggregationInput[]
    by: AdminPlanDefinitionScalarFieldEnum[] | AdminPlanDefinitionScalarFieldEnum
    having?: AdminPlanDefinitionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminPlanDefinitionCountAggregateInputType | true
    _avg?: AdminPlanDefinitionAvgAggregateInputType
    _sum?: AdminPlanDefinitionSumAggregateInputType
    _min?: AdminPlanDefinitionMinAggregateInputType
    _max?: AdminPlanDefinitionMaxAggregateInputType
  }

  export type AdminPlanDefinitionGroupByOutputType = {
    id: string
    planKey: string
    displayName: string
    monthlyPrice: string
    yearlyPrice: string
    tagline: string
    bestFor: string
    merchantFacingHighlightsJson: string
    opsHighlightsJson: string
    isActive: boolean
    isPublic: boolean
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: AdminPlanDefinitionCountAggregateOutputType | null
    _avg: AdminPlanDefinitionAvgAggregateOutputType | null
    _sum: AdminPlanDefinitionSumAggregateOutputType | null
    _min: AdminPlanDefinitionMinAggregateOutputType | null
    _max: AdminPlanDefinitionMaxAggregateOutputType | null
  }

  type GetAdminPlanDefinitionGroupByPayload<T extends AdminPlanDefinitionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminPlanDefinitionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminPlanDefinitionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminPlanDefinitionGroupByOutputType[P]>
            : GetScalarType<T[P], AdminPlanDefinitionGroupByOutputType[P]>
        }
      >
    >


  export type AdminPlanDefinitionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planKey?: boolean
    displayName?: boolean
    monthlyPrice?: boolean
    yearlyPrice?: boolean
    tagline?: boolean
    bestFor?: boolean
    merchantFacingHighlightsJson?: boolean
    opsHighlightsJson?: boolean
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminPlanDefinition"]>

  export type AdminPlanDefinitionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planKey?: boolean
    displayName?: boolean
    monthlyPrice?: boolean
    yearlyPrice?: boolean
    tagline?: boolean
    bestFor?: boolean
    merchantFacingHighlightsJson?: boolean
    opsHighlightsJson?: boolean
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminPlanDefinition"]>

  export type AdminPlanDefinitionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planKey?: boolean
    displayName?: boolean
    monthlyPrice?: boolean
    yearlyPrice?: boolean
    tagline?: boolean
    bestFor?: boolean
    merchantFacingHighlightsJson?: boolean
    opsHighlightsJson?: boolean
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["adminPlanDefinition"]>

  export type AdminPlanDefinitionSelectScalar = {
    id?: boolean
    planKey?: boolean
    displayName?: boolean
    monthlyPrice?: boolean
    yearlyPrice?: boolean
    tagline?: boolean
    bestFor?: boolean
    merchantFacingHighlightsJson?: boolean
    opsHighlightsJson?: boolean
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminPlanDefinitionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "planKey" | "displayName" | "monthlyPrice" | "yearlyPrice" | "tagline" | "bestFor" | "merchantFacingHighlightsJson" | "opsHighlightsJson" | "isActive" | "isPublic" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["adminPlanDefinition"]>

  export type $AdminPlanDefinitionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminPlanDefinition"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      planKey: string
      displayName: string
      monthlyPrice: string
      yearlyPrice: string
      tagline: string
      bestFor: string
      merchantFacingHighlightsJson: string
      opsHighlightsJson: string
      isActive: boolean
      isPublic: boolean
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["adminPlanDefinition"]>
    composites: {}
  }

  type AdminPlanDefinitionGetPayload<S extends boolean | null | undefined | AdminPlanDefinitionDefaultArgs> = $Result.GetResult<Prisma.$AdminPlanDefinitionPayload, S>

  type AdminPlanDefinitionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminPlanDefinitionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminPlanDefinitionCountAggregateInputType | true
    }

  export interface AdminPlanDefinitionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminPlanDefinition'], meta: { name: 'AdminPlanDefinition' } }
    /**
     * Find zero or one AdminPlanDefinition that matches the filter.
     * @param {AdminPlanDefinitionFindUniqueArgs} args - Arguments to find a AdminPlanDefinition
     * @example
     * // Get one AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminPlanDefinitionFindUniqueArgs>(args: SelectSubset<T, AdminPlanDefinitionFindUniqueArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminPlanDefinition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminPlanDefinitionFindUniqueOrThrowArgs} args - Arguments to find a AdminPlanDefinition
     * @example
     * // Get one AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminPlanDefinitionFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminPlanDefinitionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminPlanDefinition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionFindFirstArgs} args - Arguments to find a AdminPlanDefinition
     * @example
     * // Get one AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminPlanDefinitionFindFirstArgs>(args?: SelectSubset<T, AdminPlanDefinitionFindFirstArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminPlanDefinition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionFindFirstOrThrowArgs} args - Arguments to find a AdminPlanDefinition
     * @example
     * // Get one AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminPlanDefinitionFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminPlanDefinitionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminPlanDefinitions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminPlanDefinitions
     * const adminPlanDefinitions = await prisma.adminPlanDefinition.findMany()
     * 
     * // Get first 10 AdminPlanDefinitions
     * const adminPlanDefinitions = await prisma.adminPlanDefinition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminPlanDefinitionWithIdOnly = await prisma.adminPlanDefinition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminPlanDefinitionFindManyArgs>(args?: SelectSubset<T, AdminPlanDefinitionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminPlanDefinition.
     * @param {AdminPlanDefinitionCreateArgs} args - Arguments to create a AdminPlanDefinition.
     * @example
     * // Create one AdminPlanDefinition
     * const AdminPlanDefinition = await prisma.adminPlanDefinition.create({
     *   data: {
     *     // ... data to create a AdminPlanDefinition
     *   }
     * })
     * 
     */
    create<T extends AdminPlanDefinitionCreateArgs>(args: SelectSubset<T, AdminPlanDefinitionCreateArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminPlanDefinitions.
     * @param {AdminPlanDefinitionCreateManyArgs} args - Arguments to create many AdminPlanDefinitions.
     * @example
     * // Create many AdminPlanDefinitions
     * const adminPlanDefinition = await prisma.adminPlanDefinition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminPlanDefinitionCreateManyArgs>(args?: SelectSubset<T, AdminPlanDefinitionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminPlanDefinitions and returns the data saved in the database.
     * @param {AdminPlanDefinitionCreateManyAndReturnArgs} args - Arguments to create many AdminPlanDefinitions.
     * @example
     * // Create many AdminPlanDefinitions
     * const adminPlanDefinition = await prisma.adminPlanDefinition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminPlanDefinitions and only return the `id`
     * const adminPlanDefinitionWithIdOnly = await prisma.adminPlanDefinition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminPlanDefinitionCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminPlanDefinitionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminPlanDefinition.
     * @param {AdminPlanDefinitionDeleteArgs} args - Arguments to delete one AdminPlanDefinition.
     * @example
     * // Delete one AdminPlanDefinition
     * const AdminPlanDefinition = await prisma.adminPlanDefinition.delete({
     *   where: {
     *     // ... filter to delete one AdminPlanDefinition
     *   }
     * })
     * 
     */
    delete<T extends AdminPlanDefinitionDeleteArgs>(args: SelectSubset<T, AdminPlanDefinitionDeleteArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminPlanDefinition.
     * @param {AdminPlanDefinitionUpdateArgs} args - Arguments to update one AdminPlanDefinition.
     * @example
     * // Update one AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminPlanDefinitionUpdateArgs>(args: SelectSubset<T, AdminPlanDefinitionUpdateArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminPlanDefinitions.
     * @param {AdminPlanDefinitionDeleteManyArgs} args - Arguments to filter AdminPlanDefinitions to delete.
     * @example
     * // Delete a few AdminPlanDefinitions
     * const { count } = await prisma.adminPlanDefinition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminPlanDefinitionDeleteManyArgs>(args?: SelectSubset<T, AdminPlanDefinitionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminPlanDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminPlanDefinitions
     * const adminPlanDefinition = await prisma.adminPlanDefinition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminPlanDefinitionUpdateManyArgs>(args: SelectSubset<T, AdminPlanDefinitionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminPlanDefinitions and returns the data updated in the database.
     * @param {AdminPlanDefinitionUpdateManyAndReturnArgs} args - Arguments to update many AdminPlanDefinitions.
     * @example
     * // Update many AdminPlanDefinitions
     * const adminPlanDefinition = await prisma.adminPlanDefinition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminPlanDefinitions and only return the `id`
     * const adminPlanDefinitionWithIdOnly = await prisma.adminPlanDefinition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminPlanDefinitionUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminPlanDefinitionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminPlanDefinition.
     * @param {AdminPlanDefinitionUpsertArgs} args - Arguments to update or create a AdminPlanDefinition.
     * @example
     * // Update or create a AdminPlanDefinition
     * const adminPlanDefinition = await prisma.adminPlanDefinition.upsert({
     *   create: {
     *     // ... data to create a AdminPlanDefinition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminPlanDefinition we want to update
     *   }
     * })
     */
    upsert<T extends AdminPlanDefinitionUpsertArgs>(args: SelectSubset<T, AdminPlanDefinitionUpsertArgs<ExtArgs>>): Prisma__AdminPlanDefinitionClient<$Result.GetResult<Prisma.$AdminPlanDefinitionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminPlanDefinitions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionCountArgs} args - Arguments to filter AdminPlanDefinitions to count.
     * @example
     * // Count the number of AdminPlanDefinitions
     * const count = await prisma.adminPlanDefinition.count({
     *   where: {
     *     // ... the filter for the AdminPlanDefinitions we want to count
     *   }
     * })
    **/
    count<T extends AdminPlanDefinitionCountArgs>(
      args?: Subset<T, AdminPlanDefinitionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminPlanDefinitionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminPlanDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminPlanDefinitionAggregateArgs>(args: Subset<T, AdminPlanDefinitionAggregateArgs>): Prisma.PrismaPromise<GetAdminPlanDefinitionAggregateType<T>>

    /**
     * Group by AdminPlanDefinition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminPlanDefinitionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminPlanDefinitionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminPlanDefinitionGroupByArgs['orderBy'] }
        : { orderBy?: AdminPlanDefinitionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminPlanDefinitionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminPlanDefinitionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminPlanDefinition model
   */
  readonly fields: AdminPlanDefinitionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminPlanDefinition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminPlanDefinitionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminPlanDefinition model
   */
  interface AdminPlanDefinitionFieldRefs {
    readonly id: FieldRef<"AdminPlanDefinition", 'String'>
    readonly planKey: FieldRef<"AdminPlanDefinition", 'String'>
    readonly displayName: FieldRef<"AdminPlanDefinition", 'String'>
    readonly monthlyPrice: FieldRef<"AdminPlanDefinition", 'String'>
    readonly yearlyPrice: FieldRef<"AdminPlanDefinition", 'String'>
    readonly tagline: FieldRef<"AdminPlanDefinition", 'String'>
    readonly bestFor: FieldRef<"AdminPlanDefinition", 'String'>
    readonly merchantFacingHighlightsJson: FieldRef<"AdminPlanDefinition", 'String'>
    readonly opsHighlightsJson: FieldRef<"AdminPlanDefinition", 'String'>
    readonly isActive: FieldRef<"AdminPlanDefinition", 'Boolean'>
    readonly isPublic: FieldRef<"AdminPlanDefinition", 'Boolean'>
    readonly sortOrder: FieldRef<"AdminPlanDefinition", 'Int'>
    readonly createdAt: FieldRef<"AdminPlanDefinition", 'DateTime'>
    readonly updatedAt: FieldRef<"AdminPlanDefinition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminPlanDefinition findUnique
   */
  export type AdminPlanDefinitionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which AdminPlanDefinition to fetch.
     */
    where: AdminPlanDefinitionWhereUniqueInput
  }

  /**
   * AdminPlanDefinition findUniqueOrThrow
   */
  export type AdminPlanDefinitionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which AdminPlanDefinition to fetch.
     */
    where: AdminPlanDefinitionWhereUniqueInput
  }

  /**
   * AdminPlanDefinition findFirst
   */
  export type AdminPlanDefinitionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which AdminPlanDefinition to fetch.
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminPlanDefinitions to fetch.
     */
    orderBy?: AdminPlanDefinitionOrderByWithRelationInput | AdminPlanDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminPlanDefinitions.
     */
    cursor?: AdminPlanDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminPlanDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminPlanDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminPlanDefinitions.
     */
    distinct?: AdminPlanDefinitionScalarFieldEnum | AdminPlanDefinitionScalarFieldEnum[]
  }

  /**
   * AdminPlanDefinition findFirstOrThrow
   */
  export type AdminPlanDefinitionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which AdminPlanDefinition to fetch.
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminPlanDefinitions to fetch.
     */
    orderBy?: AdminPlanDefinitionOrderByWithRelationInput | AdminPlanDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminPlanDefinitions.
     */
    cursor?: AdminPlanDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminPlanDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminPlanDefinitions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminPlanDefinitions.
     */
    distinct?: AdminPlanDefinitionScalarFieldEnum | AdminPlanDefinitionScalarFieldEnum[]
  }

  /**
   * AdminPlanDefinition findMany
   */
  export type AdminPlanDefinitionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter, which AdminPlanDefinitions to fetch.
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminPlanDefinitions to fetch.
     */
    orderBy?: AdminPlanDefinitionOrderByWithRelationInput | AdminPlanDefinitionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminPlanDefinitions.
     */
    cursor?: AdminPlanDefinitionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminPlanDefinitions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminPlanDefinitions.
     */
    skip?: number
    distinct?: AdminPlanDefinitionScalarFieldEnum | AdminPlanDefinitionScalarFieldEnum[]
  }

  /**
   * AdminPlanDefinition create
   */
  export type AdminPlanDefinitionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to create a AdminPlanDefinition.
     */
    data: XOR<AdminPlanDefinitionCreateInput, AdminPlanDefinitionUncheckedCreateInput>
  }

  /**
   * AdminPlanDefinition createMany
   */
  export type AdminPlanDefinitionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminPlanDefinitions.
     */
    data: AdminPlanDefinitionCreateManyInput | AdminPlanDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminPlanDefinition createManyAndReturn
   */
  export type AdminPlanDefinitionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * The data used to create many AdminPlanDefinitions.
     */
    data: AdminPlanDefinitionCreateManyInput | AdminPlanDefinitionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminPlanDefinition update
   */
  export type AdminPlanDefinitionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * The data needed to update a AdminPlanDefinition.
     */
    data: XOR<AdminPlanDefinitionUpdateInput, AdminPlanDefinitionUncheckedUpdateInput>
    /**
     * Choose, which AdminPlanDefinition to update.
     */
    where: AdminPlanDefinitionWhereUniqueInput
  }

  /**
   * AdminPlanDefinition updateMany
   */
  export type AdminPlanDefinitionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminPlanDefinitions.
     */
    data: XOR<AdminPlanDefinitionUpdateManyMutationInput, AdminPlanDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which AdminPlanDefinitions to update
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * Limit how many AdminPlanDefinitions to update.
     */
    limit?: number
  }

  /**
   * AdminPlanDefinition updateManyAndReturn
   */
  export type AdminPlanDefinitionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * The data used to update AdminPlanDefinitions.
     */
    data: XOR<AdminPlanDefinitionUpdateManyMutationInput, AdminPlanDefinitionUncheckedUpdateManyInput>
    /**
     * Filter which AdminPlanDefinitions to update
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * Limit how many AdminPlanDefinitions to update.
     */
    limit?: number
  }

  /**
   * AdminPlanDefinition upsert
   */
  export type AdminPlanDefinitionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * The filter to search for the AdminPlanDefinition to update in case it exists.
     */
    where: AdminPlanDefinitionWhereUniqueInput
    /**
     * In case the AdminPlanDefinition found by the `where` argument doesn't exist, create a new AdminPlanDefinition with this data.
     */
    create: XOR<AdminPlanDefinitionCreateInput, AdminPlanDefinitionUncheckedCreateInput>
    /**
     * In case the AdminPlanDefinition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminPlanDefinitionUpdateInput, AdminPlanDefinitionUncheckedUpdateInput>
  }

  /**
   * AdminPlanDefinition delete
   */
  export type AdminPlanDefinitionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
    /**
     * Filter which AdminPlanDefinition to delete.
     */
    where: AdminPlanDefinitionWhereUniqueInput
  }

  /**
   * AdminPlanDefinition deleteMany
   */
  export type AdminPlanDefinitionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminPlanDefinitions to delete
     */
    where?: AdminPlanDefinitionWhereInput
    /**
     * Limit how many AdminPlanDefinitions to delete.
     */
    limit?: number
  }

  /**
   * AdminPlanDefinition without action
   */
  export type AdminPlanDefinitionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminPlanDefinition
     */
    select?: AdminPlanDefinitionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminPlanDefinition
     */
    omit?: AdminPlanDefinitionOmit<ExtArgs> | null
  }


  /**
   * Model InternalAdminAccount
   */

  export type AggregateInternalAdminAccount = {
    _count: InternalAdminAccountCountAggregateOutputType | null
    _min: InternalAdminAccountMinAggregateOutputType | null
    _max: InternalAdminAccountMaxAggregateOutputType | null
  }

  export type InternalAdminAccountMinAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    passwordHash: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InternalAdminAccountMaxAggregateOutputType = {
    id: string | null
    email: string | null
    displayName: string | null
    passwordHash: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type InternalAdminAccountCountAggregateOutputType = {
    id: number
    email: number
    displayName: number
    passwordHash: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type InternalAdminAccountMinAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InternalAdminAccountMaxAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type InternalAdminAccountCountAggregateInputType = {
    id?: true
    email?: true
    displayName?: true
    passwordHash?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type InternalAdminAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InternalAdminAccount to aggregate.
     */
    where?: InternalAdminAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternalAdminAccounts to fetch.
     */
    orderBy?: InternalAdminAccountOrderByWithRelationInput | InternalAdminAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InternalAdminAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternalAdminAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternalAdminAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InternalAdminAccounts
    **/
    _count?: true | InternalAdminAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InternalAdminAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InternalAdminAccountMaxAggregateInputType
  }

  export type GetInternalAdminAccountAggregateType<T extends InternalAdminAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateInternalAdminAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInternalAdminAccount[P]>
      : GetScalarType<T[P], AggregateInternalAdminAccount[P]>
  }




  export type InternalAdminAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InternalAdminAccountWhereInput
    orderBy?: InternalAdminAccountOrderByWithAggregationInput | InternalAdminAccountOrderByWithAggregationInput[]
    by: InternalAdminAccountScalarFieldEnum[] | InternalAdminAccountScalarFieldEnum
    having?: InternalAdminAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InternalAdminAccountCountAggregateInputType | true
    _min?: InternalAdminAccountMinAggregateInputType
    _max?: InternalAdminAccountMaxAggregateInputType
  }

  export type InternalAdminAccountGroupByOutputType = {
    id: string
    email: string
    displayName: string
    passwordHash: string
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: InternalAdminAccountCountAggregateOutputType | null
    _min: InternalAdminAccountMinAggregateOutputType | null
    _max: InternalAdminAccountMaxAggregateOutputType | null
  }

  type GetInternalAdminAccountGroupByPayload<T extends InternalAdminAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InternalAdminAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InternalAdminAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InternalAdminAccountGroupByOutputType[P]>
            : GetScalarType<T[P], InternalAdminAccountGroupByOutputType[P]>
        }
      >
    >


  export type InternalAdminAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["internalAdminAccount"]>

  export type InternalAdminAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["internalAdminAccount"]>

  export type InternalAdminAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["internalAdminAccount"]>

  export type InternalAdminAccountSelectScalar = {
    id?: boolean
    email?: boolean
    displayName?: boolean
    passwordHash?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type InternalAdminAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "displayName" | "passwordHash" | "isActive" | "lastLoginAt" | "createdAt" | "updatedAt", ExtArgs["result"]["internalAdminAccount"]>

  export type $InternalAdminAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InternalAdminAccount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      displayName: string
      passwordHash: string
      isActive: boolean
      lastLoginAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["internalAdminAccount"]>
    composites: {}
  }

  type InternalAdminAccountGetPayload<S extends boolean | null | undefined | InternalAdminAccountDefaultArgs> = $Result.GetResult<Prisma.$InternalAdminAccountPayload, S>

  type InternalAdminAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InternalAdminAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InternalAdminAccountCountAggregateInputType | true
    }

  export interface InternalAdminAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InternalAdminAccount'], meta: { name: 'InternalAdminAccount' } }
    /**
     * Find zero or one InternalAdminAccount that matches the filter.
     * @param {InternalAdminAccountFindUniqueArgs} args - Arguments to find a InternalAdminAccount
     * @example
     * // Get one InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InternalAdminAccountFindUniqueArgs>(args: SelectSubset<T, InternalAdminAccountFindUniqueArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InternalAdminAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InternalAdminAccountFindUniqueOrThrowArgs} args - Arguments to find a InternalAdminAccount
     * @example
     * // Get one InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InternalAdminAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, InternalAdminAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InternalAdminAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountFindFirstArgs} args - Arguments to find a InternalAdminAccount
     * @example
     * // Get one InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InternalAdminAccountFindFirstArgs>(args?: SelectSubset<T, InternalAdminAccountFindFirstArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InternalAdminAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountFindFirstOrThrowArgs} args - Arguments to find a InternalAdminAccount
     * @example
     * // Get one InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InternalAdminAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, InternalAdminAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InternalAdminAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InternalAdminAccounts
     * const internalAdminAccounts = await prisma.internalAdminAccount.findMany()
     * 
     * // Get first 10 InternalAdminAccounts
     * const internalAdminAccounts = await prisma.internalAdminAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const internalAdminAccountWithIdOnly = await prisma.internalAdminAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InternalAdminAccountFindManyArgs>(args?: SelectSubset<T, InternalAdminAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InternalAdminAccount.
     * @param {InternalAdminAccountCreateArgs} args - Arguments to create a InternalAdminAccount.
     * @example
     * // Create one InternalAdminAccount
     * const InternalAdminAccount = await prisma.internalAdminAccount.create({
     *   data: {
     *     // ... data to create a InternalAdminAccount
     *   }
     * })
     * 
     */
    create<T extends InternalAdminAccountCreateArgs>(args: SelectSubset<T, InternalAdminAccountCreateArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InternalAdminAccounts.
     * @param {InternalAdminAccountCreateManyArgs} args - Arguments to create many InternalAdminAccounts.
     * @example
     * // Create many InternalAdminAccounts
     * const internalAdminAccount = await prisma.internalAdminAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InternalAdminAccountCreateManyArgs>(args?: SelectSubset<T, InternalAdminAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InternalAdminAccounts and returns the data saved in the database.
     * @param {InternalAdminAccountCreateManyAndReturnArgs} args - Arguments to create many InternalAdminAccounts.
     * @example
     * // Create many InternalAdminAccounts
     * const internalAdminAccount = await prisma.internalAdminAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InternalAdminAccounts and only return the `id`
     * const internalAdminAccountWithIdOnly = await prisma.internalAdminAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InternalAdminAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, InternalAdminAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InternalAdminAccount.
     * @param {InternalAdminAccountDeleteArgs} args - Arguments to delete one InternalAdminAccount.
     * @example
     * // Delete one InternalAdminAccount
     * const InternalAdminAccount = await prisma.internalAdminAccount.delete({
     *   where: {
     *     // ... filter to delete one InternalAdminAccount
     *   }
     * })
     * 
     */
    delete<T extends InternalAdminAccountDeleteArgs>(args: SelectSubset<T, InternalAdminAccountDeleteArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InternalAdminAccount.
     * @param {InternalAdminAccountUpdateArgs} args - Arguments to update one InternalAdminAccount.
     * @example
     * // Update one InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InternalAdminAccountUpdateArgs>(args: SelectSubset<T, InternalAdminAccountUpdateArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InternalAdminAccounts.
     * @param {InternalAdminAccountDeleteManyArgs} args - Arguments to filter InternalAdminAccounts to delete.
     * @example
     * // Delete a few InternalAdminAccounts
     * const { count } = await prisma.internalAdminAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InternalAdminAccountDeleteManyArgs>(args?: SelectSubset<T, InternalAdminAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InternalAdminAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InternalAdminAccounts
     * const internalAdminAccount = await prisma.internalAdminAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InternalAdminAccountUpdateManyArgs>(args: SelectSubset<T, InternalAdminAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InternalAdminAccounts and returns the data updated in the database.
     * @param {InternalAdminAccountUpdateManyAndReturnArgs} args - Arguments to update many InternalAdminAccounts.
     * @example
     * // Update many InternalAdminAccounts
     * const internalAdminAccount = await prisma.internalAdminAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InternalAdminAccounts and only return the `id`
     * const internalAdminAccountWithIdOnly = await prisma.internalAdminAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InternalAdminAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, InternalAdminAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InternalAdminAccount.
     * @param {InternalAdminAccountUpsertArgs} args - Arguments to update or create a InternalAdminAccount.
     * @example
     * // Update or create a InternalAdminAccount
     * const internalAdminAccount = await prisma.internalAdminAccount.upsert({
     *   create: {
     *     // ... data to create a InternalAdminAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InternalAdminAccount we want to update
     *   }
     * })
     */
    upsert<T extends InternalAdminAccountUpsertArgs>(args: SelectSubset<T, InternalAdminAccountUpsertArgs<ExtArgs>>): Prisma__InternalAdminAccountClient<$Result.GetResult<Prisma.$InternalAdminAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InternalAdminAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountCountArgs} args - Arguments to filter InternalAdminAccounts to count.
     * @example
     * // Count the number of InternalAdminAccounts
     * const count = await prisma.internalAdminAccount.count({
     *   where: {
     *     // ... the filter for the InternalAdminAccounts we want to count
     *   }
     * })
    **/
    count<T extends InternalAdminAccountCountArgs>(
      args?: Subset<T, InternalAdminAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InternalAdminAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InternalAdminAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InternalAdminAccountAggregateArgs>(args: Subset<T, InternalAdminAccountAggregateArgs>): Prisma.PrismaPromise<GetInternalAdminAccountAggregateType<T>>

    /**
     * Group by InternalAdminAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InternalAdminAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InternalAdminAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InternalAdminAccountGroupByArgs['orderBy'] }
        : { orderBy?: InternalAdminAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InternalAdminAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInternalAdminAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InternalAdminAccount model
   */
  readonly fields: InternalAdminAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InternalAdminAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InternalAdminAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InternalAdminAccount model
   */
  interface InternalAdminAccountFieldRefs {
    readonly id: FieldRef<"InternalAdminAccount", 'String'>
    readonly email: FieldRef<"InternalAdminAccount", 'String'>
    readonly displayName: FieldRef<"InternalAdminAccount", 'String'>
    readonly passwordHash: FieldRef<"InternalAdminAccount", 'String'>
    readonly isActive: FieldRef<"InternalAdminAccount", 'Boolean'>
    readonly lastLoginAt: FieldRef<"InternalAdminAccount", 'DateTime'>
    readonly createdAt: FieldRef<"InternalAdminAccount", 'DateTime'>
    readonly updatedAt: FieldRef<"InternalAdminAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InternalAdminAccount findUnique
   */
  export type InternalAdminAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter, which InternalAdminAccount to fetch.
     */
    where: InternalAdminAccountWhereUniqueInput
  }

  /**
   * InternalAdminAccount findUniqueOrThrow
   */
  export type InternalAdminAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter, which InternalAdminAccount to fetch.
     */
    where: InternalAdminAccountWhereUniqueInput
  }

  /**
   * InternalAdminAccount findFirst
   */
  export type InternalAdminAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter, which InternalAdminAccount to fetch.
     */
    where?: InternalAdminAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternalAdminAccounts to fetch.
     */
    orderBy?: InternalAdminAccountOrderByWithRelationInput | InternalAdminAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InternalAdminAccounts.
     */
    cursor?: InternalAdminAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternalAdminAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternalAdminAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InternalAdminAccounts.
     */
    distinct?: InternalAdminAccountScalarFieldEnum | InternalAdminAccountScalarFieldEnum[]
  }

  /**
   * InternalAdminAccount findFirstOrThrow
   */
  export type InternalAdminAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter, which InternalAdminAccount to fetch.
     */
    where?: InternalAdminAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternalAdminAccounts to fetch.
     */
    orderBy?: InternalAdminAccountOrderByWithRelationInput | InternalAdminAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InternalAdminAccounts.
     */
    cursor?: InternalAdminAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternalAdminAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternalAdminAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InternalAdminAccounts.
     */
    distinct?: InternalAdminAccountScalarFieldEnum | InternalAdminAccountScalarFieldEnum[]
  }

  /**
   * InternalAdminAccount findMany
   */
  export type InternalAdminAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter, which InternalAdminAccounts to fetch.
     */
    where?: InternalAdminAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InternalAdminAccounts to fetch.
     */
    orderBy?: InternalAdminAccountOrderByWithRelationInput | InternalAdminAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InternalAdminAccounts.
     */
    cursor?: InternalAdminAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InternalAdminAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InternalAdminAccounts.
     */
    skip?: number
    distinct?: InternalAdminAccountScalarFieldEnum | InternalAdminAccountScalarFieldEnum[]
  }

  /**
   * InternalAdminAccount create
   */
  export type InternalAdminAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * The data needed to create a InternalAdminAccount.
     */
    data: XOR<InternalAdminAccountCreateInput, InternalAdminAccountUncheckedCreateInput>
  }

  /**
   * InternalAdminAccount createMany
   */
  export type InternalAdminAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InternalAdminAccounts.
     */
    data: InternalAdminAccountCreateManyInput | InternalAdminAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InternalAdminAccount createManyAndReturn
   */
  export type InternalAdminAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * The data used to create many InternalAdminAccounts.
     */
    data: InternalAdminAccountCreateManyInput | InternalAdminAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InternalAdminAccount update
   */
  export type InternalAdminAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * The data needed to update a InternalAdminAccount.
     */
    data: XOR<InternalAdminAccountUpdateInput, InternalAdminAccountUncheckedUpdateInput>
    /**
     * Choose, which InternalAdminAccount to update.
     */
    where: InternalAdminAccountWhereUniqueInput
  }

  /**
   * InternalAdminAccount updateMany
   */
  export type InternalAdminAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InternalAdminAccounts.
     */
    data: XOR<InternalAdminAccountUpdateManyMutationInput, InternalAdminAccountUncheckedUpdateManyInput>
    /**
     * Filter which InternalAdminAccounts to update
     */
    where?: InternalAdminAccountWhereInput
    /**
     * Limit how many InternalAdminAccounts to update.
     */
    limit?: number
  }

  /**
   * InternalAdminAccount updateManyAndReturn
   */
  export type InternalAdminAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * The data used to update InternalAdminAccounts.
     */
    data: XOR<InternalAdminAccountUpdateManyMutationInput, InternalAdminAccountUncheckedUpdateManyInput>
    /**
     * Filter which InternalAdminAccounts to update
     */
    where?: InternalAdminAccountWhereInput
    /**
     * Limit how many InternalAdminAccounts to update.
     */
    limit?: number
  }

  /**
   * InternalAdminAccount upsert
   */
  export type InternalAdminAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * The filter to search for the InternalAdminAccount to update in case it exists.
     */
    where: InternalAdminAccountWhereUniqueInput
    /**
     * In case the InternalAdminAccount found by the `where` argument doesn't exist, create a new InternalAdminAccount with this data.
     */
    create: XOR<InternalAdminAccountCreateInput, InternalAdminAccountUncheckedCreateInput>
    /**
     * In case the InternalAdminAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InternalAdminAccountUpdateInput, InternalAdminAccountUncheckedUpdateInput>
  }

  /**
   * InternalAdminAccount delete
   */
  export type InternalAdminAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
    /**
     * Filter which InternalAdminAccount to delete.
     */
    where: InternalAdminAccountWhereUniqueInput
  }

  /**
   * InternalAdminAccount deleteMany
   */
  export type InternalAdminAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InternalAdminAccounts to delete
     */
    where?: InternalAdminAccountWhereInput
    /**
     * Limit how many InternalAdminAccounts to delete.
     */
    limit?: number
  }

  /**
   * InternalAdminAccount without action
   */
  export type InternalAdminAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InternalAdminAccount
     */
    select?: InternalAdminAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InternalAdminAccount
     */
    omit?: InternalAdminAccountOmit<ExtArgs> | null
  }


  /**
   * Model SubscriptionRule
   */

  export type AggregateSubscriptionRule = {
    _count: SubscriptionRuleCountAggregateOutputType | null
    _min: SubscriptionRuleMinAggregateOutputType | null
    _max: SubscriptionRuleMaxAggregateOutputType | null
  }

  export type SubscriptionRuleMinAggregateOutputType = {
    id: string | null
    shop: string | null
    title: string | null
    internalName: string | null
    planSelectorLabel: string | null
    discountType: string | null
    discountValue: string | null
    planIntervalsJson: string | null
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    productScope: string | null
    explicitProductGidsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionRuleMaxAggregateOutputType = {
    id: string | null
    shop: string | null
    title: string | null
    internalName: string | null
    planSelectorLabel: string | null
    discountType: string | null
    discountValue: string | null
    planIntervalsJson: string | null
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    productScope: string | null
    explicitProductGidsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionRuleCountAggregateOutputType = {
    id: number
    shop: number
    title: number
    internalName: number
    planSelectorLabel: number
    discountType: number
    discountValue: number
    planIntervalsJson: number
    sellingPlanGroupGid: number
    defaultSellingPlanGid: number
    productScope: number
    explicitProductGidsJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionRuleMinAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    internalName?: true
    planSelectorLabel?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    productScope?: true
    explicitProductGidsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionRuleMaxAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    internalName?: true
    planSelectorLabel?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    productScope?: true
    explicitProductGidsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionRuleCountAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    internalName?: true
    planSelectorLabel?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    productScope?: true
    explicitProductGidsJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionRule to aggregate.
     */
    where?: SubscriptionRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionRules to fetch.
     */
    orderBy?: SubscriptionRuleOrderByWithRelationInput | SubscriptionRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionRules
    **/
    _count?: true | SubscriptionRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionRuleMaxAggregateInputType
  }

  export type GetSubscriptionRuleAggregateType<T extends SubscriptionRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionRule[P]>
      : GetScalarType<T[P], AggregateSubscriptionRule[P]>
  }




  export type SubscriptionRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionRuleWhereInput
    orderBy?: SubscriptionRuleOrderByWithAggregationInput | SubscriptionRuleOrderByWithAggregationInput[]
    by: SubscriptionRuleScalarFieldEnum[] | SubscriptionRuleScalarFieldEnum
    having?: SubscriptionRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionRuleCountAggregateInputType | true
    _min?: SubscriptionRuleMinAggregateInputType
    _max?: SubscriptionRuleMaxAggregateInputType
  }

  export type SubscriptionRuleGroupByOutputType = {
    id: string
    shop: string
    title: string
    internalName: string | null
    planSelectorLabel: string
    discountType: string
    discountValue: string
    planIntervalsJson: string
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    productScope: string
    explicitProductGidsJson: string
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionRuleCountAggregateOutputType | null
    _min: SubscriptionRuleMinAggregateOutputType | null
    _max: SubscriptionRuleMaxAggregateOutputType | null
  }

  type GetSubscriptionRuleGroupByPayload<T extends SubscriptionRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionRuleGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionRuleGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    internalName?: boolean
    planSelectorLabel?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    productScope?: boolean
    explicitProductGidsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionRule"]>

  export type SubscriptionRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    internalName?: boolean
    planSelectorLabel?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    productScope?: boolean
    explicitProductGidsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionRule"]>

  export type SubscriptionRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    internalName?: boolean
    planSelectorLabel?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    productScope?: boolean
    explicitProductGidsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionRule"]>

  export type SubscriptionRuleSelectScalar = {
    id?: boolean
    shop?: boolean
    title?: boolean
    internalName?: boolean
    planSelectorLabel?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    productScope?: boolean
    explicitProductGidsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shop" | "title" | "internalName" | "planSelectorLabel" | "discountType" | "discountValue" | "planIntervalsJson" | "sellingPlanGroupGid" | "defaultSellingPlanGid" | "productScope" | "explicitProductGidsJson" | "createdAt" | "updatedAt", ExtArgs["result"]["subscriptionRule"]>

  export type $SubscriptionRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shop: string
      /**
       * Tên hiển thị (vd. Subscribe & save)
       */
      title: string
      internalName: string | null
      /**
       * Nhãn trước dropdown tần suất (vd. Deliver every)
       */
      planSelectorLabel: string
      discountType: string
      discountValue: string
      planIntervalsJson: string
      sellingPlanGroupGid: string | null
      defaultSellingPlanGid: string | null
      /**
       * WIDGET_ENABLED = mọi sản phẩm trong WidgetEnabledProduct; EXPLICIT = explicitProductGidsJson
       */
      productScope: string
      explicitProductGidsJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscriptionRule"]>
    composites: {}
  }

  type SubscriptionRuleGetPayload<S extends boolean | null | undefined | SubscriptionRuleDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionRulePayload, S>

  type SubscriptionRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionRuleCountAggregateInputType | true
    }

  export interface SubscriptionRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionRule'], meta: { name: 'SubscriptionRule' } }
    /**
     * Find zero or one SubscriptionRule that matches the filter.
     * @param {SubscriptionRuleFindUniqueArgs} args - Arguments to find a SubscriptionRule
     * @example
     * // Get one SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionRuleFindUniqueArgs>(args: SelectSubset<T, SubscriptionRuleFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionRuleFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionRule
     * @example
     * // Get one SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleFindFirstArgs} args - Arguments to find a SubscriptionRule
     * @example
     * // Get one SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionRuleFindFirstArgs>(args?: SelectSubset<T, SubscriptionRuleFindFirstArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleFindFirstOrThrowArgs} args - Arguments to find a SubscriptionRule
     * @example
     * // Get one SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionRules
     * const subscriptionRules = await prisma.subscriptionRule.findMany()
     * 
     * // Get first 10 SubscriptionRules
     * const subscriptionRules = await prisma.subscriptionRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionRuleWithIdOnly = await prisma.subscriptionRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionRuleFindManyArgs>(args?: SelectSubset<T, SubscriptionRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionRule.
     * @param {SubscriptionRuleCreateArgs} args - Arguments to create a SubscriptionRule.
     * @example
     * // Create one SubscriptionRule
     * const SubscriptionRule = await prisma.subscriptionRule.create({
     *   data: {
     *     // ... data to create a SubscriptionRule
     *   }
     * })
     * 
     */
    create<T extends SubscriptionRuleCreateArgs>(args: SelectSubset<T, SubscriptionRuleCreateArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionRules.
     * @param {SubscriptionRuleCreateManyArgs} args - Arguments to create many SubscriptionRules.
     * @example
     * // Create many SubscriptionRules
     * const subscriptionRule = await prisma.subscriptionRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionRuleCreateManyArgs>(args?: SelectSubset<T, SubscriptionRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionRules and returns the data saved in the database.
     * @param {SubscriptionRuleCreateManyAndReturnArgs} args - Arguments to create many SubscriptionRules.
     * @example
     * // Create many SubscriptionRules
     * const subscriptionRule = await prisma.subscriptionRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionRules and only return the `id`
     * const subscriptionRuleWithIdOnly = await prisma.subscriptionRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionRule.
     * @param {SubscriptionRuleDeleteArgs} args - Arguments to delete one SubscriptionRule.
     * @example
     * // Delete one SubscriptionRule
     * const SubscriptionRule = await prisma.subscriptionRule.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionRule
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionRuleDeleteArgs>(args: SelectSubset<T, SubscriptionRuleDeleteArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionRule.
     * @param {SubscriptionRuleUpdateArgs} args - Arguments to update one SubscriptionRule.
     * @example
     * // Update one SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionRuleUpdateArgs>(args: SelectSubset<T, SubscriptionRuleUpdateArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionRules.
     * @param {SubscriptionRuleDeleteManyArgs} args - Arguments to filter SubscriptionRules to delete.
     * @example
     * // Delete a few SubscriptionRules
     * const { count } = await prisma.subscriptionRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionRuleDeleteManyArgs>(args?: SelectSubset<T, SubscriptionRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionRules
     * const subscriptionRule = await prisma.subscriptionRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionRuleUpdateManyArgs>(args: SelectSubset<T, SubscriptionRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionRules and returns the data updated in the database.
     * @param {SubscriptionRuleUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionRules.
     * @example
     * // Update many SubscriptionRules
     * const subscriptionRule = await prisma.subscriptionRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionRules and only return the `id`
     * const subscriptionRuleWithIdOnly = await prisma.subscriptionRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionRule.
     * @param {SubscriptionRuleUpsertArgs} args - Arguments to update or create a SubscriptionRule.
     * @example
     * // Update or create a SubscriptionRule
     * const subscriptionRule = await prisma.subscriptionRule.upsert({
     *   create: {
     *     // ... data to create a SubscriptionRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionRule we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionRuleUpsertArgs>(args: SelectSubset<T, SubscriptionRuleUpsertArgs<ExtArgs>>): Prisma__SubscriptionRuleClient<$Result.GetResult<Prisma.$SubscriptionRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleCountArgs} args - Arguments to filter SubscriptionRules to count.
     * @example
     * // Count the number of SubscriptionRules
     * const count = await prisma.subscriptionRule.count({
     *   where: {
     *     // ... the filter for the SubscriptionRules we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionRuleCountArgs>(
      args?: Subset<T, SubscriptionRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionRuleAggregateArgs>(args: Subset<T, SubscriptionRuleAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionRuleAggregateType<T>>

    /**
     * Group by SubscriptionRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionRuleGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionRule model
   */
  readonly fields: SubscriptionRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionRule model
   */
  interface SubscriptionRuleFieldRefs {
    readonly id: FieldRef<"SubscriptionRule", 'String'>
    readonly shop: FieldRef<"SubscriptionRule", 'String'>
    readonly title: FieldRef<"SubscriptionRule", 'String'>
    readonly internalName: FieldRef<"SubscriptionRule", 'String'>
    readonly planSelectorLabel: FieldRef<"SubscriptionRule", 'String'>
    readonly discountType: FieldRef<"SubscriptionRule", 'String'>
    readonly discountValue: FieldRef<"SubscriptionRule", 'String'>
    readonly planIntervalsJson: FieldRef<"SubscriptionRule", 'String'>
    readonly sellingPlanGroupGid: FieldRef<"SubscriptionRule", 'String'>
    readonly defaultSellingPlanGid: FieldRef<"SubscriptionRule", 'String'>
    readonly productScope: FieldRef<"SubscriptionRule", 'String'>
    readonly explicitProductGidsJson: FieldRef<"SubscriptionRule", 'String'>
    readonly createdAt: FieldRef<"SubscriptionRule", 'DateTime'>
    readonly updatedAt: FieldRef<"SubscriptionRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionRule findUnique
   */
  export type SubscriptionRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionRule to fetch.
     */
    where: SubscriptionRuleWhereUniqueInput
  }

  /**
   * SubscriptionRule findUniqueOrThrow
   */
  export type SubscriptionRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionRule to fetch.
     */
    where: SubscriptionRuleWhereUniqueInput
  }

  /**
   * SubscriptionRule findFirst
   */
  export type SubscriptionRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionRule to fetch.
     */
    where?: SubscriptionRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionRules to fetch.
     */
    orderBy?: SubscriptionRuleOrderByWithRelationInput | SubscriptionRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionRules.
     */
    cursor?: SubscriptionRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionRules.
     */
    distinct?: SubscriptionRuleScalarFieldEnum | SubscriptionRuleScalarFieldEnum[]
  }

  /**
   * SubscriptionRule findFirstOrThrow
   */
  export type SubscriptionRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionRule to fetch.
     */
    where?: SubscriptionRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionRules to fetch.
     */
    orderBy?: SubscriptionRuleOrderByWithRelationInput | SubscriptionRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionRules.
     */
    cursor?: SubscriptionRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionRules.
     */
    distinct?: SubscriptionRuleScalarFieldEnum | SubscriptionRuleScalarFieldEnum[]
  }

  /**
   * SubscriptionRule findMany
   */
  export type SubscriptionRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionRules to fetch.
     */
    where?: SubscriptionRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionRules to fetch.
     */
    orderBy?: SubscriptionRuleOrderByWithRelationInput | SubscriptionRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionRules.
     */
    cursor?: SubscriptionRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionRules.
     */
    skip?: number
    distinct?: SubscriptionRuleScalarFieldEnum | SubscriptionRuleScalarFieldEnum[]
  }

  /**
   * SubscriptionRule create
   */
  export type SubscriptionRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionRule.
     */
    data: XOR<SubscriptionRuleCreateInput, SubscriptionRuleUncheckedCreateInput>
  }

  /**
   * SubscriptionRule createMany
   */
  export type SubscriptionRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionRules.
     */
    data: SubscriptionRuleCreateManyInput | SubscriptionRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionRule createManyAndReturn
   */
  export type SubscriptionRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionRules.
     */
    data: SubscriptionRuleCreateManyInput | SubscriptionRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionRule update
   */
  export type SubscriptionRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionRule.
     */
    data: XOR<SubscriptionRuleUpdateInput, SubscriptionRuleUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionRule to update.
     */
    where: SubscriptionRuleWhereUniqueInput
  }

  /**
   * SubscriptionRule updateMany
   */
  export type SubscriptionRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionRules.
     */
    data: XOR<SubscriptionRuleUpdateManyMutationInput, SubscriptionRuleUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionRules to update
     */
    where?: SubscriptionRuleWhereInput
    /**
     * Limit how many SubscriptionRules to update.
     */
    limit?: number
  }

  /**
   * SubscriptionRule updateManyAndReturn
   */
  export type SubscriptionRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionRules.
     */
    data: XOR<SubscriptionRuleUpdateManyMutationInput, SubscriptionRuleUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionRules to update
     */
    where?: SubscriptionRuleWhereInput
    /**
     * Limit how many SubscriptionRules to update.
     */
    limit?: number
  }

  /**
   * SubscriptionRule upsert
   */
  export type SubscriptionRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionRule to update in case it exists.
     */
    where: SubscriptionRuleWhereUniqueInput
    /**
     * In case the SubscriptionRule found by the `where` argument doesn't exist, create a new SubscriptionRule with this data.
     */
    create: XOR<SubscriptionRuleCreateInput, SubscriptionRuleUncheckedCreateInput>
    /**
     * In case the SubscriptionRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionRuleUpdateInput, SubscriptionRuleUncheckedUpdateInput>
  }

  /**
   * SubscriptionRule delete
   */
  export type SubscriptionRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
    /**
     * Filter which SubscriptionRule to delete.
     */
    where: SubscriptionRuleWhereUniqueInput
  }

  /**
   * SubscriptionRule deleteMany
   */
  export type SubscriptionRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionRules to delete
     */
    where?: SubscriptionRuleWhereInput
    /**
     * Limit how many SubscriptionRules to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionRule without action
   */
  export type SubscriptionRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionRule
     */
    select?: SubscriptionRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionRule
     */
    omit?: SubscriptionRuleOmit<ExtArgs> | null
  }


  /**
   * Model SubscriptionOffer
   */

  export type AggregateSubscriptionOffer = {
    _count: SubscriptionOfferCountAggregateOutputType | null
    _min: SubscriptionOfferMinAggregateOutputType | null
    _max: SubscriptionOfferMaxAggregateOutputType | null
  }

  export type SubscriptionOfferMinAggregateOutputType = {
    id: string | null
    shop: string | null
    title: string | null
    productGid: string | null
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    discountType: string | null
    discountValue: string | null
    planIntervalsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionOfferMaxAggregateOutputType = {
    id: string | null
    shop: string | null
    title: string | null
    productGid: string | null
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    discountType: string | null
    discountValue: string | null
    planIntervalsJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SubscriptionOfferCountAggregateOutputType = {
    id: number
    shop: number
    title: number
    productGid: number
    sellingPlanGroupGid: number
    defaultSellingPlanGid: number
    discountType: number
    discountValue: number
    planIntervalsJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SubscriptionOfferMinAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    productGid?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionOfferMaxAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    productGid?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SubscriptionOfferCountAggregateInputType = {
    id?: true
    shop?: true
    title?: true
    productGid?: true
    sellingPlanGroupGid?: true
    defaultSellingPlanGid?: true
    discountType?: true
    discountValue?: true
    planIntervalsJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SubscriptionOfferAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionOffer to aggregate.
     */
    where?: SubscriptionOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionOffers to fetch.
     */
    orderBy?: SubscriptionOfferOrderByWithRelationInput | SubscriptionOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubscriptionOffers
    **/
    _count?: true | SubscriptionOfferCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionOfferMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionOfferMaxAggregateInputType
  }

  export type GetSubscriptionOfferAggregateType<T extends SubscriptionOfferAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscriptionOffer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscriptionOffer[P]>
      : GetScalarType<T[P], AggregateSubscriptionOffer[P]>
  }




  export type SubscriptionOfferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionOfferWhereInput
    orderBy?: SubscriptionOfferOrderByWithAggregationInput | SubscriptionOfferOrderByWithAggregationInput[]
    by: SubscriptionOfferScalarFieldEnum[] | SubscriptionOfferScalarFieldEnum
    having?: SubscriptionOfferScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionOfferCountAggregateInputType | true
    _min?: SubscriptionOfferMinAggregateInputType
    _max?: SubscriptionOfferMaxAggregateInputType
  }

  export type SubscriptionOfferGroupByOutputType = {
    id: string
    shop: string
    title: string
    productGid: string
    sellingPlanGroupGid: string | null
    defaultSellingPlanGid: string | null
    discountType: string
    discountValue: string
    planIntervalsJson: string
    createdAt: Date
    updatedAt: Date
    _count: SubscriptionOfferCountAggregateOutputType | null
    _min: SubscriptionOfferMinAggregateOutputType | null
    _max: SubscriptionOfferMaxAggregateOutputType | null
  }

  type GetSubscriptionOfferGroupByPayload<T extends SubscriptionOfferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionOfferGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionOfferGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionOfferGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionOfferGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionOfferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    productGid?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionOffer"]>

  export type SubscriptionOfferSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    productGid?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionOffer"]>

  export type SubscriptionOfferSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    title?: boolean
    productGid?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["subscriptionOffer"]>

  export type SubscriptionOfferSelectScalar = {
    id?: boolean
    shop?: boolean
    title?: boolean
    productGid?: boolean
    sellingPlanGroupGid?: boolean
    defaultSellingPlanGid?: boolean
    discountType?: boolean
    discountValue?: boolean
    planIntervalsJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SubscriptionOfferOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shop" | "title" | "productGid" | "sellingPlanGroupGid" | "defaultSellingPlanGid" | "discountType" | "discountValue" | "planIntervalsJson" | "createdAt" | "updatedAt", ExtArgs["result"]["subscriptionOffer"]>

  export type $SubscriptionOfferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubscriptionOffer"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shop: string
      title: string
      productGid: string
      sellingPlanGroupGid: string | null
      defaultSellingPlanGid: string | null
      discountType: string
      discountValue: string
      /**
       * JSON: [{ "interval": "WEEK"|"MONTH"|"DAY", "intervalCount": number, "label": string }]
       */
      planIntervalsJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["subscriptionOffer"]>
    composites: {}
  }

  type SubscriptionOfferGetPayload<S extends boolean | null | undefined | SubscriptionOfferDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionOfferPayload, S>

  type SubscriptionOfferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionOfferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionOfferCountAggregateInputType | true
    }

  export interface SubscriptionOfferDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionOffer'], meta: { name: 'SubscriptionOffer' } }
    /**
     * Find zero or one SubscriptionOffer that matches the filter.
     * @param {SubscriptionOfferFindUniqueArgs} args - Arguments to find a SubscriptionOffer
     * @example
     * // Get one SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionOfferFindUniqueArgs>(args: SelectSubset<T, SubscriptionOfferFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SubscriptionOffer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionOfferFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionOffer
     * @example
     * // Get one SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionOfferFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionOfferFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionOffer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferFindFirstArgs} args - Arguments to find a SubscriptionOffer
     * @example
     * // Get one SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionOfferFindFirstArgs>(args?: SelectSubset<T, SubscriptionOfferFindFirstArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SubscriptionOffer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferFindFirstOrThrowArgs} args - Arguments to find a SubscriptionOffer
     * @example
     * // Get one SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionOfferFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionOfferFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SubscriptionOffers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionOffers
     * const subscriptionOffers = await prisma.subscriptionOffer.findMany()
     * 
     * // Get first 10 SubscriptionOffers
     * const subscriptionOffers = await prisma.subscriptionOffer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionOfferWithIdOnly = await prisma.subscriptionOffer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionOfferFindManyArgs>(args?: SelectSubset<T, SubscriptionOfferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SubscriptionOffer.
     * @param {SubscriptionOfferCreateArgs} args - Arguments to create a SubscriptionOffer.
     * @example
     * // Create one SubscriptionOffer
     * const SubscriptionOffer = await prisma.subscriptionOffer.create({
     *   data: {
     *     // ... data to create a SubscriptionOffer
     *   }
     * })
     * 
     */
    create<T extends SubscriptionOfferCreateArgs>(args: SelectSubset<T, SubscriptionOfferCreateArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SubscriptionOffers.
     * @param {SubscriptionOfferCreateManyArgs} args - Arguments to create many SubscriptionOffers.
     * @example
     * // Create many SubscriptionOffers
     * const subscriptionOffer = await prisma.subscriptionOffer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionOfferCreateManyArgs>(args?: SelectSubset<T, SubscriptionOfferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubscriptionOffers and returns the data saved in the database.
     * @param {SubscriptionOfferCreateManyAndReturnArgs} args - Arguments to create many SubscriptionOffers.
     * @example
     * // Create many SubscriptionOffers
     * const subscriptionOffer = await prisma.subscriptionOffer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubscriptionOffers and only return the `id`
     * const subscriptionOfferWithIdOnly = await prisma.subscriptionOffer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionOfferCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionOfferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SubscriptionOffer.
     * @param {SubscriptionOfferDeleteArgs} args - Arguments to delete one SubscriptionOffer.
     * @example
     * // Delete one SubscriptionOffer
     * const SubscriptionOffer = await prisma.subscriptionOffer.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionOffer
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionOfferDeleteArgs>(args: SelectSubset<T, SubscriptionOfferDeleteArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SubscriptionOffer.
     * @param {SubscriptionOfferUpdateArgs} args - Arguments to update one SubscriptionOffer.
     * @example
     * // Update one SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionOfferUpdateArgs>(args: SelectSubset<T, SubscriptionOfferUpdateArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SubscriptionOffers.
     * @param {SubscriptionOfferDeleteManyArgs} args - Arguments to filter SubscriptionOffers to delete.
     * @example
     * // Delete a few SubscriptionOffers
     * const { count } = await prisma.subscriptionOffer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionOfferDeleteManyArgs>(args?: SelectSubset<T, SubscriptionOfferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionOffers
     * const subscriptionOffer = await prisma.subscriptionOffer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionOfferUpdateManyArgs>(args: SelectSubset<T, SubscriptionOfferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubscriptionOffers and returns the data updated in the database.
     * @param {SubscriptionOfferUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionOffers.
     * @example
     * // Update many SubscriptionOffers
     * const subscriptionOffer = await prisma.subscriptionOffer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SubscriptionOffers and only return the `id`
     * const subscriptionOfferWithIdOnly = await prisma.subscriptionOffer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionOfferUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionOfferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SubscriptionOffer.
     * @param {SubscriptionOfferUpsertArgs} args - Arguments to update or create a SubscriptionOffer.
     * @example
     * // Update or create a SubscriptionOffer
     * const subscriptionOffer = await prisma.subscriptionOffer.upsert({
     *   create: {
     *     // ... data to create a SubscriptionOffer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionOffer we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionOfferUpsertArgs>(args: SelectSubset<T, SubscriptionOfferUpsertArgs<ExtArgs>>): Prisma__SubscriptionOfferClient<$Result.GetResult<Prisma.$SubscriptionOfferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SubscriptionOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferCountArgs} args - Arguments to filter SubscriptionOffers to count.
     * @example
     * // Count the number of SubscriptionOffers
     * const count = await prisma.subscriptionOffer.count({
     *   where: {
     *     // ... the filter for the SubscriptionOffers we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionOfferCountArgs>(
      args?: Subset<T, SubscriptionOfferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionOfferCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubscriptionOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionOfferAggregateArgs>(args: Subset<T, SubscriptionOfferAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionOfferAggregateType<T>>

    /**
     * Group by SubscriptionOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionOfferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionOfferGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionOfferGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionOfferGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionOfferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionOfferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubscriptionOffer model
   */
  readonly fields: SubscriptionOfferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubscriptionOffer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionOfferClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubscriptionOffer model
   */
  interface SubscriptionOfferFieldRefs {
    readonly id: FieldRef<"SubscriptionOffer", 'String'>
    readonly shop: FieldRef<"SubscriptionOffer", 'String'>
    readonly title: FieldRef<"SubscriptionOffer", 'String'>
    readonly productGid: FieldRef<"SubscriptionOffer", 'String'>
    readonly sellingPlanGroupGid: FieldRef<"SubscriptionOffer", 'String'>
    readonly defaultSellingPlanGid: FieldRef<"SubscriptionOffer", 'String'>
    readonly discountType: FieldRef<"SubscriptionOffer", 'String'>
    readonly discountValue: FieldRef<"SubscriptionOffer", 'String'>
    readonly planIntervalsJson: FieldRef<"SubscriptionOffer", 'String'>
    readonly createdAt: FieldRef<"SubscriptionOffer", 'DateTime'>
    readonly updatedAt: FieldRef<"SubscriptionOffer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubscriptionOffer findUnique
   */
  export type SubscriptionOfferFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionOffer to fetch.
     */
    where: SubscriptionOfferWhereUniqueInput
  }

  /**
   * SubscriptionOffer findUniqueOrThrow
   */
  export type SubscriptionOfferFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionOffer to fetch.
     */
    where: SubscriptionOfferWhereUniqueInput
  }

  /**
   * SubscriptionOffer findFirst
   */
  export type SubscriptionOfferFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionOffer to fetch.
     */
    where?: SubscriptionOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionOffers to fetch.
     */
    orderBy?: SubscriptionOfferOrderByWithRelationInput | SubscriptionOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionOffers.
     */
    cursor?: SubscriptionOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionOffers.
     */
    distinct?: SubscriptionOfferScalarFieldEnum | SubscriptionOfferScalarFieldEnum[]
  }

  /**
   * SubscriptionOffer findFirstOrThrow
   */
  export type SubscriptionOfferFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionOffer to fetch.
     */
    where?: SubscriptionOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionOffers to fetch.
     */
    orderBy?: SubscriptionOfferOrderByWithRelationInput | SubscriptionOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubscriptionOffers.
     */
    cursor?: SubscriptionOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubscriptionOffers.
     */
    distinct?: SubscriptionOfferScalarFieldEnum | SubscriptionOfferScalarFieldEnum[]
  }

  /**
   * SubscriptionOffer findMany
   */
  export type SubscriptionOfferFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter, which SubscriptionOffers to fetch.
     */
    where?: SubscriptionOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubscriptionOffers to fetch.
     */
    orderBy?: SubscriptionOfferOrderByWithRelationInput | SubscriptionOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubscriptionOffers.
     */
    cursor?: SubscriptionOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubscriptionOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubscriptionOffers.
     */
    skip?: number
    distinct?: SubscriptionOfferScalarFieldEnum | SubscriptionOfferScalarFieldEnum[]
  }

  /**
   * SubscriptionOffer create
   */
  export type SubscriptionOfferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * The data needed to create a SubscriptionOffer.
     */
    data: XOR<SubscriptionOfferCreateInput, SubscriptionOfferUncheckedCreateInput>
  }

  /**
   * SubscriptionOffer createMany
   */
  export type SubscriptionOfferCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionOffers.
     */
    data: SubscriptionOfferCreateManyInput | SubscriptionOfferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionOffer createManyAndReturn
   */
  export type SubscriptionOfferCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * The data used to create many SubscriptionOffers.
     */
    data: SubscriptionOfferCreateManyInput | SubscriptionOfferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubscriptionOffer update
   */
  export type SubscriptionOfferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * The data needed to update a SubscriptionOffer.
     */
    data: XOR<SubscriptionOfferUpdateInput, SubscriptionOfferUncheckedUpdateInput>
    /**
     * Choose, which SubscriptionOffer to update.
     */
    where: SubscriptionOfferWhereUniqueInput
  }

  /**
   * SubscriptionOffer updateMany
   */
  export type SubscriptionOfferUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionOffers.
     */
    data: XOR<SubscriptionOfferUpdateManyMutationInput, SubscriptionOfferUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionOffers to update
     */
    where?: SubscriptionOfferWhereInput
    /**
     * Limit how many SubscriptionOffers to update.
     */
    limit?: number
  }

  /**
   * SubscriptionOffer updateManyAndReturn
   */
  export type SubscriptionOfferUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * The data used to update SubscriptionOffers.
     */
    data: XOR<SubscriptionOfferUpdateManyMutationInput, SubscriptionOfferUncheckedUpdateManyInput>
    /**
     * Filter which SubscriptionOffers to update
     */
    where?: SubscriptionOfferWhereInput
    /**
     * Limit how many SubscriptionOffers to update.
     */
    limit?: number
  }

  /**
   * SubscriptionOffer upsert
   */
  export type SubscriptionOfferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * The filter to search for the SubscriptionOffer to update in case it exists.
     */
    where: SubscriptionOfferWhereUniqueInput
    /**
     * In case the SubscriptionOffer found by the `where` argument doesn't exist, create a new SubscriptionOffer with this data.
     */
    create: XOR<SubscriptionOfferCreateInput, SubscriptionOfferUncheckedCreateInput>
    /**
     * In case the SubscriptionOffer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionOfferUpdateInput, SubscriptionOfferUncheckedUpdateInput>
  }

  /**
   * SubscriptionOffer delete
   */
  export type SubscriptionOfferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
    /**
     * Filter which SubscriptionOffer to delete.
     */
    where: SubscriptionOfferWhereUniqueInput
  }

  /**
   * SubscriptionOffer deleteMany
   */
  export type SubscriptionOfferDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionOffers to delete
     */
    where?: SubscriptionOfferWhereInput
    /**
     * Limit how many SubscriptionOffers to delete.
     */
    limit?: number
  }

  /**
   * SubscriptionOffer without action
   */
  export type SubscriptionOfferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionOffer
     */
    select?: SubscriptionOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SubscriptionOffer
     */
    omit?: SubscriptionOfferOmit<ExtArgs> | null
  }


  /**
   * Model WidgetSettings
   */

  export type AggregateWidgetSettings = {
    _count: WidgetSettingsCountAggregateOutputType | null
    _avg: WidgetSettingsAvgAggregateOutputType | null
    _sum: WidgetSettingsSumAggregateOutputType | null
    _min: WidgetSettingsMinAggregateOutputType | null
    _max: WidgetSettingsMaxAggregateOutputType | null
  }

  export type WidgetSettingsAvgAggregateOutputType = {
    borderRadiusPx: number | null
    borderThicknessPx: number | null
  }

  export type WidgetSettingsSumAggregateOutputType = {
    borderRadiusPx: number | null
    borderThicknessPx: number | null
  }

  export type WidgetSettingsMinAggregateOutputType = {
    id: string | null
    shop: string | null
    showWidgetOnProductPage: boolean | null
    buyMoreHeading: string | null
    purchaseOptionsLabel: string | null
    primaryColorHex: string | null
    accentGreenHex: string | null
    fontFamily: string | null
    borderRadiusPx: number | null
    borderThicknessPx: number | null
    showSavingsBadge: boolean | null
    showCompareAtPrice: boolean | null
    showSubscriptionDetails: boolean | null
    customCssEnabled: boolean | null
    customCss: string | null
    subscriptionFooter: string | null
    freeShippingNote: string | null
    defaultSubscriptionDiscountType: string | null
    defaultSubscriptionDiscountValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WidgetSettingsMaxAggregateOutputType = {
    id: string | null
    shop: string | null
    showWidgetOnProductPage: boolean | null
    buyMoreHeading: string | null
    purchaseOptionsLabel: string | null
    primaryColorHex: string | null
    accentGreenHex: string | null
    fontFamily: string | null
    borderRadiusPx: number | null
    borderThicknessPx: number | null
    showSavingsBadge: boolean | null
    showCompareAtPrice: boolean | null
    showSubscriptionDetails: boolean | null
    customCssEnabled: boolean | null
    customCss: string | null
    subscriptionFooter: string | null
    freeShippingNote: string | null
    defaultSubscriptionDiscountType: string | null
    defaultSubscriptionDiscountValue: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WidgetSettingsCountAggregateOutputType = {
    id: number
    shop: number
    showWidgetOnProductPage: number
    buyMoreHeading: number
    purchaseOptionsLabel: number
    primaryColorHex: number
    accentGreenHex: number
    fontFamily: number
    borderRadiusPx: number
    borderThicknessPx: number
    showSavingsBadge: number
    showCompareAtPrice: number
    showSubscriptionDetails: number
    customCssEnabled: number
    customCss: number
    subscriptionFooter: number
    freeShippingNote: number
    defaultSubscriptionDiscountType: number
    defaultSubscriptionDiscountValue: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WidgetSettingsAvgAggregateInputType = {
    borderRadiusPx?: true
    borderThicknessPx?: true
  }

  export type WidgetSettingsSumAggregateInputType = {
    borderRadiusPx?: true
    borderThicknessPx?: true
  }

  export type WidgetSettingsMinAggregateInputType = {
    id?: true
    shop?: true
    showWidgetOnProductPage?: true
    buyMoreHeading?: true
    purchaseOptionsLabel?: true
    primaryColorHex?: true
    accentGreenHex?: true
    fontFamily?: true
    borderRadiusPx?: true
    borderThicknessPx?: true
    showSavingsBadge?: true
    showCompareAtPrice?: true
    showSubscriptionDetails?: true
    customCssEnabled?: true
    customCss?: true
    subscriptionFooter?: true
    freeShippingNote?: true
    defaultSubscriptionDiscountType?: true
    defaultSubscriptionDiscountValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WidgetSettingsMaxAggregateInputType = {
    id?: true
    shop?: true
    showWidgetOnProductPage?: true
    buyMoreHeading?: true
    purchaseOptionsLabel?: true
    primaryColorHex?: true
    accentGreenHex?: true
    fontFamily?: true
    borderRadiusPx?: true
    borderThicknessPx?: true
    showSavingsBadge?: true
    showCompareAtPrice?: true
    showSubscriptionDetails?: true
    customCssEnabled?: true
    customCss?: true
    subscriptionFooter?: true
    freeShippingNote?: true
    defaultSubscriptionDiscountType?: true
    defaultSubscriptionDiscountValue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WidgetSettingsCountAggregateInputType = {
    id?: true
    shop?: true
    showWidgetOnProductPage?: true
    buyMoreHeading?: true
    purchaseOptionsLabel?: true
    primaryColorHex?: true
    accentGreenHex?: true
    fontFamily?: true
    borderRadiusPx?: true
    borderThicknessPx?: true
    showSavingsBadge?: true
    showCompareAtPrice?: true
    showSubscriptionDetails?: true
    customCssEnabled?: true
    customCss?: true
    subscriptionFooter?: true
    freeShippingNote?: true
    defaultSubscriptionDiscountType?: true
    defaultSubscriptionDiscountValue?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WidgetSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WidgetSettings to aggregate.
     */
    where?: WidgetSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetSettings to fetch.
     */
    orderBy?: WidgetSettingsOrderByWithRelationInput | WidgetSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WidgetSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WidgetSettings
    **/
    _count?: true | WidgetSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WidgetSettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WidgetSettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WidgetSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WidgetSettingsMaxAggregateInputType
  }

  export type GetWidgetSettingsAggregateType<T extends WidgetSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateWidgetSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWidgetSettings[P]>
      : GetScalarType<T[P], AggregateWidgetSettings[P]>
  }




  export type WidgetSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WidgetSettingsWhereInput
    orderBy?: WidgetSettingsOrderByWithAggregationInput | WidgetSettingsOrderByWithAggregationInput[]
    by: WidgetSettingsScalarFieldEnum[] | WidgetSettingsScalarFieldEnum
    having?: WidgetSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WidgetSettingsCountAggregateInputType | true
    _avg?: WidgetSettingsAvgAggregateInputType
    _sum?: WidgetSettingsSumAggregateInputType
    _min?: WidgetSettingsMinAggregateInputType
    _max?: WidgetSettingsMaxAggregateInputType
  }

  export type WidgetSettingsGroupByOutputType = {
    id: string
    shop: string
    showWidgetOnProductPage: boolean
    buyMoreHeading: string
    purchaseOptionsLabel: string
    primaryColorHex: string
    accentGreenHex: string
    fontFamily: string
    borderRadiusPx: number
    borderThicknessPx: number
    showSavingsBadge: boolean
    showCompareAtPrice: boolean
    showSubscriptionDetails: boolean
    customCssEnabled: boolean
    customCss: string
    subscriptionFooter: string
    freeShippingNote: string
    defaultSubscriptionDiscountType: string
    defaultSubscriptionDiscountValue: string
    createdAt: Date
    updatedAt: Date
    _count: WidgetSettingsCountAggregateOutputType | null
    _avg: WidgetSettingsAvgAggregateOutputType | null
    _sum: WidgetSettingsSumAggregateOutputType | null
    _min: WidgetSettingsMinAggregateOutputType | null
    _max: WidgetSettingsMaxAggregateOutputType | null
  }

  type GetWidgetSettingsGroupByPayload<T extends WidgetSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WidgetSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WidgetSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WidgetSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], WidgetSettingsGroupByOutputType[P]>
        }
      >
    >


  export type WidgetSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: boolean
    purchaseOptionsLabel?: boolean
    primaryColorHex?: boolean
    accentGreenHex?: boolean
    fontFamily?: boolean
    borderRadiusPx?: boolean
    borderThicknessPx?: boolean
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: boolean
    subscriptionFooter?: boolean
    freeShippingNote?: boolean
    defaultSubscriptionDiscountType?: boolean
    defaultSubscriptionDiscountValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["widgetSettings"]>

  export type WidgetSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: boolean
    purchaseOptionsLabel?: boolean
    primaryColorHex?: boolean
    accentGreenHex?: boolean
    fontFamily?: boolean
    borderRadiusPx?: boolean
    borderThicknessPx?: boolean
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: boolean
    subscriptionFooter?: boolean
    freeShippingNote?: boolean
    defaultSubscriptionDiscountType?: boolean
    defaultSubscriptionDiscountValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["widgetSettings"]>

  export type WidgetSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: boolean
    purchaseOptionsLabel?: boolean
    primaryColorHex?: boolean
    accentGreenHex?: boolean
    fontFamily?: boolean
    borderRadiusPx?: boolean
    borderThicknessPx?: boolean
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: boolean
    subscriptionFooter?: boolean
    freeShippingNote?: boolean
    defaultSubscriptionDiscountType?: boolean
    defaultSubscriptionDiscountValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["widgetSettings"]>

  export type WidgetSettingsSelectScalar = {
    id?: boolean
    shop?: boolean
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: boolean
    purchaseOptionsLabel?: boolean
    primaryColorHex?: boolean
    accentGreenHex?: boolean
    fontFamily?: boolean
    borderRadiusPx?: boolean
    borderThicknessPx?: boolean
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: boolean
    subscriptionFooter?: boolean
    freeShippingNote?: boolean
    defaultSubscriptionDiscountType?: boolean
    defaultSubscriptionDiscountValue?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WidgetSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shop" | "showWidgetOnProductPage" | "buyMoreHeading" | "purchaseOptionsLabel" | "primaryColorHex" | "accentGreenHex" | "fontFamily" | "borderRadiusPx" | "borderThicknessPx" | "showSavingsBadge" | "showCompareAtPrice" | "showSubscriptionDetails" | "customCssEnabled" | "customCss" | "subscriptionFooter" | "freeShippingNote" | "defaultSubscriptionDiscountType" | "defaultSubscriptionDiscountValue" | "createdAt" | "updatedAt", ExtArgs["result"]["widgetSettings"]>

  export type $WidgetSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WidgetSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shop: string
      showWidgetOnProductPage: boolean
      buyMoreHeading: string
      purchaseOptionsLabel: string
      primaryColorHex: string
      accentGreenHex: string
      fontFamily: string
      borderRadiusPx: number
      borderThicknessPx: number
      showSavingsBadge: boolean
      showCompareAtPrice: boolean
      showSubscriptionDetails: boolean
      customCssEnabled: boolean
      customCss: string
      subscriptionFooter: string
      freeShippingNote: string
      /**
       * Mặc định khi tạo subscription offer: PERCENTAGE | FIXED
       */
      defaultSubscriptionDiscountType: string
      /**
       * Chuỗi số (phần trăm hoặc số tiền tuỳ type)
       */
      defaultSubscriptionDiscountValue: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["widgetSettings"]>
    composites: {}
  }

  type WidgetSettingsGetPayload<S extends boolean | null | undefined | WidgetSettingsDefaultArgs> = $Result.GetResult<Prisma.$WidgetSettingsPayload, S>

  type WidgetSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WidgetSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WidgetSettingsCountAggregateInputType | true
    }

  export interface WidgetSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WidgetSettings'], meta: { name: 'WidgetSettings' } }
    /**
     * Find zero or one WidgetSettings that matches the filter.
     * @param {WidgetSettingsFindUniqueArgs} args - Arguments to find a WidgetSettings
     * @example
     * // Get one WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WidgetSettingsFindUniqueArgs>(args: SelectSubset<T, WidgetSettingsFindUniqueArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WidgetSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WidgetSettingsFindUniqueOrThrowArgs} args - Arguments to find a WidgetSettings
     * @example
     * // Get one WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WidgetSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, WidgetSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WidgetSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsFindFirstArgs} args - Arguments to find a WidgetSettings
     * @example
     * // Get one WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WidgetSettingsFindFirstArgs>(args?: SelectSubset<T, WidgetSettingsFindFirstArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WidgetSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsFindFirstOrThrowArgs} args - Arguments to find a WidgetSettings
     * @example
     * // Get one WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WidgetSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, WidgetSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WidgetSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findMany()
     * 
     * // Get first 10 WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const widgetSettingsWithIdOnly = await prisma.widgetSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WidgetSettingsFindManyArgs>(args?: SelectSubset<T, WidgetSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WidgetSettings.
     * @param {WidgetSettingsCreateArgs} args - Arguments to create a WidgetSettings.
     * @example
     * // Create one WidgetSettings
     * const WidgetSettings = await prisma.widgetSettings.create({
     *   data: {
     *     // ... data to create a WidgetSettings
     *   }
     * })
     * 
     */
    create<T extends WidgetSettingsCreateArgs>(args: SelectSubset<T, WidgetSettingsCreateArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WidgetSettings.
     * @param {WidgetSettingsCreateManyArgs} args - Arguments to create many WidgetSettings.
     * @example
     * // Create many WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WidgetSettingsCreateManyArgs>(args?: SelectSubset<T, WidgetSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WidgetSettings and returns the data saved in the database.
     * @param {WidgetSettingsCreateManyAndReturnArgs} args - Arguments to create many WidgetSettings.
     * @example
     * // Create many WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WidgetSettings and only return the `id`
     * const widgetSettingsWithIdOnly = await prisma.widgetSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WidgetSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, WidgetSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WidgetSettings.
     * @param {WidgetSettingsDeleteArgs} args - Arguments to delete one WidgetSettings.
     * @example
     * // Delete one WidgetSettings
     * const WidgetSettings = await prisma.widgetSettings.delete({
     *   where: {
     *     // ... filter to delete one WidgetSettings
     *   }
     * })
     * 
     */
    delete<T extends WidgetSettingsDeleteArgs>(args: SelectSubset<T, WidgetSettingsDeleteArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WidgetSettings.
     * @param {WidgetSettingsUpdateArgs} args - Arguments to update one WidgetSettings.
     * @example
     * // Update one WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WidgetSettingsUpdateArgs>(args: SelectSubset<T, WidgetSettingsUpdateArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WidgetSettings.
     * @param {WidgetSettingsDeleteManyArgs} args - Arguments to filter WidgetSettings to delete.
     * @example
     * // Delete a few WidgetSettings
     * const { count } = await prisma.widgetSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WidgetSettingsDeleteManyArgs>(args?: SelectSubset<T, WidgetSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WidgetSettingsUpdateManyArgs>(args: SelectSubset<T, WidgetSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetSettings and returns the data updated in the database.
     * @param {WidgetSettingsUpdateManyAndReturnArgs} args - Arguments to update many WidgetSettings.
     * @example
     * // Update many WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WidgetSettings and only return the `id`
     * const widgetSettingsWithIdOnly = await prisma.widgetSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WidgetSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, WidgetSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WidgetSettings.
     * @param {WidgetSettingsUpsertArgs} args - Arguments to update or create a WidgetSettings.
     * @example
     * // Update or create a WidgetSettings
     * const widgetSettings = await prisma.widgetSettings.upsert({
     *   create: {
     *     // ... data to create a WidgetSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WidgetSettings we want to update
     *   }
     * })
     */
    upsert<T extends WidgetSettingsUpsertArgs>(args: SelectSubset<T, WidgetSettingsUpsertArgs<ExtArgs>>): Prisma__WidgetSettingsClient<$Result.GetResult<Prisma.$WidgetSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WidgetSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsCountArgs} args - Arguments to filter WidgetSettings to count.
     * @example
     * // Count the number of WidgetSettings
     * const count = await prisma.widgetSettings.count({
     *   where: {
     *     // ... the filter for the WidgetSettings we want to count
     *   }
     * })
    **/
    count<T extends WidgetSettingsCountArgs>(
      args?: Subset<T, WidgetSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WidgetSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WidgetSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WidgetSettingsAggregateArgs>(args: Subset<T, WidgetSettingsAggregateArgs>): Prisma.PrismaPromise<GetWidgetSettingsAggregateType<T>>

    /**
     * Group by WidgetSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WidgetSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WidgetSettingsGroupByArgs['orderBy'] }
        : { orderBy?: WidgetSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WidgetSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWidgetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WidgetSettings model
   */
  readonly fields: WidgetSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WidgetSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WidgetSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WidgetSettings model
   */
  interface WidgetSettingsFieldRefs {
    readonly id: FieldRef<"WidgetSettings", 'String'>
    readonly shop: FieldRef<"WidgetSettings", 'String'>
    readonly showWidgetOnProductPage: FieldRef<"WidgetSettings", 'Boolean'>
    readonly buyMoreHeading: FieldRef<"WidgetSettings", 'String'>
    readonly purchaseOptionsLabel: FieldRef<"WidgetSettings", 'String'>
    readonly primaryColorHex: FieldRef<"WidgetSettings", 'String'>
    readonly accentGreenHex: FieldRef<"WidgetSettings", 'String'>
    readonly fontFamily: FieldRef<"WidgetSettings", 'String'>
    readonly borderRadiusPx: FieldRef<"WidgetSettings", 'Int'>
    readonly borderThicknessPx: FieldRef<"WidgetSettings", 'Int'>
    readonly showSavingsBadge: FieldRef<"WidgetSettings", 'Boolean'>
    readonly showCompareAtPrice: FieldRef<"WidgetSettings", 'Boolean'>
    readonly showSubscriptionDetails: FieldRef<"WidgetSettings", 'Boolean'>
    readonly customCssEnabled: FieldRef<"WidgetSettings", 'Boolean'>
    readonly customCss: FieldRef<"WidgetSettings", 'String'>
    readonly subscriptionFooter: FieldRef<"WidgetSettings", 'String'>
    readonly freeShippingNote: FieldRef<"WidgetSettings", 'String'>
    readonly defaultSubscriptionDiscountType: FieldRef<"WidgetSettings", 'String'>
    readonly defaultSubscriptionDiscountValue: FieldRef<"WidgetSettings", 'String'>
    readonly createdAt: FieldRef<"WidgetSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"WidgetSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WidgetSettings findUnique
   */
  export type WidgetSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter, which WidgetSettings to fetch.
     */
    where: WidgetSettingsWhereUniqueInput
  }

  /**
   * WidgetSettings findUniqueOrThrow
   */
  export type WidgetSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter, which WidgetSettings to fetch.
     */
    where: WidgetSettingsWhereUniqueInput
  }

  /**
   * WidgetSettings findFirst
   */
  export type WidgetSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter, which WidgetSettings to fetch.
     */
    where?: WidgetSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetSettings to fetch.
     */
    orderBy?: WidgetSettingsOrderByWithRelationInput | WidgetSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WidgetSettings.
     */
    cursor?: WidgetSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WidgetSettings.
     */
    distinct?: WidgetSettingsScalarFieldEnum | WidgetSettingsScalarFieldEnum[]
  }

  /**
   * WidgetSettings findFirstOrThrow
   */
  export type WidgetSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter, which WidgetSettings to fetch.
     */
    where?: WidgetSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetSettings to fetch.
     */
    orderBy?: WidgetSettingsOrderByWithRelationInput | WidgetSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WidgetSettings.
     */
    cursor?: WidgetSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WidgetSettings.
     */
    distinct?: WidgetSettingsScalarFieldEnum | WidgetSettingsScalarFieldEnum[]
  }

  /**
   * WidgetSettings findMany
   */
  export type WidgetSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter, which WidgetSettings to fetch.
     */
    where?: WidgetSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetSettings to fetch.
     */
    orderBy?: WidgetSettingsOrderByWithRelationInput | WidgetSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WidgetSettings.
     */
    cursor?: WidgetSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetSettings.
     */
    skip?: number
    distinct?: WidgetSettingsScalarFieldEnum | WidgetSettingsScalarFieldEnum[]
  }

  /**
   * WidgetSettings create
   */
  export type WidgetSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a WidgetSettings.
     */
    data: XOR<WidgetSettingsCreateInput, WidgetSettingsUncheckedCreateInput>
  }

  /**
   * WidgetSettings createMany
   */
  export type WidgetSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WidgetSettings.
     */
    data: WidgetSettingsCreateManyInput | WidgetSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WidgetSettings createManyAndReturn
   */
  export type WidgetSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many WidgetSettings.
     */
    data: WidgetSettingsCreateManyInput | WidgetSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WidgetSettings update
   */
  export type WidgetSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a WidgetSettings.
     */
    data: XOR<WidgetSettingsUpdateInput, WidgetSettingsUncheckedUpdateInput>
    /**
     * Choose, which WidgetSettings to update.
     */
    where: WidgetSettingsWhereUniqueInput
  }

  /**
   * WidgetSettings updateMany
   */
  export type WidgetSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WidgetSettings.
     */
    data: XOR<WidgetSettingsUpdateManyMutationInput, WidgetSettingsUncheckedUpdateManyInput>
    /**
     * Filter which WidgetSettings to update
     */
    where?: WidgetSettingsWhereInput
    /**
     * Limit how many WidgetSettings to update.
     */
    limit?: number
  }

  /**
   * WidgetSettings updateManyAndReturn
   */
  export type WidgetSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * The data used to update WidgetSettings.
     */
    data: XOR<WidgetSettingsUpdateManyMutationInput, WidgetSettingsUncheckedUpdateManyInput>
    /**
     * Filter which WidgetSettings to update
     */
    where?: WidgetSettingsWhereInput
    /**
     * Limit how many WidgetSettings to update.
     */
    limit?: number
  }

  /**
   * WidgetSettings upsert
   */
  export type WidgetSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the WidgetSettings to update in case it exists.
     */
    where: WidgetSettingsWhereUniqueInput
    /**
     * In case the WidgetSettings found by the `where` argument doesn't exist, create a new WidgetSettings with this data.
     */
    create: XOR<WidgetSettingsCreateInput, WidgetSettingsUncheckedCreateInput>
    /**
     * In case the WidgetSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WidgetSettingsUpdateInput, WidgetSettingsUncheckedUpdateInput>
  }

  /**
   * WidgetSettings delete
   */
  export type WidgetSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
    /**
     * Filter which WidgetSettings to delete.
     */
    where: WidgetSettingsWhereUniqueInput
  }

  /**
   * WidgetSettings deleteMany
   */
  export type WidgetSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WidgetSettings to delete
     */
    where?: WidgetSettingsWhereInput
    /**
     * Limit how many WidgetSettings to delete.
     */
    limit?: number
  }

  /**
   * WidgetSettings without action
   */
  export type WidgetSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetSettings
     */
    select?: WidgetSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetSettings
     */
    omit?: WidgetSettingsOmit<ExtArgs> | null
  }


  /**
   * Model WidgetEnabledProduct
   */

  export type AggregateWidgetEnabledProduct = {
    _count: WidgetEnabledProductCountAggregateOutputType | null
    _min: WidgetEnabledProductMinAggregateOutputType | null
    _max: WidgetEnabledProductMaxAggregateOutputType | null
  }

  export type WidgetEnabledProductMinAggregateOutputType = {
    id: string | null
    shop: string | null
    productGid: string | null
    productTitle: string | null
    createdAt: Date | null
  }

  export type WidgetEnabledProductMaxAggregateOutputType = {
    id: string | null
    shop: string | null
    productGid: string | null
    productTitle: string | null
    createdAt: Date | null
  }

  export type WidgetEnabledProductCountAggregateOutputType = {
    id: number
    shop: number
    productGid: number
    productTitle: number
    createdAt: number
    _all: number
  }


  export type WidgetEnabledProductMinAggregateInputType = {
    id?: true
    shop?: true
    productGid?: true
    productTitle?: true
    createdAt?: true
  }

  export type WidgetEnabledProductMaxAggregateInputType = {
    id?: true
    shop?: true
    productGid?: true
    productTitle?: true
    createdAt?: true
  }

  export type WidgetEnabledProductCountAggregateInputType = {
    id?: true
    shop?: true
    productGid?: true
    productTitle?: true
    createdAt?: true
    _all?: true
  }

  export type WidgetEnabledProductAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WidgetEnabledProduct to aggregate.
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetEnabledProducts to fetch.
     */
    orderBy?: WidgetEnabledProductOrderByWithRelationInput | WidgetEnabledProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WidgetEnabledProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetEnabledProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetEnabledProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WidgetEnabledProducts
    **/
    _count?: true | WidgetEnabledProductCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WidgetEnabledProductMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WidgetEnabledProductMaxAggregateInputType
  }

  export type GetWidgetEnabledProductAggregateType<T extends WidgetEnabledProductAggregateArgs> = {
        [P in keyof T & keyof AggregateWidgetEnabledProduct]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWidgetEnabledProduct[P]>
      : GetScalarType<T[P], AggregateWidgetEnabledProduct[P]>
  }




  export type WidgetEnabledProductGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WidgetEnabledProductWhereInput
    orderBy?: WidgetEnabledProductOrderByWithAggregationInput | WidgetEnabledProductOrderByWithAggregationInput[]
    by: WidgetEnabledProductScalarFieldEnum[] | WidgetEnabledProductScalarFieldEnum
    having?: WidgetEnabledProductScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WidgetEnabledProductCountAggregateInputType | true
    _min?: WidgetEnabledProductMinAggregateInputType
    _max?: WidgetEnabledProductMaxAggregateInputType
  }

  export type WidgetEnabledProductGroupByOutputType = {
    id: string
    shop: string
    productGid: string
    productTitle: string | null
    createdAt: Date
    _count: WidgetEnabledProductCountAggregateOutputType | null
    _min: WidgetEnabledProductMinAggregateOutputType | null
    _max: WidgetEnabledProductMaxAggregateOutputType | null
  }

  type GetWidgetEnabledProductGroupByPayload<T extends WidgetEnabledProductGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WidgetEnabledProductGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WidgetEnabledProductGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WidgetEnabledProductGroupByOutputType[P]>
            : GetScalarType<T[P], WidgetEnabledProductGroupByOutputType[P]>
        }
      >
    >


  export type WidgetEnabledProductSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    productGid?: boolean
    productTitle?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["widgetEnabledProduct"]>

  export type WidgetEnabledProductSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    productGid?: boolean
    productTitle?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["widgetEnabledProduct"]>

  export type WidgetEnabledProductSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shop?: boolean
    productGid?: boolean
    productTitle?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["widgetEnabledProduct"]>

  export type WidgetEnabledProductSelectScalar = {
    id?: boolean
    shop?: boolean
    productGid?: boolean
    productTitle?: boolean
    createdAt?: boolean
  }

  export type WidgetEnabledProductOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shop" | "productGid" | "productTitle" | "createdAt", ExtArgs["result"]["widgetEnabledProduct"]>

  export type $WidgetEnabledProductPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WidgetEnabledProduct"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shop: string
      productGid: string
      productTitle: string | null
      createdAt: Date
    }, ExtArgs["result"]["widgetEnabledProduct"]>
    composites: {}
  }

  type WidgetEnabledProductGetPayload<S extends boolean | null | undefined | WidgetEnabledProductDefaultArgs> = $Result.GetResult<Prisma.$WidgetEnabledProductPayload, S>

  type WidgetEnabledProductCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WidgetEnabledProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WidgetEnabledProductCountAggregateInputType | true
    }

  export interface WidgetEnabledProductDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WidgetEnabledProduct'], meta: { name: 'WidgetEnabledProduct' } }
    /**
     * Find zero or one WidgetEnabledProduct that matches the filter.
     * @param {WidgetEnabledProductFindUniqueArgs} args - Arguments to find a WidgetEnabledProduct
     * @example
     * // Get one WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WidgetEnabledProductFindUniqueArgs>(args: SelectSubset<T, WidgetEnabledProductFindUniqueArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WidgetEnabledProduct that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WidgetEnabledProductFindUniqueOrThrowArgs} args - Arguments to find a WidgetEnabledProduct
     * @example
     * // Get one WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WidgetEnabledProductFindUniqueOrThrowArgs>(args: SelectSubset<T, WidgetEnabledProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WidgetEnabledProduct that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductFindFirstArgs} args - Arguments to find a WidgetEnabledProduct
     * @example
     * // Get one WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WidgetEnabledProductFindFirstArgs>(args?: SelectSubset<T, WidgetEnabledProductFindFirstArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WidgetEnabledProduct that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductFindFirstOrThrowArgs} args - Arguments to find a WidgetEnabledProduct
     * @example
     * // Get one WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WidgetEnabledProductFindFirstOrThrowArgs>(args?: SelectSubset<T, WidgetEnabledProductFindFirstOrThrowArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WidgetEnabledProducts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WidgetEnabledProducts
     * const widgetEnabledProducts = await prisma.widgetEnabledProduct.findMany()
     * 
     * // Get first 10 WidgetEnabledProducts
     * const widgetEnabledProducts = await prisma.widgetEnabledProduct.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const widgetEnabledProductWithIdOnly = await prisma.widgetEnabledProduct.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WidgetEnabledProductFindManyArgs>(args?: SelectSubset<T, WidgetEnabledProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WidgetEnabledProduct.
     * @param {WidgetEnabledProductCreateArgs} args - Arguments to create a WidgetEnabledProduct.
     * @example
     * // Create one WidgetEnabledProduct
     * const WidgetEnabledProduct = await prisma.widgetEnabledProduct.create({
     *   data: {
     *     // ... data to create a WidgetEnabledProduct
     *   }
     * })
     * 
     */
    create<T extends WidgetEnabledProductCreateArgs>(args: SelectSubset<T, WidgetEnabledProductCreateArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WidgetEnabledProducts.
     * @param {WidgetEnabledProductCreateManyArgs} args - Arguments to create many WidgetEnabledProducts.
     * @example
     * // Create many WidgetEnabledProducts
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WidgetEnabledProductCreateManyArgs>(args?: SelectSubset<T, WidgetEnabledProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WidgetEnabledProducts and returns the data saved in the database.
     * @param {WidgetEnabledProductCreateManyAndReturnArgs} args - Arguments to create many WidgetEnabledProducts.
     * @example
     * // Create many WidgetEnabledProducts
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WidgetEnabledProducts and only return the `id`
     * const widgetEnabledProductWithIdOnly = await prisma.widgetEnabledProduct.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WidgetEnabledProductCreateManyAndReturnArgs>(args?: SelectSubset<T, WidgetEnabledProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WidgetEnabledProduct.
     * @param {WidgetEnabledProductDeleteArgs} args - Arguments to delete one WidgetEnabledProduct.
     * @example
     * // Delete one WidgetEnabledProduct
     * const WidgetEnabledProduct = await prisma.widgetEnabledProduct.delete({
     *   where: {
     *     // ... filter to delete one WidgetEnabledProduct
     *   }
     * })
     * 
     */
    delete<T extends WidgetEnabledProductDeleteArgs>(args: SelectSubset<T, WidgetEnabledProductDeleteArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WidgetEnabledProduct.
     * @param {WidgetEnabledProductUpdateArgs} args - Arguments to update one WidgetEnabledProduct.
     * @example
     * // Update one WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WidgetEnabledProductUpdateArgs>(args: SelectSubset<T, WidgetEnabledProductUpdateArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WidgetEnabledProducts.
     * @param {WidgetEnabledProductDeleteManyArgs} args - Arguments to filter WidgetEnabledProducts to delete.
     * @example
     * // Delete a few WidgetEnabledProducts
     * const { count } = await prisma.widgetEnabledProduct.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WidgetEnabledProductDeleteManyArgs>(args?: SelectSubset<T, WidgetEnabledProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetEnabledProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WidgetEnabledProducts
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WidgetEnabledProductUpdateManyArgs>(args: SelectSubset<T, WidgetEnabledProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WidgetEnabledProducts and returns the data updated in the database.
     * @param {WidgetEnabledProductUpdateManyAndReturnArgs} args - Arguments to update many WidgetEnabledProducts.
     * @example
     * // Update many WidgetEnabledProducts
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WidgetEnabledProducts and only return the `id`
     * const widgetEnabledProductWithIdOnly = await prisma.widgetEnabledProduct.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WidgetEnabledProductUpdateManyAndReturnArgs>(args: SelectSubset<T, WidgetEnabledProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WidgetEnabledProduct.
     * @param {WidgetEnabledProductUpsertArgs} args - Arguments to update or create a WidgetEnabledProduct.
     * @example
     * // Update or create a WidgetEnabledProduct
     * const widgetEnabledProduct = await prisma.widgetEnabledProduct.upsert({
     *   create: {
     *     // ... data to create a WidgetEnabledProduct
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WidgetEnabledProduct we want to update
     *   }
     * })
     */
    upsert<T extends WidgetEnabledProductUpsertArgs>(args: SelectSubset<T, WidgetEnabledProductUpsertArgs<ExtArgs>>): Prisma__WidgetEnabledProductClient<$Result.GetResult<Prisma.$WidgetEnabledProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WidgetEnabledProducts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductCountArgs} args - Arguments to filter WidgetEnabledProducts to count.
     * @example
     * // Count the number of WidgetEnabledProducts
     * const count = await prisma.widgetEnabledProduct.count({
     *   where: {
     *     // ... the filter for the WidgetEnabledProducts we want to count
     *   }
     * })
    **/
    count<T extends WidgetEnabledProductCountArgs>(
      args?: Subset<T, WidgetEnabledProductCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WidgetEnabledProductCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WidgetEnabledProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WidgetEnabledProductAggregateArgs>(args: Subset<T, WidgetEnabledProductAggregateArgs>): Prisma.PrismaPromise<GetWidgetEnabledProductAggregateType<T>>

    /**
     * Group by WidgetEnabledProduct.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WidgetEnabledProductGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WidgetEnabledProductGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WidgetEnabledProductGroupByArgs['orderBy'] }
        : { orderBy?: WidgetEnabledProductGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WidgetEnabledProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWidgetEnabledProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WidgetEnabledProduct model
   */
  readonly fields: WidgetEnabledProductFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WidgetEnabledProduct.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WidgetEnabledProductClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WidgetEnabledProduct model
   */
  interface WidgetEnabledProductFieldRefs {
    readonly id: FieldRef<"WidgetEnabledProduct", 'String'>
    readonly shop: FieldRef<"WidgetEnabledProduct", 'String'>
    readonly productGid: FieldRef<"WidgetEnabledProduct", 'String'>
    readonly productTitle: FieldRef<"WidgetEnabledProduct", 'String'>
    readonly createdAt: FieldRef<"WidgetEnabledProduct", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WidgetEnabledProduct findUnique
   */
  export type WidgetEnabledProductFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter, which WidgetEnabledProduct to fetch.
     */
    where: WidgetEnabledProductWhereUniqueInput
  }

  /**
   * WidgetEnabledProduct findUniqueOrThrow
   */
  export type WidgetEnabledProductFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter, which WidgetEnabledProduct to fetch.
     */
    where: WidgetEnabledProductWhereUniqueInput
  }

  /**
   * WidgetEnabledProduct findFirst
   */
  export type WidgetEnabledProductFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter, which WidgetEnabledProduct to fetch.
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetEnabledProducts to fetch.
     */
    orderBy?: WidgetEnabledProductOrderByWithRelationInput | WidgetEnabledProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WidgetEnabledProducts.
     */
    cursor?: WidgetEnabledProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetEnabledProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetEnabledProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WidgetEnabledProducts.
     */
    distinct?: WidgetEnabledProductScalarFieldEnum | WidgetEnabledProductScalarFieldEnum[]
  }

  /**
   * WidgetEnabledProduct findFirstOrThrow
   */
  export type WidgetEnabledProductFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter, which WidgetEnabledProduct to fetch.
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetEnabledProducts to fetch.
     */
    orderBy?: WidgetEnabledProductOrderByWithRelationInput | WidgetEnabledProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WidgetEnabledProducts.
     */
    cursor?: WidgetEnabledProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetEnabledProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetEnabledProducts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WidgetEnabledProducts.
     */
    distinct?: WidgetEnabledProductScalarFieldEnum | WidgetEnabledProductScalarFieldEnum[]
  }

  /**
   * WidgetEnabledProduct findMany
   */
  export type WidgetEnabledProductFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter, which WidgetEnabledProducts to fetch.
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WidgetEnabledProducts to fetch.
     */
    orderBy?: WidgetEnabledProductOrderByWithRelationInput | WidgetEnabledProductOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WidgetEnabledProducts.
     */
    cursor?: WidgetEnabledProductWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WidgetEnabledProducts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WidgetEnabledProducts.
     */
    skip?: number
    distinct?: WidgetEnabledProductScalarFieldEnum | WidgetEnabledProductScalarFieldEnum[]
  }

  /**
   * WidgetEnabledProduct create
   */
  export type WidgetEnabledProductCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * The data needed to create a WidgetEnabledProduct.
     */
    data: XOR<WidgetEnabledProductCreateInput, WidgetEnabledProductUncheckedCreateInput>
  }

  /**
   * WidgetEnabledProduct createMany
   */
  export type WidgetEnabledProductCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WidgetEnabledProducts.
     */
    data: WidgetEnabledProductCreateManyInput | WidgetEnabledProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WidgetEnabledProduct createManyAndReturn
   */
  export type WidgetEnabledProductCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * The data used to create many WidgetEnabledProducts.
     */
    data: WidgetEnabledProductCreateManyInput | WidgetEnabledProductCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WidgetEnabledProduct update
   */
  export type WidgetEnabledProductUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * The data needed to update a WidgetEnabledProduct.
     */
    data: XOR<WidgetEnabledProductUpdateInput, WidgetEnabledProductUncheckedUpdateInput>
    /**
     * Choose, which WidgetEnabledProduct to update.
     */
    where: WidgetEnabledProductWhereUniqueInput
  }

  /**
   * WidgetEnabledProduct updateMany
   */
  export type WidgetEnabledProductUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WidgetEnabledProducts.
     */
    data: XOR<WidgetEnabledProductUpdateManyMutationInput, WidgetEnabledProductUncheckedUpdateManyInput>
    /**
     * Filter which WidgetEnabledProducts to update
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * Limit how many WidgetEnabledProducts to update.
     */
    limit?: number
  }

  /**
   * WidgetEnabledProduct updateManyAndReturn
   */
  export type WidgetEnabledProductUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * The data used to update WidgetEnabledProducts.
     */
    data: XOR<WidgetEnabledProductUpdateManyMutationInput, WidgetEnabledProductUncheckedUpdateManyInput>
    /**
     * Filter which WidgetEnabledProducts to update
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * Limit how many WidgetEnabledProducts to update.
     */
    limit?: number
  }

  /**
   * WidgetEnabledProduct upsert
   */
  export type WidgetEnabledProductUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * The filter to search for the WidgetEnabledProduct to update in case it exists.
     */
    where: WidgetEnabledProductWhereUniqueInput
    /**
     * In case the WidgetEnabledProduct found by the `where` argument doesn't exist, create a new WidgetEnabledProduct with this data.
     */
    create: XOR<WidgetEnabledProductCreateInput, WidgetEnabledProductUncheckedCreateInput>
    /**
     * In case the WidgetEnabledProduct was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WidgetEnabledProductUpdateInput, WidgetEnabledProductUncheckedUpdateInput>
  }

  /**
   * WidgetEnabledProduct delete
   */
  export type WidgetEnabledProductDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
    /**
     * Filter which WidgetEnabledProduct to delete.
     */
    where: WidgetEnabledProductWhereUniqueInput
  }

  /**
   * WidgetEnabledProduct deleteMany
   */
  export type WidgetEnabledProductDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WidgetEnabledProducts to delete
     */
    where?: WidgetEnabledProductWhereInput
    /**
     * Limit how many WidgetEnabledProducts to delete.
     */
    limit?: number
  }

  /**
   * WidgetEnabledProduct without action
   */
  export type WidgetEnabledProductDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WidgetEnabledProduct
     */
    select?: WidgetEnabledProductSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WidgetEnabledProduct
     */
    omit?: WidgetEnabledProductOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SessionScalarFieldEnum: {
    id: 'id',
    shop: 'shop',
    state: 'state',
    isOnline: 'isOnline',
    scope: 'scope',
    expires: 'expires',
    accessToken: 'accessToken',
    userId: 'userId',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    accountOwner: 'accountOwner',
    locale: 'locale',
    collaborator: 'collaborator',
    emailVerified: 'emailVerified',
    refreshToken: 'refreshToken',
    refreshTokenExpires: 'refreshTokenExpires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const MerchantScalarFieldEnum: {
    id: 'id',
    shopDomain: 'shopDomain',
    shopGid: 'shopGid',
    shopName: 'shopName',
    email: 'email',
    countryCode: 'countryCode',
    currencyCode: 'currencyCode',
    timezone: 'timezone',
    status: 'status',
    installedAt: 'installedAt',
    uninstalledAt: 'uninstalledAt',
    lastSeenAt: 'lastSeenAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MerchantScalarFieldEnum = (typeof MerchantScalarFieldEnum)[keyof typeof MerchantScalarFieldEnum]


  export const MerchantPlanScalarFieldEnum: {
    id: 'id',
    merchantId: 'merchantId',
    shopifySubscriptionGid: 'shopifySubscriptionGid',
    planKey: 'planKey',
    planName: 'planName',
    billingModel: 'billingModel',
    billingInterval: 'billingInterval',
    status: 'status',
    isTest: 'isTest',
    activatedAt: 'activatedAt',
    currentPeriodEndAt: 'currentPeriodEndAt',
    trialEndsAt: 'trialEndsAt',
    canceledAt: 'canceledAt',
    rawPayloadJson: 'rawPayloadJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MerchantPlanScalarFieldEnum = (typeof MerchantPlanScalarFieldEnum)[keyof typeof MerchantPlanScalarFieldEnum]


  export const MerchantEventScalarFieldEnum: {
    id: 'id',
    merchantId: 'merchantId',
    type: 'type',
    severity: 'severity',
    source: 'source',
    payloadJson: 'payloadJson',
    createdAt: 'createdAt'
  };

  export type MerchantEventScalarFieldEnum = (typeof MerchantEventScalarFieldEnum)[keyof typeof MerchantEventScalarFieldEnum]


  export const MerchantDataDeletionRequestScalarFieldEnum: {
    id: 'id',
    merchantId: 'merchantId',
    requestedBy: 'requestedBy',
    status: 'status',
    scopeJson: 'scopeJson',
    completedAt: 'completedAt',
    failureReason: 'failureReason',
    auditNotes: 'auditNotes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MerchantDataDeletionRequestScalarFieldEnum = (typeof MerchantDataDeletionRequestScalarFieldEnum)[keyof typeof MerchantDataDeletionRequestScalarFieldEnum]


  export const AdminPlanDefinitionScalarFieldEnum: {
    id: 'id',
    planKey: 'planKey',
    displayName: 'displayName',
    monthlyPrice: 'monthlyPrice',
    yearlyPrice: 'yearlyPrice',
    tagline: 'tagline',
    bestFor: 'bestFor',
    merchantFacingHighlightsJson: 'merchantFacingHighlightsJson',
    opsHighlightsJson: 'opsHighlightsJson',
    isActive: 'isActive',
    isPublic: 'isPublic',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminPlanDefinitionScalarFieldEnum = (typeof AdminPlanDefinitionScalarFieldEnum)[keyof typeof AdminPlanDefinitionScalarFieldEnum]


  export const InternalAdminAccountScalarFieldEnum: {
    id: 'id',
    email: 'email',
    displayName: 'displayName',
    passwordHash: 'passwordHash',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type InternalAdminAccountScalarFieldEnum = (typeof InternalAdminAccountScalarFieldEnum)[keyof typeof InternalAdminAccountScalarFieldEnum]


  export const SubscriptionRuleScalarFieldEnum: {
    id: 'id',
    shop: 'shop',
    title: 'title',
    internalName: 'internalName',
    planSelectorLabel: 'planSelectorLabel',
    discountType: 'discountType',
    discountValue: 'discountValue',
    planIntervalsJson: 'planIntervalsJson',
    sellingPlanGroupGid: 'sellingPlanGroupGid',
    defaultSellingPlanGid: 'defaultSellingPlanGid',
    productScope: 'productScope',
    explicitProductGidsJson: 'explicitProductGidsJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionRuleScalarFieldEnum = (typeof SubscriptionRuleScalarFieldEnum)[keyof typeof SubscriptionRuleScalarFieldEnum]


  export const SubscriptionOfferScalarFieldEnum: {
    id: 'id',
    shop: 'shop',
    title: 'title',
    productGid: 'productGid',
    sellingPlanGroupGid: 'sellingPlanGroupGid',
    defaultSellingPlanGid: 'defaultSellingPlanGid',
    discountType: 'discountType',
    discountValue: 'discountValue',
    planIntervalsJson: 'planIntervalsJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SubscriptionOfferScalarFieldEnum = (typeof SubscriptionOfferScalarFieldEnum)[keyof typeof SubscriptionOfferScalarFieldEnum]


  export const WidgetSettingsScalarFieldEnum: {
    id: 'id',
    shop: 'shop',
    showWidgetOnProductPage: 'showWidgetOnProductPage',
    buyMoreHeading: 'buyMoreHeading',
    purchaseOptionsLabel: 'purchaseOptionsLabel',
    primaryColorHex: 'primaryColorHex',
    accentGreenHex: 'accentGreenHex',
    fontFamily: 'fontFamily',
    borderRadiusPx: 'borderRadiusPx',
    borderThicknessPx: 'borderThicknessPx',
    showSavingsBadge: 'showSavingsBadge',
    showCompareAtPrice: 'showCompareAtPrice',
    showSubscriptionDetails: 'showSubscriptionDetails',
    customCssEnabled: 'customCssEnabled',
    customCss: 'customCss',
    subscriptionFooter: 'subscriptionFooter',
    freeShippingNote: 'freeShippingNote',
    defaultSubscriptionDiscountType: 'defaultSubscriptionDiscountType',
    defaultSubscriptionDiscountValue: 'defaultSubscriptionDiscountValue',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WidgetSettingsScalarFieldEnum = (typeof WidgetSettingsScalarFieldEnum)[keyof typeof WidgetSettingsScalarFieldEnum]


  export const WidgetEnabledProductScalarFieldEnum: {
    id: 'id',
    shop: 'shop',
    productGid: 'productGid',
    productTitle: 'productTitle',
    createdAt: 'createdAt'
  };

  export type WidgetEnabledProductScalarFieldEnum = (typeof WidgetEnabledProductScalarFieldEnum)[keyof typeof WidgetEnabledProductScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    shop?: StringFilter<"Session"> | string
    state?: StringFilter<"Session"> | string
    isOnline?: BoolFilter<"Session"> | boolean
    scope?: StringNullableFilter<"Session"> | string | null
    expires?: DateTimeNullableFilter<"Session"> | Date | string | null
    accessToken?: StringFilter<"Session"> | string
    userId?: BigIntNullableFilter<"Session"> | bigint | number | null
    firstName?: StringNullableFilter<"Session"> | string | null
    lastName?: StringNullableFilter<"Session"> | string | null
    email?: StringNullableFilter<"Session"> | string | null
    accountOwner?: BoolFilter<"Session"> | boolean
    locale?: StringNullableFilter<"Session"> | string | null
    collaborator?: BoolNullableFilter<"Session"> | boolean | null
    emailVerified?: BoolNullableFilter<"Session"> | boolean | null
    refreshToken?: StringNullableFilter<"Session"> | string | null
    refreshTokenExpires?: DateTimeNullableFilter<"Session"> | Date | string | null
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    shop?: SortOrder
    state?: SortOrder
    isOnline?: SortOrder
    scope?: SortOrderInput | SortOrder
    expires?: SortOrderInput | SortOrder
    accessToken?: SortOrder
    userId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    accountOwner?: SortOrder
    locale?: SortOrderInput | SortOrder
    collaborator?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    refreshTokenExpires?: SortOrderInput | SortOrder
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    shop?: StringFilter<"Session"> | string
    state?: StringFilter<"Session"> | string
    isOnline?: BoolFilter<"Session"> | boolean
    scope?: StringNullableFilter<"Session"> | string | null
    expires?: DateTimeNullableFilter<"Session"> | Date | string | null
    accessToken?: StringFilter<"Session"> | string
    userId?: BigIntNullableFilter<"Session"> | bigint | number | null
    firstName?: StringNullableFilter<"Session"> | string | null
    lastName?: StringNullableFilter<"Session"> | string | null
    email?: StringNullableFilter<"Session"> | string | null
    accountOwner?: BoolFilter<"Session"> | boolean
    locale?: StringNullableFilter<"Session"> | string | null
    collaborator?: BoolNullableFilter<"Session"> | boolean | null
    emailVerified?: BoolNullableFilter<"Session"> | boolean | null
    refreshToken?: StringNullableFilter<"Session"> | string | null
    refreshTokenExpires?: DateTimeNullableFilter<"Session"> | Date | string | null
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    shop?: SortOrder
    state?: SortOrder
    isOnline?: SortOrder
    scope?: SortOrderInput | SortOrder
    expires?: SortOrderInput | SortOrder
    accessToken?: SortOrder
    userId?: SortOrderInput | SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    accountOwner?: SortOrder
    locale?: SortOrderInput | SortOrder
    collaborator?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    refreshTokenExpires?: SortOrderInput | SortOrder
    _count?: SessionCountOrderByAggregateInput
    _avg?: SessionAvgOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
    _sum?: SessionSumOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    shop?: StringWithAggregatesFilter<"Session"> | string
    state?: StringWithAggregatesFilter<"Session"> | string
    isOnline?: BoolWithAggregatesFilter<"Session"> | boolean
    scope?: StringNullableWithAggregatesFilter<"Session"> | string | null
    expires?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
    accessToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: BigIntNullableWithAggregatesFilter<"Session"> | bigint | number | null
    firstName?: StringNullableWithAggregatesFilter<"Session"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"Session"> | string | null
    email?: StringNullableWithAggregatesFilter<"Session"> | string | null
    accountOwner?: BoolWithAggregatesFilter<"Session"> | boolean
    locale?: StringNullableWithAggregatesFilter<"Session"> | string | null
    collaborator?: BoolNullableWithAggregatesFilter<"Session"> | boolean | null
    emailVerified?: BoolNullableWithAggregatesFilter<"Session"> | boolean | null
    refreshToken?: StringNullableWithAggregatesFilter<"Session"> | string | null
    refreshTokenExpires?: DateTimeNullableWithAggregatesFilter<"Session"> | Date | string | null
  }

  export type MerchantWhereInput = {
    AND?: MerchantWhereInput | MerchantWhereInput[]
    OR?: MerchantWhereInput[]
    NOT?: MerchantWhereInput | MerchantWhereInput[]
    id?: StringFilter<"Merchant"> | string
    shopDomain?: StringFilter<"Merchant"> | string
    shopGid?: StringNullableFilter<"Merchant"> | string | null
    shopName?: StringNullableFilter<"Merchant"> | string | null
    email?: StringNullableFilter<"Merchant"> | string | null
    countryCode?: StringNullableFilter<"Merchant"> | string | null
    currencyCode?: StringNullableFilter<"Merchant"> | string | null
    timezone?: StringNullableFilter<"Merchant"> | string | null
    status?: StringFilter<"Merchant"> | string
    installedAt?: DateTimeFilter<"Merchant"> | Date | string
    uninstalledAt?: DateTimeNullableFilter<"Merchant"> | Date | string | null
    lastSeenAt?: DateTimeFilter<"Merchant"> | Date | string
    createdAt?: DateTimeFilter<"Merchant"> | Date | string
    updatedAt?: DateTimeFilter<"Merchant"> | Date | string
    plans?: MerchantPlanListRelationFilter
    events?: MerchantEventListRelationFilter
    deletionRequests?: MerchantDataDeletionRequestListRelationFilter
  }

  export type MerchantOrderByWithRelationInput = {
    id?: SortOrder
    shopDomain?: SortOrder
    shopGid?: SortOrderInput | SortOrder
    shopName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    currencyCode?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    status?: SortOrder
    installedAt?: SortOrder
    uninstalledAt?: SortOrderInput | SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    plans?: MerchantPlanOrderByRelationAggregateInput
    events?: MerchantEventOrderByRelationAggregateInput
    deletionRequests?: MerchantDataDeletionRequestOrderByRelationAggregateInput
  }

  export type MerchantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shopDomain?: string
    AND?: MerchantWhereInput | MerchantWhereInput[]
    OR?: MerchantWhereInput[]
    NOT?: MerchantWhereInput | MerchantWhereInput[]
    shopGid?: StringNullableFilter<"Merchant"> | string | null
    shopName?: StringNullableFilter<"Merchant"> | string | null
    email?: StringNullableFilter<"Merchant"> | string | null
    countryCode?: StringNullableFilter<"Merchant"> | string | null
    currencyCode?: StringNullableFilter<"Merchant"> | string | null
    timezone?: StringNullableFilter<"Merchant"> | string | null
    status?: StringFilter<"Merchant"> | string
    installedAt?: DateTimeFilter<"Merchant"> | Date | string
    uninstalledAt?: DateTimeNullableFilter<"Merchant"> | Date | string | null
    lastSeenAt?: DateTimeFilter<"Merchant"> | Date | string
    createdAt?: DateTimeFilter<"Merchant"> | Date | string
    updatedAt?: DateTimeFilter<"Merchant"> | Date | string
    plans?: MerchantPlanListRelationFilter
    events?: MerchantEventListRelationFilter
    deletionRequests?: MerchantDataDeletionRequestListRelationFilter
  }, "id" | "shopDomain">

  export type MerchantOrderByWithAggregationInput = {
    id?: SortOrder
    shopDomain?: SortOrder
    shopGid?: SortOrderInput | SortOrder
    shopName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    countryCode?: SortOrderInput | SortOrder
    currencyCode?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    status?: SortOrder
    installedAt?: SortOrder
    uninstalledAt?: SortOrderInput | SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MerchantCountOrderByAggregateInput
    _max?: MerchantMaxOrderByAggregateInput
    _min?: MerchantMinOrderByAggregateInput
  }

  export type MerchantScalarWhereWithAggregatesInput = {
    AND?: MerchantScalarWhereWithAggregatesInput | MerchantScalarWhereWithAggregatesInput[]
    OR?: MerchantScalarWhereWithAggregatesInput[]
    NOT?: MerchantScalarWhereWithAggregatesInput | MerchantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Merchant"> | string
    shopDomain?: StringWithAggregatesFilter<"Merchant"> | string
    shopGid?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    shopName?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    email?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    countryCode?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    currencyCode?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    timezone?: StringNullableWithAggregatesFilter<"Merchant"> | string | null
    status?: StringWithAggregatesFilter<"Merchant"> | string
    installedAt?: DateTimeWithAggregatesFilter<"Merchant"> | Date | string
    uninstalledAt?: DateTimeNullableWithAggregatesFilter<"Merchant"> | Date | string | null
    lastSeenAt?: DateTimeWithAggregatesFilter<"Merchant"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Merchant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Merchant"> | Date | string
  }

  export type MerchantPlanWhereInput = {
    AND?: MerchantPlanWhereInput | MerchantPlanWhereInput[]
    OR?: MerchantPlanWhereInput[]
    NOT?: MerchantPlanWhereInput | MerchantPlanWhereInput[]
    id?: StringFilter<"MerchantPlan"> | string
    merchantId?: StringFilter<"MerchantPlan"> | string
    shopifySubscriptionGid?: StringNullableFilter<"MerchantPlan"> | string | null
    planKey?: StringFilter<"MerchantPlan"> | string
    planName?: StringFilter<"MerchantPlan"> | string
    billingModel?: StringFilter<"MerchantPlan"> | string
    billingInterval?: StringNullableFilter<"MerchantPlan"> | string | null
    status?: StringFilter<"MerchantPlan"> | string
    isTest?: BoolFilter<"MerchantPlan"> | boolean
    activatedAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    currentPeriodEndAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    trialEndsAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    canceledAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    rawPayloadJson?: StringFilter<"MerchantPlan"> | string
    createdAt?: DateTimeFilter<"MerchantPlan"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantPlan"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }

  export type MerchantPlanOrderByWithRelationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    shopifySubscriptionGid?: SortOrderInput | SortOrder
    planKey?: SortOrder
    planName?: SortOrder
    billingModel?: SortOrder
    billingInterval?: SortOrderInput | SortOrder
    status?: SortOrder
    isTest?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    currentPeriodEndAt?: SortOrderInput | SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    canceledAt?: SortOrderInput | SortOrder
    rawPayloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    merchant?: MerchantOrderByWithRelationInput
  }

  export type MerchantPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MerchantPlanWhereInput | MerchantPlanWhereInput[]
    OR?: MerchantPlanWhereInput[]
    NOT?: MerchantPlanWhereInput | MerchantPlanWhereInput[]
    merchantId?: StringFilter<"MerchantPlan"> | string
    shopifySubscriptionGid?: StringNullableFilter<"MerchantPlan"> | string | null
    planKey?: StringFilter<"MerchantPlan"> | string
    planName?: StringFilter<"MerchantPlan"> | string
    billingModel?: StringFilter<"MerchantPlan"> | string
    billingInterval?: StringNullableFilter<"MerchantPlan"> | string | null
    status?: StringFilter<"MerchantPlan"> | string
    isTest?: BoolFilter<"MerchantPlan"> | boolean
    activatedAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    currentPeriodEndAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    trialEndsAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    canceledAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    rawPayloadJson?: StringFilter<"MerchantPlan"> | string
    createdAt?: DateTimeFilter<"MerchantPlan"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantPlan"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }, "id">

  export type MerchantPlanOrderByWithAggregationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    shopifySubscriptionGid?: SortOrderInput | SortOrder
    planKey?: SortOrder
    planName?: SortOrder
    billingModel?: SortOrder
    billingInterval?: SortOrderInput | SortOrder
    status?: SortOrder
    isTest?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    currentPeriodEndAt?: SortOrderInput | SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    canceledAt?: SortOrderInput | SortOrder
    rawPayloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MerchantPlanCountOrderByAggregateInput
    _max?: MerchantPlanMaxOrderByAggregateInput
    _min?: MerchantPlanMinOrderByAggregateInput
  }

  export type MerchantPlanScalarWhereWithAggregatesInput = {
    AND?: MerchantPlanScalarWhereWithAggregatesInput | MerchantPlanScalarWhereWithAggregatesInput[]
    OR?: MerchantPlanScalarWhereWithAggregatesInput[]
    NOT?: MerchantPlanScalarWhereWithAggregatesInput | MerchantPlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MerchantPlan"> | string
    merchantId?: StringWithAggregatesFilter<"MerchantPlan"> | string
    shopifySubscriptionGid?: StringNullableWithAggregatesFilter<"MerchantPlan"> | string | null
    planKey?: StringWithAggregatesFilter<"MerchantPlan"> | string
    planName?: StringWithAggregatesFilter<"MerchantPlan"> | string
    billingModel?: StringWithAggregatesFilter<"MerchantPlan"> | string
    billingInterval?: StringNullableWithAggregatesFilter<"MerchantPlan"> | string | null
    status?: StringWithAggregatesFilter<"MerchantPlan"> | string
    isTest?: BoolWithAggregatesFilter<"MerchantPlan"> | boolean
    activatedAt?: DateTimeNullableWithAggregatesFilter<"MerchantPlan"> | Date | string | null
    currentPeriodEndAt?: DateTimeNullableWithAggregatesFilter<"MerchantPlan"> | Date | string | null
    trialEndsAt?: DateTimeNullableWithAggregatesFilter<"MerchantPlan"> | Date | string | null
    canceledAt?: DateTimeNullableWithAggregatesFilter<"MerchantPlan"> | Date | string | null
    rawPayloadJson?: StringWithAggregatesFilter<"MerchantPlan"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MerchantPlan"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MerchantPlan"> | Date | string
  }

  export type MerchantEventWhereInput = {
    AND?: MerchantEventWhereInput | MerchantEventWhereInput[]
    OR?: MerchantEventWhereInput[]
    NOT?: MerchantEventWhereInput | MerchantEventWhereInput[]
    id?: StringFilter<"MerchantEvent"> | string
    merchantId?: StringFilter<"MerchantEvent"> | string
    type?: StringFilter<"MerchantEvent"> | string
    severity?: StringFilter<"MerchantEvent"> | string
    source?: StringFilter<"MerchantEvent"> | string
    payloadJson?: StringFilter<"MerchantEvent"> | string
    createdAt?: DateTimeFilter<"MerchantEvent"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }

  export type MerchantEventOrderByWithRelationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    merchant?: MerchantOrderByWithRelationInput
  }

  export type MerchantEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MerchantEventWhereInput | MerchantEventWhereInput[]
    OR?: MerchantEventWhereInput[]
    NOT?: MerchantEventWhereInput | MerchantEventWhereInput[]
    merchantId?: StringFilter<"MerchantEvent"> | string
    type?: StringFilter<"MerchantEvent"> | string
    severity?: StringFilter<"MerchantEvent"> | string
    source?: StringFilter<"MerchantEvent"> | string
    payloadJson?: StringFilter<"MerchantEvent"> | string
    createdAt?: DateTimeFilter<"MerchantEvent"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }, "id">

  export type MerchantEventOrderByWithAggregationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    _count?: MerchantEventCountOrderByAggregateInput
    _max?: MerchantEventMaxOrderByAggregateInput
    _min?: MerchantEventMinOrderByAggregateInput
  }

  export type MerchantEventScalarWhereWithAggregatesInput = {
    AND?: MerchantEventScalarWhereWithAggregatesInput | MerchantEventScalarWhereWithAggregatesInput[]
    OR?: MerchantEventScalarWhereWithAggregatesInput[]
    NOT?: MerchantEventScalarWhereWithAggregatesInput | MerchantEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MerchantEvent"> | string
    merchantId?: StringWithAggregatesFilter<"MerchantEvent"> | string
    type?: StringWithAggregatesFilter<"MerchantEvent"> | string
    severity?: StringWithAggregatesFilter<"MerchantEvent"> | string
    source?: StringWithAggregatesFilter<"MerchantEvent"> | string
    payloadJson?: StringWithAggregatesFilter<"MerchantEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MerchantEvent"> | Date | string
  }

  export type MerchantDataDeletionRequestWhereInput = {
    AND?: MerchantDataDeletionRequestWhereInput | MerchantDataDeletionRequestWhereInput[]
    OR?: MerchantDataDeletionRequestWhereInput[]
    NOT?: MerchantDataDeletionRequestWhereInput | MerchantDataDeletionRequestWhereInput[]
    id?: StringFilter<"MerchantDataDeletionRequest"> | string
    merchantId?: StringFilter<"MerchantDataDeletionRequest"> | string
    requestedBy?: StringFilter<"MerchantDataDeletionRequest"> | string
    status?: StringFilter<"MerchantDataDeletionRequest"> | string
    scopeJson?: StringFilter<"MerchantDataDeletionRequest"> | string
    completedAt?: DateTimeNullableFilter<"MerchantDataDeletionRequest"> | Date | string | null
    failureReason?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    auditNotes?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    createdAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }

  export type MerchantDataDeletionRequestOrderByWithRelationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scopeJson?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    auditNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    merchant?: MerchantOrderByWithRelationInput
  }

  export type MerchantDataDeletionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MerchantDataDeletionRequestWhereInput | MerchantDataDeletionRequestWhereInput[]
    OR?: MerchantDataDeletionRequestWhereInput[]
    NOT?: MerchantDataDeletionRequestWhereInput | MerchantDataDeletionRequestWhereInput[]
    merchantId?: StringFilter<"MerchantDataDeletionRequest"> | string
    requestedBy?: StringFilter<"MerchantDataDeletionRequest"> | string
    status?: StringFilter<"MerchantDataDeletionRequest"> | string
    scopeJson?: StringFilter<"MerchantDataDeletionRequest"> | string
    completedAt?: DateTimeNullableFilter<"MerchantDataDeletionRequest"> | Date | string | null
    failureReason?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    auditNotes?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    createdAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
    merchant?: XOR<MerchantScalarRelationFilter, MerchantWhereInput>
  }, "id">

  export type MerchantDataDeletionRequestOrderByWithAggregationInput = {
    id?: SortOrder
    merchantId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scopeJson?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    failureReason?: SortOrderInput | SortOrder
    auditNotes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MerchantDataDeletionRequestCountOrderByAggregateInput
    _max?: MerchantDataDeletionRequestMaxOrderByAggregateInput
    _min?: MerchantDataDeletionRequestMinOrderByAggregateInput
  }

  export type MerchantDataDeletionRequestScalarWhereWithAggregatesInput = {
    AND?: MerchantDataDeletionRequestScalarWhereWithAggregatesInput | MerchantDataDeletionRequestScalarWhereWithAggregatesInput[]
    OR?: MerchantDataDeletionRequestScalarWhereWithAggregatesInput[]
    NOT?: MerchantDataDeletionRequestScalarWhereWithAggregatesInput | MerchantDataDeletionRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MerchantDataDeletionRequest"> | string
    merchantId?: StringWithAggregatesFilter<"MerchantDataDeletionRequest"> | string
    requestedBy?: StringWithAggregatesFilter<"MerchantDataDeletionRequest"> | string
    status?: StringWithAggregatesFilter<"MerchantDataDeletionRequest"> | string
    scopeJson?: StringWithAggregatesFilter<"MerchantDataDeletionRequest"> | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"MerchantDataDeletionRequest"> | Date | string | null
    failureReason?: StringNullableWithAggregatesFilter<"MerchantDataDeletionRequest"> | string | null
    auditNotes?: StringNullableWithAggregatesFilter<"MerchantDataDeletionRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MerchantDataDeletionRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MerchantDataDeletionRequest"> | Date | string
  }

  export type AdminPlanDefinitionWhereInput = {
    AND?: AdminPlanDefinitionWhereInput | AdminPlanDefinitionWhereInput[]
    OR?: AdminPlanDefinitionWhereInput[]
    NOT?: AdminPlanDefinitionWhereInput | AdminPlanDefinitionWhereInput[]
    id?: StringFilter<"AdminPlanDefinition"> | string
    planKey?: StringFilter<"AdminPlanDefinition"> | string
    displayName?: StringFilter<"AdminPlanDefinition"> | string
    monthlyPrice?: StringFilter<"AdminPlanDefinition"> | string
    yearlyPrice?: StringFilter<"AdminPlanDefinition"> | string
    tagline?: StringFilter<"AdminPlanDefinition"> | string
    bestFor?: StringFilter<"AdminPlanDefinition"> | string
    merchantFacingHighlightsJson?: StringFilter<"AdminPlanDefinition"> | string
    opsHighlightsJson?: StringFilter<"AdminPlanDefinition"> | string
    isActive?: BoolFilter<"AdminPlanDefinition"> | boolean
    isPublic?: BoolFilter<"AdminPlanDefinition"> | boolean
    sortOrder?: IntFilter<"AdminPlanDefinition"> | number
    createdAt?: DateTimeFilter<"AdminPlanDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"AdminPlanDefinition"> | Date | string
  }

  export type AdminPlanDefinitionOrderByWithRelationInput = {
    id?: SortOrder
    planKey?: SortOrder
    displayName?: SortOrder
    monthlyPrice?: SortOrder
    yearlyPrice?: SortOrder
    tagline?: SortOrder
    bestFor?: SortOrder
    merchantFacingHighlightsJson?: SortOrder
    opsHighlightsJson?: SortOrder
    isActive?: SortOrder
    isPublic?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminPlanDefinitionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    planKey?: string
    AND?: AdminPlanDefinitionWhereInput | AdminPlanDefinitionWhereInput[]
    OR?: AdminPlanDefinitionWhereInput[]
    NOT?: AdminPlanDefinitionWhereInput | AdminPlanDefinitionWhereInput[]
    displayName?: StringFilter<"AdminPlanDefinition"> | string
    monthlyPrice?: StringFilter<"AdminPlanDefinition"> | string
    yearlyPrice?: StringFilter<"AdminPlanDefinition"> | string
    tagline?: StringFilter<"AdminPlanDefinition"> | string
    bestFor?: StringFilter<"AdminPlanDefinition"> | string
    merchantFacingHighlightsJson?: StringFilter<"AdminPlanDefinition"> | string
    opsHighlightsJson?: StringFilter<"AdminPlanDefinition"> | string
    isActive?: BoolFilter<"AdminPlanDefinition"> | boolean
    isPublic?: BoolFilter<"AdminPlanDefinition"> | boolean
    sortOrder?: IntFilter<"AdminPlanDefinition"> | number
    createdAt?: DateTimeFilter<"AdminPlanDefinition"> | Date | string
    updatedAt?: DateTimeFilter<"AdminPlanDefinition"> | Date | string
  }, "id" | "planKey">

  export type AdminPlanDefinitionOrderByWithAggregationInput = {
    id?: SortOrder
    planKey?: SortOrder
    displayName?: SortOrder
    monthlyPrice?: SortOrder
    yearlyPrice?: SortOrder
    tagline?: SortOrder
    bestFor?: SortOrder
    merchantFacingHighlightsJson?: SortOrder
    opsHighlightsJson?: SortOrder
    isActive?: SortOrder
    isPublic?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminPlanDefinitionCountOrderByAggregateInput
    _avg?: AdminPlanDefinitionAvgOrderByAggregateInput
    _max?: AdminPlanDefinitionMaxOrderByAggregateInput
    _min?: AdminPlanDefinitionMinOrderByAggregateInput
    _sum?: AdminPlanDefinitionSumOrderByAggregateInput
  }

  export type AdminPlanDefinitionScalarWhereWithAggregatesInput = {
    AND?: AdminPlanDefinitionScalarWhereWithAggregatesInput | AdminPlanDefinitionScalarWhereWithAggregatesInput[]
    OR?: AdminPlanDefinitionScalarWhereWithAggregatesInput[]
    NOT?: AdminPlanDefinitionScalarWhereWithAggregatesInput | AdminPlanDefinitionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    planKey?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    displayName?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    monthlyPrice?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    yearlyPrice?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    tagline?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    bestFor?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    merchantFacingHighlightsJson?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    opsHighlightsJson?: StringWithAggregatesFilter<"AdminPlanDefinition"> | string
    isActive?: BoolWithAggregatesFilter<"AdminPlanDefinition"> | boolean
    isPublic?: BoolWithAggregatesFilter<"AdminPlanDefinition"> | boolean
    sortOrder?: IntWithAggregatesFilter<"AdminPlanDefinition"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AdminPlanDefinition"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AdminPlanDefinition"> | Date | string
  }

  export type InternalAdminAccountWhereInput = {
    AND?: InternalAdminAccountWhereInput | InternalAdminAccountWhereInput[]
    OR?: InternalAdminAccountWhereInput[]
    NOT?: InternalAdminAccountWhereInput | InternalAdminAccountWhereInput[]
    id?: StringFilter<"InternalAdminAccount"> | string
    email?: StringFilter<"InternalAdminAccount"> | string
    displayName?: StringFilter<"InternalAdminAccount"> | string
    passwordHash?: StringFilter<"InternalAdminAccount"> | string
    isActive?: BoolFilter<"InternalAdminAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"InternalAdminAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"InternalAdminAccount"> | Date | string
    updatedAt?: DateTimeFilter<"InternalAdminAccount"> | Date | string
  }

  export type InternalAdminAccountOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InternalAdminAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: InternalAdminAccountWhereInput | InternalAdminAccountWhereInput[]
    OR?: InternalAdminAccountWhereInput[]
    NOT?: InternalAdminAccountWhereInput | InternalAdminAccountWhereInput[]
    displayName?: StringFilter<"InternalAdminAccount"> | string
    passwordHash?: StringFilter<"InternalAdminAccount"> | string
    isActive?: BoolFilter<"InternalAdminAccount"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"InternalAdminAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"InternalAdminAccount"> | Date | string
    updatedAt?: DateTimeFilter<"InternalAdminAccount"> | Date | string
  }, "id" | "email">

  export type InternalAdminAccountOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: InternalAdminAccountCountOrderByAggregateInput
    _max?: InternalAdminAccountMaxOrderByAggregateInput
    _min?: InternalAdminAccountMinOrderByAggregateInput
  }

  export type InternalAdminAccountScalarWhereWithAggregatesInput = {
    AND?: InternalAdminAccountScalarWhereWithAggregatesInput | InternalAdminAccountScalarWhereWithAggregatesInput[]
    OR?: InternalAdminAccountScalarWhereWithAggregatesInput[]
    NOT?: InternalAdminAccountScalarWhereWithAggregatesInput | InternalAdminAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InternalAdminAccount"> | string
    email?: StringWithAggregatesFilter<"InternalAdminAccount"> | string
    displayName?: StringWithAggregatesFilter<"InternalAdminAccount"> | string
    passwordHash?: StringWithAggregatesFilter<"InternalAdminAccount"> | string
    isActive?: BoolWithAggregatesFilter<"InternalAdminAccount"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"InternalAdminAccount"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"InternalAdminAccount"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"InternalAdminAccount"> | Date | string
  }

  export type SubscriptionRuleWhereInput = {
    AND?: SubscriptionRuleWhereInput | SubscriptionRuleWhereInput[]
    OR?: SubscriptionRuleWhereInput[]
    NOT?: SubscriptionRuleWhereInput | SubscriptionRuleWhereInput[]
    id?: StringFilter<"SubscriptionRule"> | string
    shop?: StringFilter<"SubscriptionRule"> | string
    title?: StringFilter<"SubscriptionRule"> | string
    internalName?: StringNullableFilter<"SubscriptionRule"> | string | null
    planSelectorLabel?: StringFilter<"SubscriptionRule"> | string
    discountType?: StringFilter<"SubscriptionRule"> | string
    discountValue?: StringFilter<"SubscriptionRule"> | string
    planIntervalsJson?: StringFilter<"SubscriptionRule"> | string
    sellingPlanGroupGid?: StringNullableFilter<"SubscriptionRule"> | string | null
    defaultSellingPlanGid?: StringNullableFilter<"SubscriptionRule"> | string | null
    productScope?: StringFilter<"SubscriptionRule"> | string
    explicitProductGidsJson?: StringFilter<"SubscriptionRule"> | string
    createdAt?: DateTimeFilter<"SubscriptionRule"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionRule"> | Date | string
  }

  export type SubscriptionRuleOrderByWithRelationInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    internalName?: SortOrderInput | SortOrder
    planSelectorLabel?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    sellingPlanGroupGid?: SortOrderInput | SortOrder
    defaultSellingPlanGid?: SortOrderInput | SortOrder
    productScope?: SortOrder
    explicitProductGidsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shop?: string
    AND?: SubscriptionRuleWhereInput | SubscriptionRuleWhereInput[]
    OR?: SubscriptionRuleWhereInput[]
    NOT?: SubscriptionRuleWhereInput | SubscriptionRuleWhereInput[]
    title?: StringFilter<"SubscriptionRule"> | string
    internalName?: StringNullableFilter<"SubscriptionRule"> | string | null
    planSelectorLabel?: StringFilter<"SubscriptionRule"> | string
    discountType?: StringFilter<"SubscriptionRule"> | string
    discountValue?: StringFilter<"SubscriptionRule"> | string
    planIntervalsJson?: StringFilter<"SubscriptionRule"> | string
    sellingPlanGroupGid?: StringNullableFilter<"SubscriptionRule"> | string | null
    defaultSellingPlanGid?: StringNullableFilter<"SubscriptionRule"> | string | null
    productScope?: StringFilter<"SubscriptionRule"> | string
    explicitProductGidsJson?: StringFilter<"SubscriptionRule"> | string
    createdAt?: DateTimeFilter<"SubscriptionRule"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionRule"> | Date | string
  }, "id" | "shop">

  export type SubscriptionRuleOrderByWithAggregationInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    internalName?: SortOrderInput | SortOrder
    planSelectorLabel?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    sellingPlanGroupGid?: SortOrderInput | SortOrder
    defaultSellingPlanGid?: SortOrderInput | SortOrder
    productScope?: SortOrder
    explicitProductGidsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionRuleCountOrderByAggregateInput
    _max?: SubscriptionRuleMaxOrderByAggregateInput
    _min?: SubscriptionRuleMinOrderByAggregateInput
  }

  export type SubscriptionRuleScalarWhereWithAggregatesInput = {
    AND?: SubscriptionRuleScalarWhereWithAggregatesInput | SubscriptionRuleScalarWhereWithAggregatesInput[]
    OR?: SubscriptionRuleScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionRuleScalarWhereWithAggregatesInput | SubscriptionRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    shop?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    title?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    internalName?: StringNullableWithAggregatesFilter<"SubscriptionRule"> | string | null
    planSelectorLabel?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    discountType?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    discountValue?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    planIntervalsJson?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    sellingPlanGroupGid?: StringNullableWithAggregatesFilter<"SubscriptionRule"> | string | null
    defaultSellingPlanGid?: StringNullableWithAggregatesFilter<"SubscriptionRule"> | string | null
    productScope?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    explicitProductGidsJson?: StringWithAggregatesFilter<"SubscriptionRule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionRule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubscriptionRule"> | Date | string
  }

  export type SubscriptionOfferWhereInput = {
    AND?: SubscriptionOfferWhereInput | SubscriptionOfferWhereInput[]
    OR?: SubscriptionOfferWhereInput[]
    NOT?: SubscriptionOfferWhereInput | SubscriptionOfferWhereInput[]
    id?: StringFilter<"SubscriptionOffer"> | string
    shop?: StringFilter<"SubscriptionOffer"> | string
    title?: StringFilter<"SubscriptionOffer"> | string
    productGid?: StringFilter<"SubscriptionOffer"> | string
    sellingPlanGroupGid?: StringNullableFilter<"SubscriptionOffer"> | string | null
    defaultSellingPlanGid?: StringNullableFilter<"SubscriptionOffer"> | string | null
    discountType?: StringFilter<"SubscriptionOffer"> | string
    discountValue?: StringFilter<"SubscriptionOffer"> | string
    planIntervalsJson?: StringFilter<"SubscriptionOffer"> | string
    createdAt?: DateTimeFilter<"SubscriptionOffer"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionOffer"> | Date | string
  }

  export type SubscriptionOfferOrderByWithRelationInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    productGid?: SortOrder
    sellingPlanGroupGid?: SortOrderInput | SortOrder
    defaultSellingPlanGid?: SortOrderInput | SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionOfferWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionOfferWhereInput | SubscriptionOfferWhereInput[]
    OR?: SubscriptionOfferWhereInput[]
    NOT?: SubscriptionOfferWhereInput | SubscriptionOfferWhereInput[]
    shop?: StringFilter<"SubscriptionOffer"> | string
    title?: StringFilter<"SubscriptionOffer"> | string
    productGid?: StringFilter<"SubscriptionOffer"> | string
    sellingPlanGroupGid?: StringNullableFilter<"SubscriptionOffer"> | string | null
    defaultSellingPlanGid?: StringNullableFilter<"SubscriptionOffer"> | string | null
    discountType?: StringFilter<"SubscriptionOffer"> | string
    discountValue?: StringFilter<"SubscriptionOffer"> | string
    planIntervalsJson?: StringFilter<"SubscriptionOffer"> | string
    createdAt?: DateTimeFilter<"SubscriptionOffer"> | Date | string
    updatedAt?: DateTimeFilter<"SubscriptionOffer"> | Date | string
  }, "id">

  export type SubscriptionOfferOrderByWithAggregationInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    productGid?: SortOrder
    sellingPlanGroupGid?: SortOrderInput | SortOrder
    defaultSellingPlanGid?: SortOrderInput | SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SubscriptionOfferCountOrderByAggregateInput
    _max?: SubscriptionOfferMaxOrderByAggregateInput
    _min?: SubscriptionOfferMinOrderByAggregateInput
  }

  export type SubscriptionOfferScalarWhereWithAggregatesInput = {
    AND?: SubscriptionOfferScalarWhereWithAggregatesInput | SubscriptionOfferScalarWhereWithAggregatesInput[]
    OR?: SubscriptionOfferScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionOfferScalarWhereWithAggregatesInput | SubscriptionOfferScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    shop?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    title?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    productGid?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    sellingPlanGroupGid?: StringNullableWithAggregatesFilter<"SubscriptionOffer"> | string | null
    defaultSellingPlanGid?: StringNullableWithAggregatesFilter<"SubscriptionOffer"> | string | null
    discountType?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    discountValue?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    planIntervalsJson?: StringWithAggregatesFilter<"SubscriptionOffer"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SubscriptionOffer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SubscriptionOffer"> | Date | string
  }

  export type WidgetSettingsWhereInput = {
    AND?: WidgetSettingsWhereInput | WidgetSettingsWhereInput[]
    OR?: WidgetSettingsWhereInput[]
    NOT?: WidgetSettingsWhereInput | WidgetSettingsWhereInput[]
    id?: StringFilter<"WidgetSettings"> | string
    shop?: StringFilter<"WidgetSettings"> | string
    showWidgetOnProductPage?: BoolFilter<"WidgetSettings"> | boolean
    buyMoreHeading?: StringFilter<"WidgetSettings"> | string
    purchaseOptionsLabel?: StringFilter<"WidgetSettings"> | string
    primaryColorHex?: StringFilter<"WidgetSettings"> | string
    accentGreenHex?: StringFilter<"WidgetSettings"> | string
    fontFamily?: StringFilter<"WidgetSettings"> | string
    borderRadiusPx?: IntFilter<"WidgetSettings"> | number
    borderThicknessPx?: IntFilter<"WidgetSettings"> | number
    showSavingsBadge?: BoolFilter<"WidgetSettings"> | boolean
    showCompareAtPrice?: BoolFilter<"WidgetSettings"> | boolean
    showSubscriptionDetails?: BoolFilter<"WidgetSettings"> | boolean
    customCssEnabled?: BoolFilter<"WidgetSettings"> | boolean
    customCss?: StringFilter<"WidgetSettings"> | string
    subscriptionFooter?: StringFilter<"WidgetSettings"> | string
    freeShippingNote?: StringFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountType?: StringFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountValue?: StringFilter<"WidgetSettings"> | string
    createdAt?: DateTimeFilter<"WidgetSettings"> | Date | string
    updatedAt?: DateTimeFilter<"WidgetSettings"> | Date | string
  }

  export type WidgetSettingsOrderByWithRelationInput = {
    id?: SortOrder
    shop?: SortOrder
    showWidgetOnProductPage?: SortOrder
    buyMoreHeading?: SortOrder
    purchaseOptionsLabel?: SortOrder
    primaryColorHex?: SortOrder
    accentGreenHex?: SortOrder
    fontFamily?: SortOrder
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
    showSavingsBadge?: SortOrder
    showCompareAtPrice?: SortOrder
    showSubscriptionDetails?: SortOrder
    customCssEnabled?: SortOrder
    customCss?: SortOrder
    subscriptionFooter?: SortOrder
    freeShippingNote?: SortOrder
    defaultSubscriptionDiscountType?: SortOrder
    defaultSubscriptionDiscountValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WidgetSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shop?: string
    AND?: WidgetSettingsWhereInput | WidgetSettingsWhereInput[]
    OR?: WidgetSettingsWhereInput[]
    NOT?: WidgetSettingsWhereInput | WidgetSettingsWhereInput[]
    showWidgetOnProductPage?: BoolFilter<"WidgetSettings"> | boolean
    buyMoreHeading?: StringFilter<"WidgetSettings"> | string
    purchaseOptionsLabel?: StringFilter<"WidgetSettings"> | string
    primaryColorHex?: StringFilter<"WidgetSettings"> | string
    accentGreenHex?: StringFilter<"WidgetSettings"> | string
    fontFamily?: StringFilter<"WidgetSettings"> | string
    borderRadiusPx?: IntFilter<"WidgetSettings"> | number
    borderThicknessPx?: IntFilter<"WidgetSettings"> | number
    showSavingsBadge?: BoolFilter<"WidgetSettings"> | boolean
    showCompareAtPrice?: BoolFilter<"WidgetSettings"> | boolean
    showSubscriptionDetails?: BoolFilter<"WidgetSettings"> | boolean
    customCssEnabled?: BoolFilter<"WidgetSettings"> | boolean
    customCss?: StringFilter<"WidgetSettings"> | string
    subscriptionFooter?: StringFilter<"WidgetSettings"> | string
    freeShippingNote?: StringFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountType?: StringFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountValue?: StringFilter<"WidgetSettings"> | string
    createdAt?: DateTimeFilter<"WidgetSettings"> | Date | string
    updatedAt?: DateTimeFilter<"WidgetSettings"> | Date | string
  }, "id" | "shop">

  export type WidgetSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    shop?: SortOrder
    showWidgetOnProductPage?: SortOrder
    buyMoreHeading?: SortOrder
    purchaseOptionsLabel?: SortOrder
    primaryColorHex?: SortOrder
    accentGreenHex?: SortOrder
    fontFamily?: SortOrder
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
    showSavingsBadge?: SortOrder
    showCompareAtPrice?: SortOrder
    showSubscriptionDetails?: SortOrder
    customCssEnabled?: SortOrder
    customCss?: SortOrder
    subscriptionFooter?: SortOrder
    freeShippingNote?: SortOrder
    defaultSubscriptionDiscountType?: SortOrder
    defaultSubscriptionDiscountValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WidgetSettingsCountOrderByAggregateInput
    _avg?: WidgetSettingsAvgOrderByAggregateInput
    _max?: WidgetSettingsMaxOrderByAggregateInput
    _min?: WidgetSettingsMinOrderByAggregateInput
    _sum?: WidgetSettingsSumOrderByAggregateInput
  }

  export type WidgetSettingsScalarWhereWithAggregatesInput = {
    AND?: WidgetSettingsScalarWhereWithAggregatesInput | WidgetSettingsScalarWhereWithAggregatesInput[]
    OR?: WidgetSettingsScalarWhereWithAggregatesInput[]
    NOT?: WidgetSettingsScalarWhereWithAggregatesInput | WidgetSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WidgetSettings"> | string
    shop?: StringWithAggregatesFilter<"WidgetSettings"> | string
    showWidgetOnProductPage?: BoolWithAggregatesFilter<"WidgetSettings"> | boolean
    buyMoreHeading?: StringWithAggregatesFilter<"WidgetSettings"> | string
    purchaseOptionsLabel?: StringWithAggregatesFilter<"WidgetSettings"> | string
    primaryColorHex?: StringWithAggregatesFilter<"WidgetSettings"> | string
    accentGreenHex?: StringWithAggregatesFilter<"WidgetSettings"> | string
    fontFamily?: StringWithAggregatesFilter<"WidgetSettings"> | string
    borderRadiusPx?: IntWithAggregatesFilter<"WidgetSettings"> | number
    borderThicknessPx?: IntWithAggregatesFilter<"WidgetSettings"> | number
    showSavingsBadge?: BoolWithAggregatesFilter<"WidgetSettings"> | boolean
    showCompareAtPrice?: BoolWithAggregatesFilter<"WidgetSettings"> | boolean
    showSubscriptionDetails?: BoolWithAggregatesFilter<"WidgetSettings"> | boolean
    customCssEnabled?: BoolWithAggregatesFilter<"WidgetSettings"> | boolean
    customCss?: StringWithAggregatesFilter<"WidgetSettings"> | string
    subscriptionFooter?: StringWithAggregatesFilter<"WidgetSettings"> | string
    freeShippingNote?: StringWithAggregatesFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountType?: StringWithAggregatesFilter<"WidgetSettings"> | string
    defaultSubscriptionDiscountValue?: StringWithAggregatesFilter<"WidgetSettings"> | string
    createdAt?: DateTimeWithAggregatesFilter<"WidgetSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WidgetSettings"> | Date | string
  }

  export type WidgetEnabledProductWhereInput = {
    AND?: WidgetEnabledProductWhereInput | WidgetEnabledProductWhereInput[]
    OR?: WidgetEnabledProductWhereInput[]
    NOT?: WidgetEnabledProductWhereInput | WidgetEnabledProductWhereInput[]
    id?: StringFilter<"WidgetEnabledProduct"> | string
    shop?: StringFilter<"WidgetEnabledProduct"> | string
    productGid?: StringFilter<"WidgetEnabledProduct"> | string
    productTitle?: StringNullableFilter<"WidgetEnabledProduct"> | string | null
    createdAt?: DateTimeFilter<"WidgetEnabledProduct"> | Date | string
  }

  export type WidgetEnabledProductOrderByWithRelationInput = {
    id?: SortOrder
    shop?: SortOrder
    productGid?: SortOrder
    productTitle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type WidgetEnabledProductWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shop_productGid?: WidgetEnabledProductShopProductGidCompoundUniqueInput
    AND?: WidgetEnabledProductWhereInput | WidgetEnabledProductWhereInput[]
    OR?: WidgetEnabledProductWhereInput[]
    NOT?: WidgetEnabledProductWhereInput | WidgetEnabledProductWhereInput[]
    shop?: StringFilter<"WidgetEnabledProduct"> | string
    productGid?: StringFilter<"WidgetEnabledProduct"> | string
    productTitle?: StringNullableFilter<"WidgetEnabledProduct"> | string | null
    createdAt?: DateTimeFilter<"WidgetEnabledProduct"> | Date | string
  }, "id" | "shop_productGid">

  export type WidgetEnabledProductOrderByWithAggregationInput = {
    id?: SortOrder
    shop?: SortOrder
    productGid?: SortOrder
    productTitle?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WidgetEnabledProductCountOrderByAggregateInput
    _max?: WidgetEnabledProductMaxOrderByAggregateInput
    _min?: WidgetEnabledProductMinOrderByAggregateInput
  }

  export type WidgetEnabledProductScalarWhereWithAggregatesInput = {
    AND?: WidgetEnabledProductScalarWhereWithAggregatesInput | WidgetEnabledProductScalarWhereWithAggregatesInput[]
    OR?: WidgetEnabledProductScalarWhereWithAggregatesInput[]
    NOT?: WidgetEnabledProductScalarWhereWithAggregatesInput | WidgetEnabledProductScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WidgetEnabledProduct"> | string
    shop?: StringWithAggregatesFilter<"WidgetEnabledProduct"> | string
    productGid?: StringWithAggregatesFilter<"WidgetEnabledProduct"> | string
    productTitle?: StringNullableWithAggregatesFilter<"WidgetEnabledProduct"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WidgetEnabledProduct"> | Date | string
  }

  export type SessionCreateInput = {
    id: string
    shop: string
    state: string
    isOnline?: boolean
    scope?: string | null
    expires?: Date | string | null
    accessToken: string
    userId?: bigint | number | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    accountOwner?: boolean
    locale?: string | null
    collaborator?: boolean | null
    emailVerified?: boolean | null
    refreshToken?: string | null
    refreshTokenExpires?: Date | string | null
  }

  export type SessionUncheckedCreateInput = {
    id: string
    shop: string
    state: string
    isOnline?: boolean
    scope?: string | null
    expires?: Date | string | null
    accessToken: string
    userId?: bigint | number | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    accountOwner?: boolean
    locale?: string | null
    collaborator?: boolean | null
    emailVerified?: boolean | null
    refreshToken?: string | null
    refreshTokenExpires?: Date | string | null
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accountOwner?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    collaborator?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accountOwner?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    collaborator?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionCreateManyInput = {
    id: string
    shop: string
    state: string
    isOnline?: boolean
    scope?: string | null
    expires?: Date | string | null
    accessToken: string
    userId?: bigint | number | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    accountOwner?: boolean
    locale?: string | null
    collaborator?: boolean | null
    emailVerified?: boolean | null
    refreshToken?: string | null
    refreshTokenExpires?: Date | string | null
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accountOwner?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    collaborator?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    accessToken?: StringFieldUpdateOperationsInput | string
    userId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    accountOwner?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    collaborator?: NullableBoolFieldUpdateOperationsInput | boolean | null
    emailVerified?: NullableBoolFieldUpdateOperationsInput | boolean | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshTokenExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MerchantCreateInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanCreateNestedManyWithoutMerchantInput
    events?: MerchantEventCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestCreateNestedManyWithoutMerchantInput
  }

  export type MerchantUncheckedCreateInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanUncheckedCreateNestedManyWithoutMerchantInput
    events?: MerchantEventUncheckedCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type MerchantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUpdateManyWithoutMerchantNestedInput
    events?: MerchantEventUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUncheckedUpdateManyWithoutMerchantNestedInput
    events?: MerchantEventUncheckedUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantCreateManyInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantPlanCreateInput = {
    id?: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    merchant: MerchantCreateNestedOneWithoutPlansInput
  }

  export type MerchantPlanUncheckedCreateInput = {
    id?: string
    merchantId: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    merchant?: MerchantUpdateOneRequiredWithoutPlansNestedInput
  }

  export type MerchantPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantPlanCreateManyInput = {
    id?: string
    merchantId: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventCreateInput = {
    id?: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
    merchant: MerchantCreateNestedOneWithoutEventsInput
  }

  export type MerchantEventUncheckedCreateInput = {
    id?: string
    merchantId: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
  }

  export type MerchantEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    merchant?: MerchantUpdateOneRequiredWithoutEventsNestedInput
  }

  export type MerchantEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventCreateManyInput = {
    id?: string
    merchantId: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
  }

  export type MerchantEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestCreateInput = {
    id?: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    merchant: MerchantCreateNestedOneWithoutDeletionRequestsInput
  }

  export type MerchantDataDeletionRequestUncheckedCreateInput = {
    id?: string
    merchantId: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantDataDeletionRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    merchant?: MerchantUpdateOneRequiredWithoutDeletionRequestsNestedInput
  }

  export type MerchantDataDeletionRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestCreateManyInput = {
    id?: string
    merchantId: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantDataDeletionRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    merchantId?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminPlanDefinitionCreateInput = {
    id?: string
    planKey: string
    displayName: string
    monthlyPrice: string
    yearlyPrice: string
    tagline: string
    bestFor: string
    merchantFacingHighlightsJson?: string
    opsHighlightsJson?: string
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminPlanDefinitionUncheckedCreateInput = {
    id?: string
    planKey: string
    displayName: string
    monthlyPrice: string
    yearlyPrice: string
    tagline: string
    bestFor: string
    merchantFacingHighlightsJson?: string
    opsHighlightsJson?: string
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminPlanDefinitionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planKey?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: StringFieldUpdateOperationsInput | string
    yearlyPrice?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    bestFor?: StringFieldUpdateOperationsInput | string
    merchantFacingHighlightsJson?: StringFieldUpdateOperationsInput | string
    opsHighlightsJson?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminPlanDefinitionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    planKey?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: StringFieldUpdateOperationsInput | string
    yearlyPrice?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    bestFor?: StringFieldUpdateOperationsInput | string
    merchantFacingHighlightsJson?: StringFieldUpdateOperationsInput | string
    opsHighlightsJson?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminPlanDefinitionCreateManyInput = {
    id?: string
    planKey: string
    displayName: string
    monthlyPrice: string
    yearlyPrice: string
    tagline: string
    bestFor: string
    merchantFacingHighlightsJson?: string
    opsHighlightsJson?: string
    isActive?: boolean
    isPublic?: boolean
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminPlanDefinitionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    planKey?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: StringFieldUpdateOperationsInput | string
    yearlyPrice?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    bestFor?: StringFieldUpdateOperationsInput | string
    merchantFacingHighlightsJson?: StringFieldUpdateOperationsInput | string
    opsHighlightsJson?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminPlanDefinitionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    planKey?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    monthlyPrice?: StringFieldUpdateOperationsInput | string
    yearlyPrice?: StringFieldUpdateOperationsInput | string
    tagline?: StringFieldUpdateOperationsInput | string
    bestFor?: StringFieldUpdateOperationsInput | string
    merchantFacingHighlightsJson?: StringFieldUpdateOperationsInput | string
    opsHighlightsJson?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InternalAdminAccountCreateInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InternalAdminAccountUncheckedCreateInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InternalAdminAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InternalAdminAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InternalAdminAccountCreateManyInput = {
    id?: string
    email: string
    displayName: string
    passwordHash: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type InternalAdminAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InternalAdminAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionRuleCreateInput = {
    id?: string
    shop: string
    title?: string
    internalName?: string | null
    planSelectorLabel?: string
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    productScope?: string
    explicitProductGidsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionRuleUncheckedCreateInput = {
    id?: string
    shop: string
    title?: string
    internalName?: string | null
    planSelectorLabel?: string
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    productScope?: string
    explicitProductGidsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    internalName?: NullableStringFieldUpdateOperationsInput | string | null
    planSelectorLabel?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    productScope?: StringFieldUpdateOperationsInput | string
    explicitProductGidsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    internalName?: NullableStringFieldUpdateOperationsInput | string | null
    planSelectorLabel?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    productScope?: StringFieldUpdateOperationsInput | string
    explicitProductGidsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionRuleCreateManyInput = {
    id?: string
    shop: string
    title?: string
    internalName?: string | null
    planSelectorLabel?: string
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    productScope?: string
    explicitProductGidsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    internalName?: NullableStringFieldUpdateOperationsInput | string | null
    planSelectorLabel?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    productScope?: StringFieldUpdateOperationsInput | string
    explicitProductGidsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    internalName?: NullableStringFieldUpdateOperationsInput | string | null
    planSelectorLabel?: StringFieldUpdateOperationsInput | string
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    productScope?: StringFieldUpdateOperationsInput | string
    explicitProductGidsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionOfferCreateInput = {
    id?: string
    shop: string
    title: string
    productGid: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionOfferUncheckedCreateInput = {
    id?: string
    shop: string
    title: string
    productGid: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionOfferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionOfferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionOfferCreateManyInput = {
    id?: string
    shop: string
    title: string
    productGid: string
    sellingPlanGroupGid?: string | null
    defaultSellingPlanGid?: string | null
    discountType: string
    discountValue: string
    planIntervalsJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SubscriptionOfferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionOfferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    sellingPlanGroupGid?: NullableStringFieldUpdateOperationsInput | string | null
    defaultSellingPlanGid?: NullableStringFieldUpdateOperationsInput | string | null
    discountType?: StringFieldUpdateOperationsInput | string
    discountValue?: StringFieldUpdateOperationsInput | string
    planIntervalsJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetSettingsCreateInput = {
    id?: string
    shop: string
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: string
    purchaseOptionsLabel?: string
    primaryColorHex?: string
    accentGreenHex?: string
    fontFamily?: string
    borderRadiusPx?: number
    borderThicknessPx?: number
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: string
    subscriptionFooter?: string
    freeShippingNote?: string
    defaultSubscriptionDiscountType?: string
    defaultSubscriptionDiscountValue?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WidgetSettingsUncheckedCreateInput = {
    id?: string
    shop: string
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: string
    purchaseOptionsLabel?: string
    primaryColorHex?: string
    accentGreenHex?: string
    fontFamily?: string
    borderRadiusPx?: number
    borderThicknessPx?: number
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: string
    subscriptionFooter?: string
    freeShippingNote?: string
    defaultSubscriptionDiscountType?: string
    defaultSubscriptionDiscountValue?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WidgetSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    showWidgetOnProductPage?: BoolFieldUpdateOperationsInput | boolean
    buyMoreHeading?: StringFieldUpdateOperationsInput | string
    purchaseOptionsLabel?: StringFieldUpdateOperationsInput | string
    primaryColorHex?: StringFieldUpdateOperationsInput | string
    accentGreenHex?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    borderRadiusPx?: IntFieldUpdateOperationsInput | number
    borderThicknessPx?: IntFieldUpdateOperationsInput | number
    showSavingsBadge?: BoolFieldUpdateOperationsInput | boolean
    showCompareAtPrice?: BoolFieldUpdateOperationsInput | boolean
    showSubscriptionDetails?: BoolFieldUpdateOperationsInput | boolean
    customCssEnabled?: BoolFieldUpdateOperationsInput | boolean
    customCss?: StringFieldUpdateOperationsInput | string
    subscriptionFooter?: StringFieldUpdateOperationsInput | string
    freeShippingNote?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountType?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    showWidgetOnProductPage?: BoolFieldUpdateOperationsInput | boolean
    buyMoreHeading?: StringFieldUpdateOperationsInput | string
    purchaseOptionsLabel?: StringFieldUpdateOperationsInput | string
    primaryColorHex?: StringFieldUpdateOperationsInput | string
    accentGreenHex?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    borderRadiusPx?: IntFieldUpdateOperationsInput | number
    borderThicknessPx?: IntFieldUpdateOperationsInput | number
    showSavingsBadge?: BoolFieldUpdateOperationsInput | boolean
    showCompareAtPrice?: BoolFieldUpdateOperationsInput | boolean
    showSubscriptionDetails?: BoolFieldUpdateOperationsInput | boolean
    customCssEnabled?: BoolFieldUpdateOperationsInput | boolean
    customCss?: StringFieldUpdateOperationsInput | string
    subscriptionFooter?: StringFieldUpdateOperationsInput | string
    freeShippingNote?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountType?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetSettingsCreateManyInput = {
    id?: string
    shop: string
    showWidgetOnProductPage?: boolean
    buyMoreHeading?: string
    purchaseOptionsLabel?: string
    primaryColorHex?: string
    accentGreenHex?: string
    fontFamily?: string
    borderRadiusPx?: number
    borderThicknessPx?: number
    showSavingsBadge?: boolean
    showCompareAtPrice?: boolean
    showSubscriptionDetails?: boolean
    customCssEnabled?: boolean
    customCss?: string
    subscriptionFooter?: string
    freeShippingNote?: string
    defaultSubscriptionDiscountType?: string
    defaultSubscriptionDiscountValue?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WidgetSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    showWidgetOnProductPage?: BoolFieldUpdateOperationsInput | boolean
    buyMoreHeading?: StringFieldUpdateOperationsInput | string
    purchaseOptionsLabel?: StringFieldUpdateOperationsInput | string
    primaryColorHex?: StringFieldUpdateOperationsInput | string
    accentGreenHex?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    borderRadiusPx?: IntFieldUpdateOperationsInput | number
    borderThicknessPx?: IntFieldUpdateOperationsInput | number
    showSavingsBadge?: BoolFieldUpdateOperationsInput | boolean
    showCompareAtPrice?: BoolFieldUpdateOperationsInput | boolean
    showSubscriptionDetails?: BoolFieldUpdateOperationsInput | boolean
    customCssEnabled?: BoolFieldUpdateOperationsInput | boolean
    customCss?: StringFieldUpdateOperationsInput | string
    subscriptionFooter?: StringFieldUpdateOperationsInput | string
    freeShippingNote?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountType?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    showWidgetOnProductPage?: BoolFieldUpdateOperationsInput | boolean
    buyMoreHeading?: StringFieldUpdateOperationsInput | string
    purchaseOptionsLabel?: StringFieldUpdateOperationsInput | string
    primaryColorHex?: StringFieldUpdateOperationsInput | string
    accentGreenHex?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    borderRadiusPx?: IntFieldUpdateOperationsInput | number
    borderThicknessPx?: IntFieldUpdateOperationsInput | number
    showSavingsBadge?: BoolFieldUpdateOperationsInput | boolean
    showCompareAtPrice?: BoolFieldUpdateOperationsInput | boolean
    showSubscriptionDetails?: BoolFieldUpdateOperationsInput | boolean
    customCssEnabled?: BoolFieldUpdateOperationsInput | boolean
    customCss?: StringFieldUpdateOperationsInput | string
    subscriptionFooter?: StringFieldUpdateOperationsInput | string
    freeShippingNote?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountType?: StringFieldUpdateOperationsInput | string
    defaultSubscriptionDiscountValue?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetEnabledProductCreateInput = {
    id?: string
    shop: string
    productGid: string
    productTitle?: string | null
    createdAt?: Date | string
  }

  export type WidgetEnabledProductUncheckedCreateInput = {
    id?: string
    shop: string
    productGid: string
    productTitle?: string | null
    createdAt?: Date | string
  }

  export type WidgetEnabledProductUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetEnabledProductUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetEnabledProductCreateManyInput = {
    id?: string
    shop: string
    productGid: string
    productTitle?: string | null
    createdAt?: Date | string
  }

  export type WidgetEnabledProductUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WidgetEnabledProductUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shop?: StringFieldUpdateOperationsInput | string
    productGid?: StringFieldUpdateOperationsInput | string
    productTitle?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    state?: SortOrder
    isOnline?: SortOrder
    scope?: SortOrder
    expires?: SortOrder
    accessToken?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    accountOwner?: SortOrder
    locale?: SortOrder
    collaborator?: SortOrder
    emailVerified?: SortOrder
    refreshToken?: SortOrder
    refreshTokenExpires?: SortOrder
  }

  export type SessionAvgOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    state?: SortOrder
    isOnline?: SortOrder
    scope?: SortOrder
    expires?: SortOrder
    accessToken?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    accountOwner?: SortOrder
    locale?: SortOrder
    collaborator?: SortOrder
    emailVerified?: SortOrder
    refreshToken?: SortOrder
    refreshTokenExpires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    state?: SortOrder
    isOnline?: SortOrder
    scope?: SortOrder
    expires?: SortOrder
    accessToken?: SortOrder
    userId?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    email?: SortOrder
    accountOwner?: SortOrder
    locale?: SortOrder
    collaborator?: SortOrder
    emailVerified?: SortOrder
    refreshToken?: SortOrder
    refreshTokenExpires?: SortOrder
  }

  export type SessionSumOrderByAggregateInput = {
    userId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MerchantPlanListRelationFilter = {
    every?: MerchantPlanWhereInput
    some?: MerchantPlanWhereInput
    none?: MerchantPlanWhereInput
  }

  export type MerchantEventListRelationFilter = {
    every?: MerchantEventWhereInput
    some?: MerchantEventWhereInput
    none?: MerchantEventWhereInput
  }

  export type MerchantDataDeletionRequestListRelationFilter = {
    every?: MerchantDataDeletionRequestWhereInput
    some?: MerchantDataDeletionRequestWhereInput
    none?: MerchantDataDeletionRequestWhereInput
  }

  export type MerchantPlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MerchantEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MerchantDataDeletionRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MerchantCountOrderByAggregateInput = {
    id?: SortOrder
    shopDomain?: SortOrder
    shopGid?: SortOrder
    shopName?: SortOrder
    email?: SortOrder
    countryCode?: SortOrder
    currencyCode?: SortOrder
    timezone?: SortOrder
    status?: SortOrder
    installedAt?: SortOrder
    uninstalledAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantMaxOrderByAggregateInput = {
    id?: SortOrder
    shopDomain?: SortOrder
    shopGid?: SortOrder
    shopName?: SortOrder
    email?: SortOrder
    countryCode?: SortOrder
    currencyCode?: SortOrder
    timezone?: SortOrder
    status?: SortOrder
    installedAt?: SortOrder
    uninstalledAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantMinOrderByAggregateInput = {
    id?: SortOrder
    shopDomain?: SortOrder
    shopGid?: SortOrder
    shopName?: SortOrder
    email?: SortOrder
    countryCode?: SortOrder
    currencyCode?: SortOrder
    timezone?: SortOrder
    status?: SortOrder
    installedAt?: SortOrder
    uninstalledAt?: SortOrder
    lastSeenAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type MerchantScalarRelationFilter = {
    is?: MerchantWhereInput
    isNot?: MerchantWhereInput
  }

  export type MerchantPlanCountOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    shopifySubscriptionGid?: SortOrder
    planKey?: SortOrder
    planName?: SortOrder
    billingModel?: SortOrder
    billingInterval?: SortOrder
    status?: SortOrder
    isTest?: SortOrder
    activatedAt?: SortOrder
    currentPeriodEndAt?: SortOrder
    trialEndsAt?: SortOrder
    canceledAt?: SortOrder
    rawPayloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    shopifySubscriptionGid?: SortOrder
    planKey?: SortOrder
    planName?: SortOrder
    billingModel?: SortOrder
    billingInterval?: SortOrder
    status?: SortOrder
    isTest?: SortOrder
    activatedAt?: SortOrder
    currentPeriodEndAt?: SortOrder
    trialEndsAt?: SortOrder
    canceledAt?: SortOrder
    rawPayloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantPlanMinOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    shopifySubscriptionGid?: SortOrder
    planKey?: SortOrder
    planName?: SortOrder
    billingModel?: SortOrder
    billingInterval?: SortOrder
    status?: SortOrder
    isTest?: SortOrder
    activatedAt?: SortOrder
    currentPeriodEndAt?: SortOrder
    trialEndsAt?: SortOrder
    canceledAt?: SortOrder
    rawPayloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantEventCountOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
  }

  export type MerchantEventMaxOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
  }

  export type MerchantEventMinOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    type?: SortOrder
    severity?: SortOrder
    source?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
  }

  export type MerchantDataDeletionRequestCountOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scopeJson?: SortOrder
    completedAt?: SortOrder
    failureReason?: SortOrder
    auditNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantDataDeletionRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scopeJson?: SortOrder
    completedAt?: SortOrder
    failureReason?: SortOrder
    auditNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MerchantDataDeletionRequestMinOrderByAggregateInput = {
    id?: SortOrder
    merchantId?: SortOrder
    requestedBy?: SortOrder
    status?: SortOrder
    scopeJson?: SortOrder
    completedAt?: SortOrder
    failureReason?: SortOrder
    auditNotes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AdminPlanDefinitionCountOrderByAggregateInput = {
    id?: SortOrder
    planKey?: SortOrder
    displayName?: SortOrder
    monthlyPrice?: SortOrder
    yearlyPrice?: SortOrder
    tagline?: SortOrder
    bestFor?: SortOrder
    merchantFacingHighlightsJson?: SortOrder
    opsHighlightsJson?: SortOrder
    isActive?: SortOrder
    isPublic?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminPlanDefinitionAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type AdminPlanDefinitionMaxOrderByAggregateInput = {
    id?: SortOrder
    planKey?: SortOrder
    displayName?: SortOrder
    monthlyPrice?: SortOrder
    yearlyPrice?: SortOrder
    tagline?: SortOrder
    bestFor?: SortOrder
    merchantFacingHighlightsJson?: SortOrder
    opsHighlightsJson?: SortOrder
    isActive?: SortOrder
    isPublic?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminPlanDefinitionMinOrderByAggregateInput = {
    id?: SortOrder
    planKey?: SortOrder
    displayName?: SortOrder
    monthlyPrice?: SortOrder
    yearlyPrice?: SortOrder
    tagline?: SortOrder
    bestFor?: SortOrder
    merchantFacingHighlightsJson?: SortOrder
    opsHighlightsJson?: SortOrder
    isActive?: SortOrder
    isPublic?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminPlanDefinitionSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type InternalAdminAccountCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InternalAdminAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type InternalAdminAccountMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionRuleCountOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    internalName?: SortOrder
    planSelectorLabel?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    productScope?: SortOrder
    explicitProductGidsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    internalName?: SortOrder
    planSelectorLabel?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    productScope?: SortOrder
    explicitProductGidsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionRuleMinOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    internalName?: SortOrder
    planSelectorLabel?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    productScope?: SortOrder
    explicitProductGidsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionOfferCountOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    productGid?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionOfferMaxOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    productGid?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SubscriptionOfferMinOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    title?: SortOrder
    productGid?: SortOrder
    sellingPlanGroupGid?: SortOrder
    defaultSellingPlanGid?: SortOrder
    discountType?: SortOrder
    discountValue?: SortOrder
    planIntervalsJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WidgetSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    showWidgetOnProductPage?: SortOrder
    buyMoreHeading?: SortOrder
    purchaseOptionsLabel?: SortOrder
    primaryColorHex?: SortOrder
    accentGreenHex?: SortOrder
    fontFamily?: SortOrder
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
    showSavingsBadge?: SortOrder
    showCompareAtPrice?: SortOrder
    showSubscriptionDetails?: SortOrder
    customCssEnabled?: SortOrder
    customCss?: SortOrder
    subscriptionFooter?: SortOrder
    freeShippingNote?: SortOrder
    defaultSubscriptionDiscountType?: SortOrder
    defaultSubscriptionDiscountValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WidgetSettingsAvgOrderByAggregateInput = {
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
  }

  export type WidgetSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    showWidgetOnProductPage?: SortOrder
    buyMoreHeading?: SortOrder
    purchaseOptionsLabel?: SortOrder
    primaryColorHex?: SortOrder
    accentGreenHex?: SortOrder
    fontFamily?: SortOrder
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
    showSavingsBadge?: SortOrder
    showCompareAtPrice?: SortOrder
    showSubscriptionDetails?: SortOrder
    customCssEnabled?: SortOrder
    customCss?: SortOrder
    subscriptionFooter?: SortOrder
    freeShippingNote?: SortOrder
    defaultSubscriptionDiscountType?: SortOrder
    defaultSubscriptionDiscountValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WidgetSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    showWidgetOnProductPage?: SortOrder
    buyMoreHeading?: SortOrder
    purchaseOptionsLabel?: SortOrder
    primaryColorHex?: SortOrder
    accentGreenHex?: SortOrder
    fontFamily?: SortOrder
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
    showSavingsBadge?: SortOrder
    showCompareAtPrice?: SortOrder
    showSubscriptionDetails?: SortOrder
    customCssEnabled?: SortOrder
    customCss?: SortOrder
    subscriptionFooter?: SortOrder
    freeShippingNote?: SortOrder
    defaultSubscriptionDiscountType?: SortOrder
    defaultSubscriptionDiscountValue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WidgetSettingsSumOrderByAggregateInput = {
    borderRadiusPx?: SortOrder
    borderThicknessPx?: SortOrder
  }

  export type WidgetEnabledProductShopProductGidCompoundUniqueInput = {
    shop: string
    productGid: string
  }

  export type WidgetEnabledProductCountOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    productGid?: SortOrder
    productTitle?: SortOrder
    createdAt?: SortOrder
  }

  export type WidgetEnabledProductMaxOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    productGid?: SortOrder
    productTitle?: SortOrder
    createdAt?: SortOrder
  }

  export type WidgetEnabledProductMinOrderByAggregateInput = {
    id?: SortOrder
    shop?: SortOrder
    productGid?: SortOrder
    productTitle?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type MerchantPlanCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput> | MerchantPlanCreateWithoutMerchantInput[] | MerchantPlanUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantPlanCreateOrConnectWithoutMerchantInput | MerchantPlanCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantPlanCreateManyMerchantInputEnvelope
    connect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
  }

  export type MerchantEventCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput> | MerchantEventCreateWithoutMerchantInput[] | MerchantEventUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantEventCreateOrConnectWithoutMerchantInput | MerchantEventCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantEventCreateManyMerchantInputEnvelope
    connect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
  }

  export type MerchantDataDeletionRequestCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput> | MerchantDataDeletionRequestCreateWithoutMerchantInput[] | MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput | MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantDataDeletionRequestCreateManyMerchantInputEnvelope
    connect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
  }

  export type MerchantPlanUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput> | MerchantPlanCreateWithoutMerchantInput[] | MerchantPlanUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantPlanCreateOrConnectWithoutMerchantInput | MerchantPlanCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantPlanCreateManyMerchantInputEnvelope
    connect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
  }

  export type MerchantEventUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput> | MerchantEventCreateWithoutMerchantInput[] | MerchantEventUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantEventCreateOrConnectWithoutMerchantInput | MerchantEventCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantEventCreateManyMerchantInputEnvelope
    connect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
  }

  export type MerchantDataDeletionRequestUncheckedCreateNestedManyWithoutMerchantInput = {
    create?: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput> | MerchantDataDeletionRequestCreateWithoutMerchantInput[] | MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput | MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput[]
    createMany?: MerchantDataDeletionRequestCreateManyMerchantInputEnvelope
    connect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MerchantPlanUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput> | MerchantPlanCreateWithoutMerchantInput[] | MerchantPlanUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantPlanCreateOrConnectWithoutMerchantInput | MerchantPlanCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantPlanUpsertWithWhereUniqueWithoutMerchantInput | MerchantPlanUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantPlanCreateManyMerchantInputEnvelope
    set?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    disconnect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    delete?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    connect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    update?: MerchantPlanUpdateWithWhereUniqueWithoutMerchantInput | MerchantPlanUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantPlanUpdateManyWithWhereWithoutMerchantInput | MerchantPlanUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantPlanScalarWhereInput | MerchantPlanScalarWhereInput[]
  }

  export type MerchantEventUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput> | MerchantEventCreateWithoutMerchantInput[] | MerchantEventUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantEventCreateOrConnectWithoutMerchantInput | MerchantEventCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantEventUpsertWithWhereUniqueWithoutMerchantInput | MerchantEventUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantEventCreateManyMerchantInputEnvelope
    set?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    disconnect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    delete?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    connect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    update?: MerchantEventUpdateWithWhereUniqueWithoutMerchantInput | MerchantEventUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantEventUpdateManyWithWhereWithoutMerchantInput | MerchantEventUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantEventScalarWhereInput | MerchantEventScalarWhereInput[]
  }

  export type MerchantDataDeletionRequestUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput> | MerchantDataDeletionRequestCreateWithoutMerchantInput[] | MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput | MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantDataDeletionRequestUpsertWithWhereUniqueWithoutMerchantInput | MerchantDataDeletionRequestUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantDataDeletionRequestCreateManyMerchantInputEnvelope
    set?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    disconnect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    delete?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    connect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    update?: MerchantDataDeletionRequestUpdateWithWhereUniqueWithoutMerchantInput | MerchantDataDeletionRequestUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantDataDeletionRequestUpdateManyWithWhereWithoutMerchantInput | MerchantDataDeletionRequestUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantDataDeletionRequestScalarWhereInput | MerchantDataDeletionRequestScalarWhereInput[]
  }

  export type MerchantPlanUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput> | MerchantPlanCreateWithoutMerchantInput[] | MerchantPlanUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantPlanCreateOrConnectWithoutMerchantInput | MerchantPlanCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantPlanUpsertWithWhereUniqueWithoutMerchantInput | MerchantPlanUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantPlanCreateManyMerchantInputEnvelope
    set?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    disconnect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    delete?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    connect?: MerchantPlanWhereUniqueInput | MerchantPlanWhereUniqueInput[]
    update?: MerchantPlanUpdateWithWhereUniqueWithoutMerchantInput | MerchantPlanUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantPlanUpdateManyWithWhereWithoutMerchantInput | MerchantPlanUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantPlanScalarWhereInput | MerchantPlanScalarWhereInput[]
  }

  export type MerchantEventUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput> | MerchantEventCreateWithoutMerchantInput[] | MerchantEventUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantEventCreateOrConnectWithoutMerchantInput | MerchantEventCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantEventUpsertWithWhereUniqueWithoutMerchantInput | MerchantEventUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantEventCreateManyMerchantInputEnvelope
    set?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    disconnect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    delete?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    connect?: MerchantEventWhereUniqueInput | MerchantEventWhereUniqueInput[]
    update?: MerchantEventUpdateWithWhereUniqueWithoutMerchantInput | MerchantEventUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantEventUpdateManyWithWhereWithoutMerchantInput | MerchantEventUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantEventScalarWhereInput | MerchantEventScalarWhereInput[]
  }

  export type MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantNestedInput = {
    create?: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput> | MerchantDataDeletionRequestCreateWithoutMerchantInput[] | MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput[]
    connectOrCreate?: MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput | MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput[]
    upsert?: MerchantDataDeletionRequestUpsertWithWhereUniqueWithoutMerchantInput | MerchantDataDeletionRequestUpsertWithWhereUniqueWithoutMerchantInput[]
    createMany?: MerchantDataDeletionRequestCreateManyMerchantInputEnvelope
    set?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    disconnect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    delete?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    connect?: MerchantDataDeletionRequestWhereUniqueInput | MerchantDataDeletionRequestWhereUniqueInput[]
    update?: MerchantDataDeletionRequestUpdateWithWhereUniqueWithoutMerchantInput | MerchantDataDeletionRequestUpdateWithWhereUniqueWithoutMerchantInput[]
    updateMany?: MerchantDataDeletionRequestUpdateManyWithWhereWithoutMerchantInput | MerchantDataDeletionRequestUpdateManyWithWhereWithoutMerchantInput[]
    deleteMany?: MerchantDataDeletionRequestScalarWhereInput | MerchantDataDeletionRequestScalarWhereInput[]
  }

  export type MerchantCreateNestedOneWithoutPlansInput = {
    create?: XOR<MerchantCreateWithoutPlansInput, MerchantUncheckedCreateWithoutPlansInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutPlansInput
    connect?: MerchantWhereUniqueInput
  }

  export type MerchantUpdateOneRequiredWithoutPlansNestedInput = {
    create?: XOR<MerchantCreateWithoutPlansInput, MerchantUncheckedCreateWithoutPlansInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutPlansInput
    upsert?: MerchantUpsertWithoutPlansInput
    connect?: MerchantWhereUniqueInput
    update?: XOR<XOR<MerchantUpdateToOneWithWhereWithoutPlansInput, MerchantUpdateWithoutPlansInput>, MerchantUncheckedUpdateWithoutPlansInput>
  }

  export type MerchantCreateNestedOneWithoutEventsInput = {
    create?: XOR<MerchantCreateWithoutEventsInput, MerchantUncheckedCreateWithoutEventsInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutEventsInput
    connect?: MerchantWhereUniqueInput
  }

  export type MerchantUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<MerchantCreateWithoutEventsInput, MerchantUncheckedCreateWithoutEventsInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutEventsInput
    upsert?: MerchantUpsertWithoutEventsInput
    connect?: MerchantWhereUniqueInput
    update?: XOR<XOR<MerchantUpdateToOneWithWhereWithoutEventsInput, MerchantUpdateWithoutEventsInput>, MerchantUncheckedUpdateWithoutEventsInput>
  }

  export type MerchantCreateNestedOneWithoutDeletionRequestsInput = {
    create?: XOR<MerchantCreateWithoutDeletionRequestsInput, MerchantUncheckedCreateWithoutDeletionRequestsInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutDeletionRequestsInput
    connect?: MerchantWhereUniqueInput
  }

  export type MerchantUpdateOneRequiredWithoutDeletionRequestsNestedInput = {
    create?: XOR<MerchantCreateWithoutDeletionRequestsInput, MerchantUncheckedCreateWithoutDeletionRequestsInput>
    connectOrCreate?: MerchantCreateOrConnectWithoutDeletionRequestsInput
    upsert?: MerchantUpsertWithoutDeletionRequestsInput
    connect?: MerchantWhereUniqueInput
    update?: XOR<XOR<MerchantUpdateToOneWithWhereWithoutDeletionRequestsInput, MerchantUpdateWithoutDeletionRequestsInput>, MerchantUncheckedUpdateWithoutDeletionRequestsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MerchantPlanCreateWithoutMerchantInput = {
    id?: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantPlanUncheckedCreateWithoutMerchantInput = {
    id?: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantPlanCreateOrConnectWithoutMerchantInput = {
    where: MerchantPlanWhereUniqueInput
    create: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantPlanCreateManyMerchantInputEnvelope = {
    data: MerchantPlanCreateManyMerchantInput | MerchantPlanCreateManyMerchantInput[]
    skipDuplicates?: boolean
  }

  export type MerchantEventCreateWithoutMerchantInput = {
    id?: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
  }

  export type MerchantEventUncheckedCreateWithoutMerchantInput = {
    id?: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
  }

  export type MerchantEventCreateOrConnectWithoutMerchantInput = {
    where: MerchantEventWhereUniqueInput
    create: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantEventCreateManyMerchantInputEnvelope = {
    data: MerchantEventCreateManyMerchantInput | MerchantEventCreateManyMerchantInput[]
    skipDuplicates?: boolean
  }

  export type MerchantDataDeletionRequestCreateWithoutMerchantInput = {
    id?: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput = {
    id?: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantDataDeletionRequestCreateOrConnectWithoutMerchantInput = {
    where: MerchantDataDeletionRequestWhereUniqueInput
    create: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantDataDeletionRequestCreateManyMerchantInputEnvelope = {
    data: MerchantDataDeletionRequestCreateManyMerchantInput | MerchantDataDeletionRequestCreateManyMerchantInput[]
    skipDuplicates?: boolean
  }

  export type MerchantPlanUpsertWithWhereUniqueWithoutMerchantInput = {
    where: MerchantPlanWhereUniqueInput
    update: XOR<MerchantPlanUpdateWithoutMerchantInput, MerchantPlanUncheckedUpdateWithoutMerchantInput>
    create: XOR<MerchantPlanCreateWithoutMerchantInput, MerchantPlanUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantPlanUpdateWithWhereUniqueWithoutMerchantInput = {
    where: MerchantPlanWhereUniqueInput
    data: XOR<MerchantPlanUpdateWithoutMerchantInput, MerchantPlanUncheckedUpdateWithoutMerchantInput>
  }

  export type MerchantPlanUpdateManyWithWhereWithoutMerchantInput = {
    where: MerchantPlanScalarWhereInput
    data: XOR<MerchantPlanUpdateManyMutationInput, MerchantPlanUncheckedUpdateManyWithoutMerchantInput>
  }

  export type MerchantPlanScalarWhereInput = {
    AND?: MerchantPlanScalarWhereInput | MerchantPlanScalarWhereInput[]
    OR?: MerchantPlanScalarWhereInput[]
    NOT?: MerchantPlanScalarWhereInput | MerchantPlanScalarWhereInput[]
    id?: StringFilter<"MerchantPlan"> | string
    merchantId?: StringFilter<"MerchantPlan"> | string
    shopifySubscriptionGid?: StringNullableFilter<"MerchantPlan"> | string | null
    planKey?: StringFilter<"MerchantPlan"> | string
    planName?: StringFilter<"MerchantPlan"> | string
    billingModel?: StringFilter<"MerchantPlan"> | string
    billingInterval?: StringNullableFilter<"MerchantPlan"> | string | null
    status?: StringFilter<"MerchantPlan"> | string
    isTest?: BoolFilter<"MerchantPlan"> | boolean
    activatedAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    currentPeriodEndAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    trialEndsAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    canceledAt?: DateTimeNullableFilter<"MerchantPlan"> | Date | string | null
    rawPayloadJson?: StringFilter<"MerchantPlan"> | string
    createdAt?: DateTimeFilter<"MerchantPlan"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantPlan"> | Date | string
  }

  export type MerchantEventUpsertWithWhereUniqueWithoutMerchantInput = {
    where: MerchantEventWhereUniqueInput
    update: XOR<MerchantEventUpdateWithoutMerchantInput, MerchantEventUncheckedUpdateWithoutMerchantInput>
    create: XOR<MerchantEventCreateWithoutMerchantInput, MerchantEventUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantEventUpdateWithWhereUniqueWithoutMerchantInput = {
    where: MerchantEventWhereUniqueInput
    data: XOR<MerchantEventUpdateWithoutMerchantInput, MerchantEventUncheckedUpdateWithoutMerchantInput>
  }

  export type MerchantEventUpdateManyWithWhereWithoutMerchantInput = {
    where: MerchantEventScalarWhereInput
    data: XOR<MerchantEventUpdateManyMutationInput, MerchantEventUncheckedUpdateManyWithoutMerchantInput>
  }

  export type MerchantEventScalarWhereInput = {
    AND?: MerchantEventScalarWhereInput | MerchantEventScalarWhereInput[]
    OR?: MerchantEventScalarWhereInput[]
    NOT?: MerchantEventScalarWhereInput | MerchantEventScalarWhereInput[]
    id?: StringFilter<"MerchantEvent"> | string
    merchantId?: StringFilter<"MerchantEvent"> | string
    type?: StringFilter<"MerchantEvent"> | string
    severity?: StringFilter<"MerchantEvent"> | string
    source?: StringFilter<"MerchantEvent"> | string
    payloadJson?: StringFilter<"MerchantEvent"> | string
    createdAt?: DateTimeFilter<"MerchantEvent"> | Date | string
  }

  export type MerchantDataDeletionRequestUpsertWithWhereUniqueWithoutMerchantInput = {
    where: MerchantDataDeletionRequestWhereUniqueInput
    update: XOR<MerchantDataDeletionRequestUpdateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedUpdateWithoutMerchantInput>
    create: XOR<MerchantDataDeletionRequestCreateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedCreateWithoutMerchantInput>
  }

  export type MerchantDataDeletionRequestUpdateWithWhereUniqueWithoutMerchantInput = {
    where: MerchantDataDeletionRequestWhereUniqueInput
    data: XOR<MerchantDataDeletionRequestUpdateWithoutMerchantInput, MerchantDataDeletionRequestUncheckedUpdateWithoutMerchantInput>
  }

  export type MerchantDataDeletionRequestUpdateManyWithWhereWithoutMerchantInput = {
    where: MerchantDataDeletionRequestScalarWhereInput
    data: XOR<MerchantDataDeletionRequestUpdateManyMutationInput, MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantInput>
  }

  export type MerchantDataDeletionRequestScalarWhereInput = {
    AND?: MerchantDataDeletionRequestScalarWhereInput | MerchantDataDeletionRequestScalarWhereInput[]
    OR?: MerchantDataDeletionRequestScalarWhereInput[]
    NOT?: MerchantDataDeletionRequestScalarWhereInput | MerchantDataDeletionRequestScalarWhereInput[]
    id?: StringFilter<"MerchantDataDeletionRequest"> | string
    merchantId?: StringFilter<"MerchantDataDeletionRequest"> | string
    requestedBy?: StringFilter<"MerchantDataDeletionRequest"> | string
    status?: StringFilter<"MerchantDataDeletionRequest"> | string
    scopeJson?: StringFilter<"MerchantDataDeletionRequest"> | string
    completedAt?: DateTimeNullableFilter<"MerchantDataDeletionRequest"> | Date | string | null
    failureReason?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    auditNotes?: StringNullableFilter<"MerchantDataDeletionRequest"> | string | null
    createdAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
    updatedAt?: DateTimeFilter<"MerchantDataDeletionRequest"> | Date | string
  }

  export type MerchantCreateWithoutPlansInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: MerchantEventCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestCreateNestedManyWithoutMerchantInput
  }

  export type MerchantUncheckedCreateWithoutPlansInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: MerchantEventUncheckedCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type MerchantCreateOrConnectWithoutPlansInput = {
    where: MerchantWhereUniqueInput
    create: XOR<MerchantCreateWithoutPlansInput, MerchantUncheckedCreateWithoutPlansInput>
  }

  export type MerchantUpsertWithoutPlansInput = {
    update: XOR<MerchantUpdateWithoutPlansInput, MerchantUncheckedUpdateWithoutPlansInput>
    create: XOR<MerchantCreateWithoutPlansInput, MerchantUncheckedCreateWithoutPlansInput>
    where?: MerchantWhereInput
  }

  export type MerchantUpdateToOneWithWhereWithoutPlansInput = {
    where?: MerchantWhereInput
    data: XOR<MerchantUpdateWithoutPlansInput, MerchantUncheckedUpdateWithoutPlansInput>
  }

  export type MerchantUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: MerchantEventUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantUncheckedUpdateWithoutPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: MerchantEventUncheckedUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantCreateWithoutEventsInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestCreateNestedManyWithoutMerchantInput
  }

  export type MerchantUncheckedCreateWithoutEventsInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanUncheckedCreateNestedManyWithoutMerchantInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type MerchantCreateOrConnectWithoutEventsInput = {
    where: MerchantWhereUniqueInput
    create: XOR<MerchantCreateWithoutEventsInput, MerchantUncheckedCreateWithoutEventsInput>
  }

  export type MerchantUpsertWithoutEventsInput = {
    update: XOR<MerchantUpdateWithoutEventsInput, MerchantUncheckedUpdateWithoutEventsInput>
    create: XOR<MerchantCreateWithoutEventsInput, MerchantUncheckedCreateWithoutEventsInput>
    where?: MerchantWhereInput
  }

  export type MerchantUpdateToOneWithWhereWithoutEventsInput = {
    where?: MerchantWhereInput
    data: XOR<MerchantUpdateWithoutEventsInput, MerchantUncheckedUpdateWithoutEventsInput>
  }

  export type MerchantUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUncheckedUpdateManyWithoutMerchantNestedInput
    deletionRequests?: MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantCreateWithoutDeletionRequestsInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanCreateNestedManyWithoutMerchantInput
    events?: MerchantEventCreateNestedManyWithoutMerchantInput
  }

  export type MerchantUncheckedCreateWithoutDeletionRequestsInput = {
    id?: string
    shopDomain: string
    shopGid?: string | null
    shopName?: string | null
    email?: string | null
    countryCode?: string | null
    currencyCode?: string | null
    timezone?: string | null
    status?: string
    installedAt?: Date | string
    uninstalledAt?: Date | string | null
    lastSeenAt?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    plans?: MerchantPlanUncheckedCreateNestedManyWithoutMerchantInput
    events?: MerchantEventUncheckedCreateNestedManyWithoutMerchantInput
  }

  export type MerchantCreateOrConnectWithoutDeletionRequestsInput = {
    where: MerchantWhereUniqueInput
    create: XOR<MerchantCreateWithoutDeletionRequestsInput, MerchantUncheckedCreateWithoutDeletionRequestsInput>
  }

  export type MerchantUpsertWithoutDeletionRequestsInput = {
    update: XOR<MerchantUpdateWithoutDeletionRequestsInput, MerchantUncheckedUpdateWithoutDeletionRequestsInput>
    create: XOR<MerchantCreateWithoutDeletionRequestsInput, MerchantUncheckedCreateWithoutDeletionRequestsInput>
    where?: MerchantWhereInput
  }

  export type MerchantUpdateToOneWithWhereWithoutDeletionRequestsInput = {
    where?: MerchantWhereInput
    data: XOR<MerchantUpdateWithoutDeletionRequestsInput, MerchantUncheckedUpdateWithoutDeletionRequestsInput>
  }

  export type MerchantUpdateWithoutDeletionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUpdateManyWithoutMerchantNestedInput
    events?: MerchantEventUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantUncheckedUpdateWithoutDeletionRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopDomain?: StringFieldUpdateOperationsInput | string
    shopGid?: NullableStringFieldUpdateOperationsInput | string | null
    shopName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    currencyCode?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    installedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    uninstalledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plans?: MerchantPlanUncheckedUpdateManyWithoutMerchantNestedInput
    events?: MerchantEventUncheckedUpdateManyWithoutMerchantNestedInput
  }

  export type MerchantPlanCreateManyMerchantInput = {
    id?: string
    shopifySubscriptionGid?: string | null
    planKey: string
    planName: string
    billingModel?: string
    billingInterval?: string | null
    status?: string
    isTest?: boolean
    activatedAt?: Date | string | null
    currentPeriodEndAt?: Date | string | null
    trialEndsAt?: Date | string | null
    canceledAt?: Date | string | null
    rawPayloadJson?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantEventCreateManyMerchantInput = {
    id?: string
    type: string
    severity?: string
    source: string
    payloadJson?: string
    createdAt?: Date | string
  }

  export type MerchantDataDeletionRequestCreateManyMerchantInput = {
    id?: string
    requestedBy: string
    status?: string
    scopeJson?: string
    completedAt?: Date | string | null
    failureReason?: string | null
    auditNotes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MerchantPlanUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantPlanUncheckedUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantPlanUncheckedUpdateManyWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    shopifySubscriptionGid?: NullableStringFieldUpdateOperationsInput | string | null
    planKey?: StringFieldUpdateOperationsInput | string
    planName?: StringFieldUpdateOperationsInput | string
    billingModel?: StringFieldUpdateOperationsInput | string
    billingInterval?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    isTest?: BoolFieldUpdateOperationsInput | boolean
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEndAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    canceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawPayloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventUncheckedUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantEventUncheckedUpdateManyWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    severity?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestUncheckedUpdateWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MerchantDataDeletionRequestUncheckedUpdateManyWithoutMerchantInput = {
    id?: StringFieldUpdateOperationsInput | string
    requestedBy?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scopeJson?: StringFieldUpdateOperationsInput | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    auditNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}