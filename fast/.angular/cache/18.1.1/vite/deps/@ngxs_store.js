import {
  isPlatformServer
} from "./chunk-JC2A4MAF.js";
import {
  APP_BOOTSTRAP_LISTENER,
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  ErrorHandler,
  INJECTOR$1,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  PLATFORM_ID,
  RuntimeError,
  SkipSelf,
  assertInInjectionContext,
  assertNotInReactiveContext,
  computed,
  inject,
  isPromise,
  makeEnvironmentProviders,
  setClassMetadata,
  signal,
  untracked,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory,
  ɵɵinject
} from "./chunk-FJVECKZB.js";
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  ReplaySubject,
  Subject,
  catchError,
  config,
  defaultIfEmpty,
  distinctUntilChanged,
  exhaustMap,
  filter,
  forkJoin,
  from,
  isObservable,
  map,
  mergeMap,
  of,
  pairwise,
  share,
  shareReplay,
  startWith,
  take,
  takeUntil,
  tap,
  throwError
} from "./chunk-RNHFPYJY.js";
import "./chunk-YTN62GH5.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-3OV72XIM.js";

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function toSignal(source, options) {
  ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  requiresCleanup && !options?.injector && assertInInjectionContext(toSignal);
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state;
  if (options?.requireSync) {
    state = signal({
      kind: 0
      /* StateKind.NoValue */
    }, {
      equal
    });
  } else {
    state = signal({
      kind: 1,
      value: options?.initialValue
    }, {
      equal
    });
  }
  const sub = source.subscribe({
    next: (value) => state.set({
      kind: 1,
      value
    }),
    error: (error) => {
      if (options?.rejectErrors) {
        throw error;
      }
      state.set({
        kind: 2,
        error
      });
    }
    // Completion of the Observable is meaningless to the signal. Signals don't have a concept of
    // "complete".
  });
  if (ngDevMode && options?.requireSync && state().kind === 0) {
    throw new RuntimeError(601, "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, {
    equal: options?.equal
  });
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}

// node_modules/@ngxs/store/fesm2022/ngxs-store-internals.mjs
var ɵMETA_KEY = "NGXS_META";
var ɵMETA_OPTIONS_KEY = "NGXS_OPTIONS_META";
var ɵSELECTOR_META_KEY = "NGXS_SELECTOR_META";
function ɵensureStoreMetadata(target) {
  if (!target.hasOwnProperty(ɵMETA_KEY)) {
    const defaultMetadata = {
      name: null,
      actions: {},
      defaults: {},
      path: null,
      makeRootSelector(context) {
        return context.getStateGetter(defaultMetadata.name);
      },
      children: []
    };
    Object.defineProperty(target, ɵMETA_KEY, {
      value: defaultMetadata
    });
  }
  return ɵgetStoreMetadata(target);
}
function ɵgetStoreMetadata(target) {
  return target[ɵMETA_KEY];
}
function ɵensureSelectorMetadata(target) {
  if (!target.hasOwnProperty(ɵSELECTOR_META_KEY)) {
    const defaultMetadata = {
      makeRootSelector: null,
      originalFn: null,
      containerClass: null,
      selectorName: null,
      getSelectorOptions: () => ({})
    };
    Object.defineProperty(target, ɵSELECTOR_META_KEY, {
      value: defaultMetadata
    });
  }
  return ɵgetSelectorMetadata(target);
}
function ɵgetSelectorMetadata(target) {
  return target[ɵSELECTOR_META_KEY];
}
function defaultEqualityCheck(a, b) {
  return a === b;
}
function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }
  const length = prev.length;
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }
  return true;
}
function ɵmemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs = null;
  let lastResult = null;
  function memoized() {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      lastResult = func.apply(null, arguments);
    }
    lastArgs = arguments;
    return lastResult;
  }
  memoized.reset = function() {
    lastArgs = null;
    lastResult = null;
  };
  return memoized;
}
var StateToken = class {
  constructor(_name) {
    this._name = _name;
    const selectorMetadata = ɵensureSelectorMetadata(this);
    selectorMetadata.makeRootSelector = (runtimeContext) => {
      return runtimeContext.getStateGetter(this._name);
    };
  }
  getName() {
    return this._name;
  }
  toString() {
    return `StateToken[${this._name}]`;
  }
};
var NG_DEV_MODE$1 = typeof ngDevMode !== "undefined" && ngDevMode;
var _ɵInitialState = class _ɵInitialState {
  static set(state) {
    this._value = state;
  }
  static pop() {
    const state = this._value;
    this._value = {};
    return state;
  }
};
_ɵInitialState._value = {};
var ɵInitialState = _ɵInitialState;
var ɵINITIAL_STATE_TOKEN = new InjectionToken(NG_DEV_MODE$1 ? "INITIAL_STATE_TOKEN" : "", {
  providedIn: "root",
  factory: () => ɵInitialState.pop()
});
var _ɵNgxsAppBootstrappedState = class _ɵNgxsAppBootstrappedState extends ReplaySubject {
  constructor() {
    super(1);
  }
  bootstrap() {
    this.next(true);
    this.complete();
  }
};
_ɵNgxsAppBootstrappedState.ɵfac = function ɵNgxsAppBootstrappedState_Factory(t) {
  return new (t || _ɵNgxsAppBootstrappedState)();
};
_ɵNgxsAppBootstrappedState.ɵprov = ɵɵdefineInjectable({
  token: _ɵNgxsAppBootstrappedState,
  factory: _ɵNgxsAppBootstrappedState.ɵfac,
  providedIn: "root"
});
var ɵNgxsAppBootstrappedState = _ɵNgxsAppBootstrappedState;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵNgxsAppBootstrappedState, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var NG_DEV_MODE = typeof ngDevMode !== "undefined" && ngDevMode;
var ɵNGXS_STATE_FACTORY = new InjectionToken(NG_DEV_MODE ? "ɵNGXS_STATE_FACTORY" : "");
var ɵNGXS_STATE_CONTEXT_FACTORY = new InjectionToken(NG_DEV_MODE ? "ɵNGXS_STATE_CONTEXT_FACTORY" : "");
function orderedQueueOperation(operation) {
  const callsQueue = [];
  let busyPushingNext = false;
  return function callOperation(...args) {
    if (busyPushingNext) {
      callsQueue.unshift(args);
      return;
    }
    busyPushingNext = true;
    operation(...args);
    while (callsQueue.length > 0) {
      const nextCallArgs = callsQueue.pop();
      nextCallArgs && operation(...nextCallArgs);
    }
    busyPushingNext = false;
  };
}
var ɵOrderedSubject = class extends Subject {
  constructor() {
    super(...arguments);
    this._orderedNext = orderedQueueOperation((value) => super.next(value));
  }
  next(value) {
    this._orderedNext(value);
  }
};
var ɵOrderedBehaviorSubject = class extends BehaviorSubject {
  constructor(value) {
    super(value);
    this._orderedNext = orderedQueueOperation((value2) => super.next(value2));
    this._currentValue = value;
  }
  getValue() {
    return this._currentValue;
  }
  next(value) {
    this._currentValue = value;
    this._orderedNext(value);
  }
};
function ɵwrapObserverCalls(invokeFn) {
  return (source) => {
    return new Observable((subscriber) => {
      return source.subscribe({
        next(value) {
          invokeFn(() => subscriber.next(value));
        },
        error(error) {
          invokeFn(() => subscriber.error(error));
        },
        complete() {
          invokeFn(() => subscriber.complete());
        }
      });
    });
  };
}
var _ɵStateStream = class _ɵStateStream extends ɵOrderedBehaviorSubject {
  constructor() {
    super({});
    this.state = toSignal(this.pipe(ɵwrapObserverCalls(untracked)), {
      manualCleanup: true,
      requireSync: true
    });
  }
  ngOnDestroy() {
    this.complete();
  }
};
_ɵStateStream.ɵfac = function ɵStateStream_Factory(t) {
  return new (t || _ɵStateStream)();
};
_ɵStateStream.ɵprov = ɵɵdefineInjectable({
  token: _ɵStateStream,
  factory: _ɵStateStream.ɵfac,
  providedIn: "root"
});
var ɵStateStream = _ɵStateStream;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵStateStream, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/@ngxs/store/fesm2022/ngxs-store-plugins.mjs
var _InitState = class _InitState {
};
_InitState.type = "@@INIT";
var InitState = _InitState;
var _UpdateState = class _UpdateState {
  constructor(addedStates) {
    this.addedStates = addedStates;
  }
};
_UpdateState.type = "@@UPDATE_STATE";
var UpdateState = _UpdateState;
var NG_DEV_MODE2 = typeof ngDevMode !== "undefined" && ngDevMode;
var NGXS_PLUGINS = new InjectionToken(NG_DEV_MODE2 ? "NGXS_PLUGINS" : "");
function getActionTypeFromInstance(action) {
  return action.constructor?.type || action.type;
}
function actionMatcher(action1) {
  const type1 = getActionTypeFromInstance(action1);
  return function(action2) {
    return type1 === getActionTypeFromInstance(action2);
  };
}
var setValue = (obj, prop, val) => {
  obj = __spreadValues({}, obj);
  const split = prop.split(".");
  const lastIndex = split.length - 1;
  split.reduce((acc, part, index) => {
    if (index === lastIndex) {
      acc[part] = val;
    } else {
      acc[part] = Array.isArray(acc[part]) ? acc[part].slice() : __spreadValues({}, acc[part]);
    }
    return acc && acc[part];
  }, obj);
  return obj;
};
var getValue = (obj, prop) => prop.split(".").reduce((acc, part) => acc && acc[part], obj);

// node_modules/@ngxs/store/fesm2022/ngxs-store-operators.mjs
function isStateOperator(value) {
  return typeof value === "function";
}

// node_modules/@ngxs/store/fesm2022/ngxs-store.mjs
var _NoopNgxsExecutionStrategy = class _NoopNgxsExecutionStrategy {
  enter(func) {
    return func();
  }
  leave(func) {
    return func();
  }
};
_NoopNgxsExecutionStrategy.ɵfac = function NoopNgxsExecutionStrategy_Factory(t) {
  return new (t || _NoopNgxsExecutionStrategy)();
};
_NoopNgxsExecutionStrategy.ɵprov = ɵɵdefineInjectable({
  token: _NoopNgxsExecutionStrategy,
  factory: _NoopNgxsExecutionStrategy.ɵfac,
  providedIn: "root"
});
var NoopNgxsExecutionStrategy = _NoopNgxsExecutionStrategy;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopNgxsExecutionStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function throwStateNameError(name) {
  throw new Error(`${name} is not a valid state name. It needs to be a valid object property name.`);
}
function throwStateNamePropertyError() {
  throw new Error(`States must register a 'name' property.`);
}
function throwStateUniqueError(current, newName, oldName) {
  throw new Error(`State name '${current}' from ${newName} already exists in ${oldName}.`);
}
function throwStateDecoratorError(name) {
  throw new Error(`States must be decorated with @State() decorator, but "${name}" isn't.`);
}
function throwActionDecoratorError() {
  throw new Error("@Action() decorator cannot be used with static methods.");
}
function throwSelectorDecoratorError() {
  throw new Error("Selectors only work on methods.");
}
function getZoneWarningMessage() {
  return "Your application was bootstrapped with nooped zone and your execution strategy requires an actual NgZone!\nPlease set the value of the executionStrategy property to NoopNgxsExecutionStrategy.\nNgxsModule.forRoot(states, { executionStrategy: NoopNgxsExecutionStrategy })";
}
function getUndecoratedStateWithInjectableWarningMessage(name) {
  return `'${name}' class should be decorated with @Injectable() right after the @State() decorator`;
}
function getInvalidInitializationOrderMessage(addedStates) {
  let message = "You have an invalid state initialization order. This typically occurs when `NgxsModule.forFeature`\nor `provideStates` is called before `NgxsModule.forRoot` or `provideStore`.\nOne example is when `NgxsRouterPluginModule.forRoot` is called before `NgxsModule.forRoot`.";
  if (addedStates) {
    const stateNames = Object.keys(addedStates).map((stateName) => `"${stateName}"`);
    message += `
Feature states added before the store initialization is complete: ${stateNames.join(", ")}.`;
  }
  return message;
}
function throwSelectFactoryNotConnectedError() {
  throw new Error("You have forgotten to import the NGXS module!");
}
function throwPatchingArrayError() {
  throw new Error("Patching arrays is not supported.");
}
function throwPatchingPrimitiveError() {
  throw new Error("Patching primitives is not supported.");
}
var _DispatchOutsideZoneNgxsExecutionStrategy = class _DispatchOutsideZoneNgxsExecutionStrategy {
  constructor(_ngZone, _platformId) {
    this._ngZone = _ngZone;
    this._platformId = _platformId;
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      verifyZoneIsNotNooped(_ngZone);
    }
  }
  enter(func) {
    if (isPlatformServer(this._platformId)) {
      return this.runInsideAngular(func);
    }
    return this.runOutsideAngular(func);
  }
  leave(func) {
    return this.runInsideAngular(func);
  }
  runInsideAngular(func) {
    if (NgZone.isInAngularZone()) {
      return func();
    }
    return this._ngZone.run(func);
  }
  runOutsideAngular(func) {
    if (NgZone.isInAngularZone()) {
      return this._ngZone.runOutsideAngular(func);
    }
    return func();
  }
};
_DispatchOutsideZoneNgxsExecutionStrategy.ɵfac = function DispatchOutsideZoneNgxsExecutionStrategy_Factory(t) {
  return new (t || _DispatchOutsideZoneNgxsExecutionStrategy)(ɵɵinject(NgZone), ɵɵinject(PLATFORM_ID));
};
_DispatchOutsideZoneNgxsExecutionStrategy.ɵprov = ɵɵdefineInjectable({
  token: _DispatchOutsideZoneNgxsExecutionStrategy,
  factory: _DispatchOutsideZoneNgxsExecutionStrategy.ɵfac,
  providedIn: "root"
});
var DispatchOutsideZoneNgxsExecutionStrategy = _DispatchOutsideZoneNgxsExecutionStrategy;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DispatchOutsideZoneNgxsExecutionStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
function verifyZoneIsNotNooped(ngZone) {
  if (ngZone instanceof NgZone) {
    return;
  }
  console.warn(getZoneWarningMessage());
}
var NG_DEV_MODE$8 = typeof ngDevMode !== "undefined" && ngDevMode;
var CUSTOM_NGXS_EXECUTION_STRATEGY = new InjectionToken(NG_DEV_MODE$8 ? "CUSTOM_NGXS_EXECUTION_STRATEGY" : "");
var NGXS_EXECUTION_STRATEGY = new InjectionToken(NG_DEV_MODE$8 ? "NGXS_EXECUTION_STRATEGY" : "", {
  providedIn: "root",
  factory: () => {
    const ngZone = inject(NgZone);
    const injector = inject(INJECTOR$1);
    const executionStrategy = injector.get(CUSTOM_NGXS_EXECUTION_STRATEGY);
    const isNgZoneEnabled = ngZone instanceof NgZone;
    return executionStrategy ? injector.get(executionStrategy) : injector.get(isNgZoneEnabled ? DispatchOutsideZoneNgxsExecutionStrategy : NoopNgxsExecutionStrategy);
  }
});
var _InternalNgxsExecutionStrategy = class _InternalNgxsExecutionStrategy {
  constructor(_executionStrategy) {
    this._executionStrategy = _executionStrategy;
  }
  enter(func) {
    return this._executionStrategy.enter(func);
  }
  leave(func) {
    return this._executionStrategy.leave(func);
  }
};
_InternalNgxsExecutionStrategy.ɵfac = function InternalNgxsExecutionStrategy_Factory(t) {
  return new (t || _InternalNgxsExecutionStrategy)(ɵɵinject(NGXS_EXECUTION_STRATEGY));
};
_InternalNgxsExecutionStrategy.ɵprov = ɵɵdefineInjectable({
  token: _InternalNgxsExecutionStrategy,
  factory: _InternalNgxsExecutionStrategy.ɵfac,
  providedIn: "root"
});
var InternalNgxsExecutionStrategy = _InternalNgxsExecutionStrategy;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalNgxsExecutionStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [NGXS_EXECUTION_STRATEGY]
    }]
  }], null);
})();
var compose = (funcs) => (...args) => {
  const curr = funcs.shift();
  return curr(...args, (...nextArgs) => compose(funcs)(...nextArgs));
};
function leaveNgxs(ngxsExecutionStrategy) {
  return ɵwrapObserverCalls((fn) => ngxsExecutionStrategy.leave(fn));
}
var _InternalActions = class _InternalActions extends ɵOrderedSubject {
  ngOnDestroy() {
    this.complete();
  }
};
_InternalActions.ɵfac = /* @__PURE__ */ (() => {
  let ɵInternalActions_BaseFactory;
  return function InternalActions_Factory(t) {
    return (ɵInternalActions_BaseFactory || (ɵInternalActions_BaseFactory = ɵɵgetInheritedFactory(_InternalActions)))(t || _InternalActions);
  };
})();
_InternalActions.ɵprov = ɵɵdefineInjectable({
  token: _InternalActions,
  factory: _InternalActions.ɵfac,
  providedIn: "root"
});
var InternalActions = _InternalActions;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalActions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _Actions = class _Actions extends Observable {
  constructor(internalActions$, internalExecutionStrategy) {
    const sharedInternalActions$ = internalActions$.pipe(
      leaveNgxs(internalExecutionStrategy),
      // The `InternalActions` subject emits outside of the Angular zone.
      // We have to re-enter the Angular zone for any incoming consumer.
      // The `share()` operator reduces the number of change detections.
      // This would call leave only once for any stream emission across all active subscribers.
      share()
    );
    super((observer) => {
      const childSubscription = sharedInternalActions$.subscribe({
        next: (ctx) => observer.next(ctx),
        error: (error) => observer.error(error),
        complete: () => observer.complete()
      });
      observer.add(childSubscription);
    });
  }
};
_Actions.ɵfac = function Actions_Factory(t) {
  return new (t || _Actions)(ɵɵinject(InternalActions), ɵɵinject(InternalNgxsExecutionStrategy));
};
_Actions.ɵprov = ɵɵdefineInjectable({
  token: _Actions,
  factory: _Actions.ɵfac,
  providedIn: "root"
});
var Actions = _Actions;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Actions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: InternalActions
  }, {
    type: InternalNgxsExecutionStrategy
  }], null);
})();
var _PluginManager = class _PluginManager {
  constructor(_parentManager, _pluginHandlers) {
    this._parentManager = _parentManager;
    this._pluginHandlers = _pluginHandlers;
    this.plugins = [];
    this.registerHandlers();
  }
  get rootPlugins() {
    return this._parentManager && this._parentManager.plugins || this.plugins;
  }
  registerHandlers() {
    const pluginHandlers = this.getPluginHandlers();
    this.rootPlugins.push(...pluginHandlers);
  }
  getPluginHandlers() {
    const handlers = this._pluginHandlers || [];
    return handlers.map((plugin) => plugin.handle ? plugin.handle.bind(plugin) : plugin);
  }
};
_PluginManager.ɵfac = function PluginManager_Factory(t) {
  return new (t || _PluginManager)(ɵɵinject(_PluginManager, 12), ɵɵinject(NGXS_PLUGINS, 8));
};
_PluginManager.ɵprov = ɵɵdefineInjectable({
  token: _PluginManager,
  factory: _PluginManager.ɵfac
});
var PluginManager = _PluginManager;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PluginManager, [{
    type: Injectable
  }], () => [{
    type: PluginManager,
    decorators: [{
      type: Optional
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [NGXS_PLUGINS]
    }, {
      type: Optional
    }]
  }], null);
})();
var ɵɵunhandledRxjsErrorCallbacks = /* @__PURE__ */ new WeakMap();
var existingHandler = config.onUnhandledError;
config.onUnhandledError = function(error) {
  const unhandledErrorCallback = ɵɵunhandledRxjsErrorCallbacks.get(error);
  if (unhandledErrorCallback) {
    unhandledErrorCallback();
  } else if (existingHandler) {
    existingHandler.call(this, error);
  } else {
    throw error;
  }
};
function executeUnhandledCallback(error) {
  const unhandledErrorCallback = ɵɵunhandledRxjsErrorCallbacks.get(error);
  if (unhandledErrorCallback) {
    unhandledErrorCallback();
    return true;
  }
  return false;
}
function assignUnhandledCallback(error, callback) {
  if (error !== null && typeof error === "object") {
    let hasBeenCalled = false;
    ɵɵunhandledRxjsErrorCallbacks.set(error, () => {
      if (!hasBeenCalled) {
        hasBeenCalled = true;
        callback();
      }
    });
  }
  return error;
}
function fallbackSubscriber(ngZone) {
  return (source) => {
    let subscription = source.subscribe({
      error: (error) => {
        ngZone.runOutsideAngular(() => {
          queueMicrotask(() => {
            if (subscription) {
              executeUnhandledCallback(error);
            }
          });
        });
      }
    });
    return new Observable((subscriber) => {
      subscription?.unsubscribe();
      subscription = null;
      return source.subscribe(subscriber);
    });
  };
}
var _InternalDispatchedActionResults = class _InternalDispatchedActionResults extends Subject {
};
_InternalDispatchedActionResults.ɵfac = /* @__PURE__ */ (() => {
  let ɵInternalDispatchedActionResults_BaseFactory;
  return function InternalDispatchedActionResults_Factory(t) {
    return (ɵInternalDispatchedActionResults_BaseFactory || (ɵInternalDispatchedActionResults_BaseFactory = ɵɵgetInheritedFactory(_InternalDispatchedActionResults)))(t || _InternalDispatchedActionResults);
  };
})();
_InternalDispatchedActionResults.ɵprov = ɵɵdefineInjectable({
  token: _InternalDispatchedActionResults,
  factory: _InternalDispatchedActionResults.ɵfac,
  providedIn: "root"
});
var InternalDispatchedActionResults = _InternalDispatchedActionResults;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalDispatchedActionResults, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _InternalDispatcher = class _InternalDispatcher {
  constructor(_ngZone, _actions, _actionResults, _pluginManager, _stateStream, _ngxsExecutionStrategy) {
    this._ngZone = _ngZone;
    this._actions = _actions;
    this._actionResults = _actionResults;
    this._pluginManager = _pluginManager;
    this._stateStream = _stateStream;
    this._ngxsExecutionStrategy = _ngxsExecutionStrategy;
  }
  /**
   * Dispatches event(s).
   */
  dispatch(actionOrActions) {
    const result = this._ngxsExecutionStrategy.enter(() => this.dispatchByEvents(actionOrActions));
    return result.pipe(fallbackSubscriber(this._ngZone), leaveNgxs(this._ngxsExecutionStrategy));
  }
  dispatchByEvents(actionOrActions) {
    if (Array.isArray(actionOrActions)) {
      if (actionOrActions.length === 0) return of(void 0);
      return forkJoin(actionOrActions.map((action) => this.dispatchSingle(action))).pipe(map(() => void 0));
    } else {
      return this.dispatchSingle(actionOrActions);
    }
  }
  dispatchSingle(action) {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      const type = getActionTypeFromInstance(action);
      if (!type) {
        const error = new Error(`This action doesn't have a type property: ${action.constructor.name}`);
        return throwError(() => error);
      }
    }
    const prevState = this._stateStream.getValue();
    const plugins = this._pluginManager.plugins;
    return compose([...plugins, (nextState, nextAction) => {
      if (nextState !== prevState) {
        this._stateStream.next(nextState);
      }
      const actionResult$ = this.getActionResultStream(nextAction);
      actionResult$.subscribe((ctx) => this._actions.next(ctx));
      this._actions.next({
        action: nextAction,
        status: "DISPATCHED"
        /* ActionStatus.Dispatched */
      });
      return this.createDispatchObservable(actionResult$);
    }])(prevState, action).pipe(shareReplay());
  }
  getActionResultStream(action) {
    return this._actionResults.pipe(filter(
      (ctx) => ctx.action === action && ctx.status !== "DISPATCHED"
      /* ActionStatus.Dispatched */
    ), take(1), shareReplay());
  }
  createDispatchObservable(actionResult$) {
    return actionResult$.pipe(exhaustMap((ctx) => {
      switch (ctx.status) {
        case "SUCCESSFUL":
          return of(this._stateStream.getValue());
        case "ERRORED":
          return throwError(() => ctx.error);
        default:
          return EMPTY;
      }
    })).pipe(shareReplay());
  }
};
_InternalDispatcher.ɵfac = function InternalDispatcher_Factory(t) {
  return new (t || _InternalDispatcher)(ɵɵinject(NgZone), ɵɵinject(InternalActions), ɵɵinject(InternalDispatchedActionResults), ɵɵinject(PluginManager), ɵɵinject(ɵStateStream), ɵɵinject(InternalNgxsExecutionStrategy));
};
_InternalDispatcher.ɵprov = ɵɵdefineInjectable({
  token: _InternalDispatcher,
  factory: _InternalDispatcher.ɵfac,
  providedIn: "root"
});
var InternalDispatcher = _InternalDispatcher;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }, {
    type: InternalActions
  }, {
    type: InternalDispatchedActionResults
  }, {
    type: PluginManager
  }, {
    type: ɵStateStream
  }, {
    type: InternalNgxsExecutionStrategy
  }], null);
})();
var NG_DEV_MODE$7 = typeof ngDevMode !== "undefined" && ngDevMode;
var ROOT_STATE_TOKEN = new InjectionToken(NG_DEV_MODE$7 ? "ROOT_STATE_TOKEN" : "");
var FEATURE_STATE_TOKEN = new InjectionToken(NG_DEV_MODE$7 ? "FEATURE_STATE_TOKEN" : "");
var NGXS_OPTIONS = new InjectionToken(NG_DEV_MODE$7 ? "NGXS_OPTIONS" : "");
var _NgxsConfig = class _NgxsConfig {
  constructor() {
    this.compatibility = {
      strictContentSecurityPolicy: false
    };
    this.executionStrategy = DispatchOutsideZoneNgxsExecutionStrategy;
    this.selectorOptions = {
      injectContainerState: false,
      suppressErrors: false
    };
  }
};
_NgxsConfig.ɵfac = function NgxsConfig_Factory(t) {
  return new (t || _NgxsConfig)();
};
_NgxsConfig.ɵprov = ɵɵdefineInjectable({
  token: _NgxsConfig,
  factory: () => (() => {
    const defaultConfig = new _NgxsConfig();
    const config2 = inject(NGXS_OPTIONS);
    return __spreadProps(__spreadValues(__spreadValues({}, defaultConfig), config2), {
      selectorOptions: __spreadValues(__spreadValues({}, defaultConfig.selectorOptions), config2.selectorOptions)
    });
  })(),
  providedIn: "root"
});
var NgxsConfig = _NgxsConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => {
        const defaultConfig = new NgxsConfig();
        const config2 = inject(NGXS_OPTIONS);
        return __spreadProps(__spreadValues(__spreadValues({}, defaultConfig), config2), {
          selectorOptions: __spreadValues(__spreadValues({}, defaultConfig.selectorOptions), config2.selectorOptions)
        });
      }
    }]
  }], null, null);
})();
var NgxsSimpleChange = class {
  constructor(previousValue, currentValue, firstChange) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.firstChange = firstChange;
  }
};
var deepFreeze = (o) => {
  Object.freeze(o);
  const oIsFunction = typeof o === "function";
  const hasOwnProp = Object.prototype.hasOwnProperty;
  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (hasOwnProp.call(o, prop) && (oIsFunction ? prop !== "caller" && prop !== "callee" && prop !== "arguments" : true) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  return o;
};
var _InternalStateOperations = class _InternalStateOperations {
  constructor(_stateStream, _dispatcher, _config) {
    this._stateStream = _stateStream;
    this._dispatcher = _dispatcher;
    this._config = _config;
  }
  /**
   * Returns the root state operators.
   */
  getRootStateOperations() {
    const rootStateOperations = {
      getState: () => this._stateStream.getValue(),
      setState: (newState) => this._stateStream.next(newState),
      dispatch: (actionOrActions) => this._dispatcher.dispatch(actionOrActions)
    };
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      return this._config.developmentMode ? ensureStateAndActionsAreImmutable(rootStateOperations) : rootStateOperations;
    } else {
      return rootStateOperations;
    }
  }
  setStateToTheCurrentWithNew(results) {
    const stateOperations = this.getRootStateOperations();
    const currentState = stateOperations.getState();
    stateOperations.setState(__spreadValues(__spreadValues({}, currentState), results.defaults));
  }
};
_InternalStateOperations.ɵfac = function InternalStateOperations_Factory(t) {
  return new (t || _InternalStateOperations)(ɵɵinject(ɵStateStream), ɵɵinject(InternalDispatcher), ɵɵinject(NgxsConfig));
};
_InternalStateOperations.ɵprov = ɵɵdefineInjectable({
  token: _InternalStateOperations,
  factory: _InternalStateOperations.ɵfac,
  providedIn: "root"
});
var InternalStateOperations = _InternalStateOperations;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalStateOperations, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: ɵStateStream
  }, {
    type: InternalDispatcher
  }, {
    type: NgxsConfig
  }], null);
})();
function ensureStateAndActionsAreImmutable(root) {
  return {
    getState: () => root.getState(),
    setState: (value) => {
      const frozenValue = deepFreeze(value);
      return root.setState(frozenValue);
    },
    dispatch: (actions) => {
      return root.dispatch(actions);
    }
  };
}
var NG_DEV_MODE$6 = typeof ngDevMode !== "undefined" && ngDevMode;
function createRootSelectorFactory(selectorMetaData, selectors, memoizedSelectorFn) {
  return (context) => {
    const {
      argumentSelectorFunctions,
      selectorOptions
    } = getRuntimeSelectorInfo(context, selectorMetaData, selectors);
    const {
      suppressErrors
    } = selectorOptions;
    return function selectFromRoot(rootState) {
      const results = argumentSelectorFunctions.map((argFn) => argFn(rootState));
      try {
        return memoizedSelectorFn(...results);
      } catch (ex) {
        if (suppressErrors && ex instanceof TypeError) {
          return void 0;
        }
        if (NG_DEV_MODE$6) {
          const message = "The selector below has thrown an error upon invocation. Please check for any unsafe property access that may result in null or undefined values.";
          console.error(message, selectorMetaData.originalFn);
        }
        throw ex;
      }
    };
  };
}
function createMemoizedSelectorFn(originalFn, creationMetadata) {
  const containerClass = creationMetadata && creationMetadata.containerClass;
  const wrappedFn = function wrappedSelectorFn(...args) {
    const returnValue = originalFn.apply(containerClass, args);
    if (returnValue instanceof Function) {
      const innerMemoizedFn = ɵmemoize.apply(null, [returnValue]);
      return innerMemoizedFn;
    }
    return returnValue;
  };
  const memoizedFn = ɵmemoize(wrappedFn);
  Object.setPrototypeOf(memoizedFn, originalFn);
  return memoizedFn;
}
function getRuntimeSelectorInfo(context, selectorMetaData, selectors = []) {
  const localSelectorOptions = selectorMetaData.getSelectorOptions();
  const selectorOptions = context.getSelectorOptions(localSelectorOptions);
  const selectorsToApply = getSelectorsToApply(selectors, selectorOptions, selectorMetaData.containerClass);
  const argumentSelectorFunctions = selectorsToApply.map((selector) => {
    const factory = getRootSelectorFactory(selector);
    return factory(context);
  });
  return {
    selectorOptions,
    argumentSelectorFunctions
  };
}
function getSelectorsToApply(selectors = [], selectorOptions, containerClass) {
  const selectorsToApply = [];
  const canInjectContainerState = selectorOptions.injectContainerState || selectors.length === 0;
  if (containerClass && canInjectContainerState) {
    const metadata = ɵgetStoreMetadata(containerClass);
    if (metadata) {
      selectorsToApply.push(containerClass);
    }
  }
  selectorsToApply.push(...selectors);
  return selectorsToApply;
}
function getRootSelectorFactory(selector) {
  const metadata = ɵgetSelectorMetadata(selector) || ɵgetStoreMetadata(selector);
  return metadata && metadata.makeRootSelector || (() => selector);
}
var NG_DEV_MODE$5 = typeof ngDevMode !== "undefined" && ngDevMode;
function compliantPropGetter(paths) {
  return (obj) => {
    for (let i = 0; i < paths.length; i++) {
      if (!obj) return void 0;
      obj = obj[paths[i]];
    }
    return obj;
  };
}
function fastPropGetter(paths) {
  const segments = paths;
  let seg = "store." + segments[0];
  let i = 0;
  const l = segments.length;
  let expr = seg;
  while (++i < l) {
    expr = expr + " && " + (seg = seg + "." + segments[i]);
  }
  const fn = new Function("store", "return " + expr + ";");
  return fn;
}
function propGetter(paths, config2) {
  if (config2?.compatibility?.strictContentSecurityPolicy) {
    return compliantPropGetter(paths);
  } else {
    return fastPropGetter(paths);
  }
}
var ɵPROP_GETTER = new InjectionToken(NG_DEV_MODE$5 ? "PROP_GETTER" : "", {
  providedIn: "root",
  factory: () => inject(NgxsConfig).compatibility?.strictContentSecurityPolicy ? compliantPropGetter : fastPropGetter
});
function buildGraph(stateClasses) {
  const findName = (stateClass) => {
    const meta = stateClasses.find((g) => g === stateClass);
    if (NG_DEV_MODE$5 && !meta) {
      throw new Error(`Child state not found: ${stateClass}. \r
You may have forgotten to add states to module`);
    }
    return meta[ɵMETA_KEY].name;
  };
  return stateClasses.reduce((result, stateClass) => {
    const {
      name,
      children
    } = stateClass[ɵMETA_KEY];
    result[name] = (children || []).map(findName);
    return result;
  }, {});
}
function nameToState(states) {
  return states.reduce((result, stateClass) => {
    const meta = stateClass[ɵMETA_KEY];
    result[meta.name] = stateClass;
    return result;
  }, {});
}
function findFullParentPath(obj, newObj = {}) {
  const visit = (child, keyToFind) => {
    for (const key in child) {
      if (child.hasOwnProperty(key) && child[key].indexOf(keyToFind) >= 0) {
        const parent = visit(child, key);
        return parent !== null ? `${parent}.${key}` : key;
      }
    }
    return null;
  };
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const parent = visit(obj, key);
      newObj[key] = parent ? `${parent}.${key}` : key;
    }
  }
  return newObj;
}
function topologicalSort(graph) {
  const sorted = [];
  const visited = {};
  const visit = (name, ancestors = []) => {
    if (!Array.isArray(ancestors)) {
      ancestors = [];
    }
    ancestors.push(name);
    visited[name] = true;
    graph[name].forEach((dep) => {
      if (NG_DEV_MODE$5 && ancestors.indexOf(dep) >= 0) {
        throw new Error(`Circular dependency '${dep}' is required by '${name}': ${ancestors.join(" -> ")}`);
      }
      if (visited[dep]) {
        return;
      }
      visit(dep, ancestors.slice(0));
    });
    if (sorted.indexOf(name) < 0) {
      sorted.push(name);
    }
  };
  Object.keys(graph).forEach((k) => visit(k));
  return sorted.reverse();
}
function ofAction(...allowedTypes) {
  return ofActionOperator(allowedTypes);
}
function ofActionDispatched(...allowedTypes) {
  return ofActionOperator(allowedTypes, [
    "DISPATCHED"
    /* ActionStatus.Dispatched */
  ]);
}
function ofActionSuccessful(...allowedTypes) {
  return ofActionOperator(allowedTypes, [
    "SUCCESSFUL"
    /* ActionStatus.Successful */
  ]);
}
function ofActionCanceled(...allowedTypes) {
  return ofActionOperator(allowedTypes, [
    "CANCELED"
    /* ActionStatus.Canceled */
  ]);
}
function ofActionCompleted(...allowedTypes) {
  const allowedStatuses = [
    "SUCCESSFUL",
    "CANCELED",
    "ERRORED"
    /* ActionStatus.Errored */
  ];
  return ofActionOperator(allowedTypes, allowedStatuses, mapActionResult);
}
function ofActionErrored(...allowedTypes) {
  return ofActionOperator(allowedTypes, [
    "ERRORED"
    /* ActionStatus.Errored */
  ], mapActionResult);
}
function ofActionOperator(allowedTypes, statuses, mapOperator = mapAction) {
  const allowedMap = createAllowedActionTypesMap(allowedTypes);
  const allowedStatusMap = statuses && createAllowedStatusesMap(statuses);
  return function(o) {
    return o.pipe(filterStatus(allowedMap, allowedStatusMap), mapOperator());
  };
}
function filterStatus(allowedTypes, allowedStatuses) {
  return filter((ctx) => {
    const actionType = getActionTypeFromInstance(ctx.action);
    const typeMatch = allowedTypes[actionType];
    const statusMatch = allowedStatuses ? allowedStatuses[ctx.status] : true;
    return typeMatch && statusMatch;
  });
}
function mapActionResult() {
  return map(({
    action,
    status,
    error
  }) => {
    return {
      action,
      result: {
        successful: "SUCCESSFUL" === status,
        canceled: "CANCELED" === status,
        error
      }
    };
  });
}
function mapAction() {
  return map((ctx) => ctx.action);
}
function createAllowedActionTypesMap(types) {
  return types.reduce((filterMap, klass) => {
    filterMap[getActionTypeFromInstance(klass)] = true;
    return filterMap;
  }, {});
}
function createAllowedStatusesMap(statuses) {
  return statuses.reduce((filterMap, status) => {
    filterMap[status] = true;
    return filterMap;
  }, {});
}
function simplePatch(value) {
  return (existingState) => {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (Array.isArray(value)) {
        throwPatchingArrayError();
      } else if (typeof value !== "object") {
        throwPatchingPrimitiveError();
      }
    }
    const newState = __spreadValues({}, existingState);
    for (const key in value) {
      newState[key] = value[key];
    }
    return newState;
  };
}
var _StateContextFactory = class _StateContextFactory {
  constructor(_internalStateOperations) {
    this._internalStateOperations = _internalStateOperations;
  }
  /**
   * Create the state context
   */
  createStateContext(mappedStore) {
    const root = this._internalStateOperations.getRootStateOperations();
    return {
      getState() {
        const currentAppState = root.getState();
        return getState(currentAppState, mappedStore.path);
      },
      patchState(val) {
        const currentAppState = root.getState();
        const patchOperator = simplePatch(val);
        setStateFromOperator(root, currentAppState, patchOperator, mappedStore.path);
      },
      setState(val) {
        const currentAppState = root.getState();
        if (isStateOperator(val)) {
          setStateFromOperator(root, currentAppState, val, mappedStore.path);
        } else {
          setStateValue(root, currentAppState, val, mappedStore.path);
        }
      },
      dispatch(actions) {
        return root.dispatch(actions);
      }
    };
  }
};
_StateContextFactory.ɵfac = function StateContextFactory_Factory(t) {
  return new (t || _StateContextFactory)(ɵɵinject(InternalStateOperations));
};
_StateContextFactory.ɵprov = ɵɵdefineInjectable({
  token: _StateContextFactory,
  factory: _StateContextFactory.ɵfac,
  providedIn: "root"
});
var StateContextFactory = _StateContextFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StateContextFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: InternalStateOperations
  }], null);
})();
function setStateValue(root, currentAppState, newValue, path) {
  const newAppState = setValue(currentAppState, path, newValue);
  root.setState(newAppState);
  return newAppState;
}
function setStateFromOperator(root, currentAppState, stateOperator, path) {
  const local = getState(currentAppState, path);
  const newValue = stateOperator(local);
  return setStateValue(root, currentAppState, newValue, path);
}
function getState(currentAppState, path) {
  return getValue(currentAppState, path);
}
var stateNameRegex = new RegExp("^[a-zA-Z0-9_]+$");
function ensureStateNameIsValid(name) {
  if (!name) {
    throwStateNamePropertyError();
  } else if (!stateNameRegex.test(name)) {
    throwStateNameError(name);
  }
}
function ensureStateNameIsUnique(stateName, state, statesByName) {
  const existingState = statesByName[stateName];
  if (existingState && existingState !== state) {
    throwStateUniqueError(stateName, state.name, existingState.name);
  }
}
function ensureStatesAreDecorated(stateClasses) {
  stateClasses.forEach((stateClass) => {
    if (!ɵgetStoreMetadata(stateClass)) {
      throwStateDecoratorError(stateClass.name);
    }
  });
}
function ensureStateClassIsInjectable(stateClass) {
  if (jit_hasInjectableAnnotation(stateClass) || aot_hasNgInjectableDef(stateClass)) {
    return;
  }
  console.warn(getUndecoratedStateWithInjectableWarningMessage(stateClass.name));
}
function aot_hasNgInjectableDef(stateClass) {
  return !!stateClass.ɵprov;
}
function jit_hasInjectableAnnotation(stateClass) {
  const annotations = stateClass.__annotations__ || [];
  return annotations.some((annotation) => annotation?.ngMetadataName === "Injectable");
}
var NG_DEV_MODE$4 = typeof ngDevMode !== "undefined" && ngDevMode;
var NGXS_DEVELOPMENT_OPTIONS = new InjectionToken(NG_DEV_MODE$4 ? "NGXS_DEVELOPMENT_OPTIONS" : "", {
  providedIn: "root",
  factory: () => ({
    warnOnUnhandledActions: true
  })
});
var _NgxsUnhandledActionsLogger = class _NgxsUnhandledActionsLogger {
  constructor(options) {
    this._ignoredActions = /* @__PURE__ */ new Set([InitState.type, UpdateState.type]);
    if (typeof options.warnOnUnhandledActions === "object") {
      this.ignoreActions(...options.warnOnUnhandledActions.ignore);
    }
  }
  /**
   * Adds actions to the internal list of actions that should be ignored.
   */
  ignoreActions(...actions) {
    for (const action of actions) {
      this._ignoredActions.add(action.type);
    }
  }
  /** @internal */
  warn(action) {
    const actionShouldBeIgnored = Array.from(this._ignoredActions).some((type) => type === getActionTypeFromInstance(action));
    if (actionShouldBeIgnored) {
      return;
    }
    action = action.constructor && action.constructor.name !== "Object" ? action.constructor.name : action.type;
    console.warn(`The ${action} action has been dispatched but hasn't been handled. This may happen if the state with an action handler for this action is not registered.`);
  }
};
_NgxsUnhandledActionsLogger.ɵfac = function NgxsUnhandledActionsLogger_Factory(t) {
  return new (t || _NgxsUnhandledActionsLogger)(ɵɵinject(NGXS_DEVELOPMENT_OPTIONS));
};
_NgxsUnhandledActionsLogger.ɵprov = ɵɵdefineInjectable({
  token: _NgxsUnhandledActionsLogger,
  factory: _NgxsUnhandledActionsLogger.ɵfac
});
var NgxsUnhandledActionsLogger = _NgxsUnhandledActionsLogger;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsUnhandledActionsLogger, [{
    type: Injectable
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [NGXS_DEVELOPMENT_OPTIONS]
    }]
  }], null);
})();
var _NgxsUnhandledErrorHandler = class _NgxsUnhandledErrorHandler {
  constructor() {
    this._ngZone = inject(NgZone);
    this._errorHandler = inject(ErrorHandler);
  }
  /**
   * The `_unhandledErrorContext` is left unused internally since we do not
   * require it for internal operations. However, developers who wish to provide
   * their own custom error handler may utilize this context information.
   */
  handleError(error, _unhandledErrorContext) {
    this._ngZone.runOutsideAngular(() => this._errorHandler.handleError(error));
  }
};
_NgxsUnhandledErrorHandler.ɵfac = function NgxsUnhandledErrorHandler_Factory(t) {
  return new (t || _NgxsUnhandledErrorHandler)();
};
_NgxsUnhandledErrorHandler.ɵprov = ɵɵdefineInjectable({
  token: _NgxsUnhandledErrorHandler,
  factory: _NgxsUnhandledErrorHandler.ɵfac,
  providedIn: "root"
});
var NgxsUnhandledErrorHandler = _NgxsUnhandledErrorHandler;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsUnhandledErrorHandler, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NG_DEV_MODE$3 = typeof ngDevMode !== "undefined" && ngDevMode;
function cloneDefaults(defaults) {
  let value = defaults === void 0 ? {} : defaults;
  if (defaults) {
    if (Array.isArray(defaults)) {
      value = defaults.slice();
    } else if (typeof defaults === "object") {
      value = __spreadValues({}, defaults);
    }
  }
  return value;
}
var _StateFactory = class _StateFactory {
  constructor(_injector, _config, _parentFactory, _actions, _actionResults, _stateContextFactory, _initialState) {
    this._injector = _injector;
    this._config = _config;
    this._parentFactory = _parentFactory;
    this._actions = _actions;
    this._actionResults = _actionResults;
    this._stateContextFactory = _stateContextFactory;
    this._initialState = _initialState;
    this._actionsSubscription = null;
    this._propGetter = inject(ɵPROP_GETTER);
    this._ngxsUnhandledErrorHandler = null;
    this._states = [];
    this._statesByName = {};
    this._statePaths = {};
    this.getRuntimeSelectorContext = ɵmemoize(() => {
      const stateFactory = this;
      const propGetter2 = stateFactory._propGetter;
      function resolveGetter(key) {
        const path = stateFactory.statePaths[key];
        return path ? propGetter2(path.split(".")) : null;
      }
      const context = this._parentFactory ? this._parentFactory.getRuntimeSelectorContext() : {
        getStateGetter(key) {
          let getter = (
            /*@__INLINE__*/
            resolveGetter(key)
          );
          if (getter) {
            return getter;
          }
          return (...args) => {
            if (!getter) {
              getter = /*@__INLINE__*/
              resolveGetter(key);
            }
            return getter ? getter(...args) : void 0;
          };
        },
        getSelectorOptions(localOptions) {
          const globalSelectorOptions = stateFactory._config.selectorOptions;
          return __spreadValues(__spreadValues({}, globalSelectorOptions), localOptions || {});
        }
      };
      return context;
    });
  }
  get states() {
    return this._parentFactory ? this._parentFactory.states : this._states;
  }
  get statesByName() {
    return this._parentFactory ? this._parentFactory.statesByName : this._statesByName;
  }
  get statePaths() {
    return this._parentFactory ? this._parentFactory.statePaths : this._statePaths;
  }
  ngOnDestroy() {
    this._actionsSubscription?.unsubscribe();
  }
  /**
   * Add a new state to the global defs.
   */
  add(stateClasses) {
    if (NG_DEV_MODE$3) {
      ensureStatesAreDecorated(stateClasses);
    }
    const {
      newStates
    } = this.addToStatesMap(stateClasses);
    if (!newStates.length) return [];
    const stateGraph = buildGraph(newStates);
    const sortedStates = topologicalSort(stateGraph);
    const paths = findFullParentPath(stateGraph);
    const nameGraph = nameToState(newStates);
    const bootstrappedStores = [];
    for (const name of sortedStates) {
      const stateClass = nameGraph[name];
      const path = paths[name];
      const meta = stateClass[ɵMETA_KEY];
      this.addRuntimeInfoToMeta(meta, path);
      if (NG_DEV_MODE$3) {
        ensureStateClassIsInjectable(stateClass);
      }
      const stateMap = {
        name,
        path,
        isInitialised: false,
        actions: meta.actions,
        instance: this._injector.get(stateClass),
        defaults: cloneDefaults(meta.defaults)
      };
      if (!this.hasBeenMountedAndBootstrapped(name, path)) {
        bootstrappedStores.push(stateMap);
      }
      this.states.push(stateMap);
    }
    return bootstrappedStores;
  }
  /**
   * Add a set of states to the store and return the defaults
   */
  addAndReturnDefaults(stateClasses) {
    const classes = stateClasses || [];
    const mappedStores = this.add(classes);
    const defaults = mappedStores.reduce((result, mappedStore) => setValue(result, mappedStore.path, mappedStore.defaults), {});
    return {
      defaults,
      states: mappedStores
    };
  }
  connectActionHandlers() {
    if (this._parentFactory || this._actionsSubscription !== null) {
      return;
    }
    const dispatched$ = new Subject();
    this._actionsSubscription = this._actions.pipe(filter(
      (ctx) => ctx.status === "DISPATCHED"
      /* ActionStatus.Dispatched */
    ), mergeMap((ctx) => {
      dispatched$.next(ctx);
      const action = ctx.action;
      return this.invokeActions(dispatched$, action).pipe(map(() => ({
        action,
        status: "SUCCESSFUL"
        /* ActionStatus.Successful */
      })), defaultIfEmpty({
        action,
        status: "CANCELED"
        /* ActionStatus.Canceled */
      }), catchError((error) => {
        const ngxsUnhandledErrorHandler = this._ngxsUnhandledErrorHandler ||= this._injector.get(NgxsUnhandledErrorHandler);
        const handleableError = assignUnhandledCallback(error, () => ngxsUnhandledErrorHandler.handleError(error, {
          action
        }));
        return of({
          action,
          status: "ERRORED",
          error: handleableError
        });
      }));
    })).subscribe((ctx) => this._actionResults.next(ctx));
  }
  /**
   * Invoke actions on the states.
   */
  invokeActions(dispatched$, action) {
    const type = getActionTypeFromInstance(action);
    const results = [];
    let actionHasBeenHandled = false;
    for (const metadata of this.states) {
      const actionMetas = metadata.actions[type];
      if (actionMetas) {
        for (const actionMeta of actionMetas) {
          const stateContext = this._stateContextFactory.createStateContext(metadata);
          try {
            let result = metadata.instance[actionMeta.fn](stateContext, action);
            if (isPromise(result)) {
              result = from(result);
            }
            if (isObservable(result)) {
              result = result.pipe(mergeMap((value) => {
                if (isPromise(value)) {
                  return from(value);
                }
                if (isObservable(value)) {
                  return value;
                }
                return of(value);
              }), defaultIfEmpty({}));
              if (actionMeta.options.cancelUncompleted) {
                result = result.pipe(takeUntil(dispatched$.pipe(ofActionDispatched(action))));
              }
            } else {
              result = of({}).pipe(shareReplay());
            }
            results.push(result);
          } catch (e) {
            results.push(throwError(e));
          }
          actionHasBeenHandled = true;
        }
      }
    }
    if (NG_DEV_MODE$3 && !actionHasBeenHandled) {
      const unhandledActionsLogger = this._injector.get(NgxsUnhandledActionsLogger, null);
      if (unhandledActionsLogger) {
        unhandledActionsLogger.warn(action);
      }
    }
    if (!results.length) {
      results.push(of({}));
    }
    return forkJoin(results);
  }
  addToStatesMap(stateClasses) {
    const newStates = [];
    const statesMap = this.statesByName;
    for (const stateClass of stateClasses) {
      const stateName = ɵgetStoreMetadata(stateClass).name;
      if (NG_DEV_MODE$3) {
        ensureStateNameIsUnique(stateName, stateClass, statesMap);
      }
      const unmountedState = !statesMap[stateName];
      if (unmountedState) {
        newStates.push(stateClass);
        statesMap[stateName] = stateClass;
      }
    }
    return {
      newStates
    };
  }
  addRuntimeInfoToMeta(meta, path) {
    this.statePaths[meta.name] = path;
    meta.path = path;
  }
  hasBeenMountedAndBootstrapped(name, path) {
    const valueIsBootstrappedInInitialState = getValue(this._initialState, path) !== void 0;
    return this.statesByName[name] && valueIsBootstrappedInInitialState;
  }
};
_StateFactory.ɵfac = function StateFactory_Factory(t) {
  return new (t || _StateFactory)(ɵɵinject(Injector), ɵɵinject(NgxsConfig), ɵɵinject(_StateFactory, 12), ɵɵinject(InternalActions), ɵɵinject(InternalDispatchedActionResults), ɵɵinject(StateContextFactory), ɵɵinject(ɵINITIAL_STATE_TOKEN, 8));
};
_StateFactory.ɵprov = ɵɵdefineInjectable({
  token: _StateFactory,
  factory: _StateFactory.ɵfac
});
var StateFactory = _StateFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StateFactory, [{
    type: Injectable
  }], () => [{
    type: Injector
  }, {
    type: NgxsConfig
  }, {
    type: StateFactory,
    decorators: [{
      type: Optional
    }, {
      type: SkipSelf
    }]
  }, {
    type: InternalActions
  }, {
    type: InternalDispatchedActionResults
  }, {
    type: StateContextFactory
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ɵINITIAL_STATE_TOKEN]
    }]
  }], null);
})();
var _Store = class _Store {
  constructor(_stateStream, _internalStateOperations, _config, _internalExecutionStrategy, _stateFactory, initialStateValue) {
    this._stateStream = _stateStream;
    this._internalStateOperations = _internalStateOperations;
    this._config = _config;
    this._internalExecutionStrategy = _internalExecutionStrategy;
    this._stateFactory = _stateFactory;
    this._selectableStateStream = this._stateStream.pipe(leaveNgxs(this._internalExecutionStrategy), shareReplay({
      bufferSize: 1,
      refCount: true
    }));
    this.initStateStream(initialStateValue);
  }
  /**
   * Dispatches event(s).
   */
  dispatch(actionOrActions) {
    return this._internalStateOperations.getRootStateOperations().dispatch(actionOrActions);
  }
  /**
   * Selects a slice of data from the store.
   */
  select(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return this._selectableStateStream.pipe(map(selectorFn), catchError((error) => {
      if (this._config.selectorOptions.suppressErrors && error instanceof TypeError) {
        return of(void 0);
      }
      return throwError(error);
    }), distinctUntilChanged(), leaveNgxs(this._internalExecutionStrategy));
  }
  /**
   * Select one slice of data from the store.
   */
  selectOnce(selector) {
    return this.select(selector).pipe(take(1));
  }
  /**
   * Select a snapshot from the state.
   */
  selectSnapshot(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return selectorFn(this._stateStream.getValue());
  }
  /**
   * Select a signal from the state.
   */
  selectSignal(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return computed(() => selectorFn(this._stateStream.state()));
  }
  /**
   * Allow the user to subscribe to the root of the state
   */
  subscribe(fn) {
    return this._selectableStateStream.pipe(leaveNgxs(this._internalExecutionStrategy)).subscribe(fn);
  }
  /**
   * Return the raw value of the state.
   */
  snapshot() {
    return this._internalStateOperations.getRootStateOperations().getState();
  }
  /**
   * Reset the state to a specific point in time. This method is useful
   * for plugin's who need to modify the state directly or unit testing.
   */
  reset(state) {
    this._internalStateOperations.getRootStateOperations().setState(state);
  }
  getStoreBoundSelectorFn(selector) {
    const makeSelectorFn = getRootSelectorFactory(selector);
    const runtimeContext = this._stateFactory.getRuntimeSelectorContext();
    return makeSelectorFn(runtimeContext);
  }
  initStateStream(initialStateValue) {
    const value = this._stateStream.value;
    const storeIsEmpty = !value || Object.keys(value).length === 0;
    if (storeIsEmpty) {
      this._stateStream.next(initialStateValue);
    }
  }
};
_Store.ɵfac = function Store_Factory(t) {
  return new (t || _Store)(ɵɵinject(ɵStateStream), ɵɵinject(InternalStateOperations), ɵɵinject(NgxsConfig), ɵɵinject(InternalNgxsExecutionStrategy), ɵɵinject(StateFactory), ɵɵinject(ɵINITIAL_STATE_TOKEN, 8));
};
_Store.ɵprov = ɵɵdefineInjectable({
  token: _Store,
  factory: _Store.ɵfac,
  providedIn: "root"
});
var Store = _Store;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Store, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: ɵStateStream
  }, {
    type: InternalStateOperations
  }, {
    type: NgxsConfig
  }, {
    type: InternalNgxsExecutionStrategy
  }, {
    type: StateFactory
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ɵINITIAL_STATE_TOKEN]
    }]
  }], null);
})();
var NG_DEV_MODE$2 = typeof ngDevMode !== "undefined" && ngDevMode;
var NGXS_PREBOOT_FNS = new InjectionToken(NG_DEV_MODE$2 ? "NGXS_PREBOOT_FNS" : "");
function withNgxsPreboot(prebootFn) {
  return makeEnvironmentProviders([{
    provide: NGXS_PREBOOT_FNS,
    multi: true,
    useValue: prebootFn
  }]);
}
var _SelectFactory = class _SelectFactory {
  constructor(store, config2) {
    _SelectFactory.store = store;
    _SelectFactory.config = config2;
  }
  ngOnDestroy() {
    _SelectFactory.store = null;
    _SelectFactory.config = null;
  }
};
_SelectFactory.store = null;
_SelectFactory.config = null;
_SelectFactory.ɵfac = function SelectFactory_Factory(t) {
  return new (t || _SelectFactory)(ɵɵinject(Store), ɵɵinject(NgxsConfig));
};
_SelectFactory.ɵprov = ɵɵdefineInjectable({
  token: _SelectFactory,
  factory: _SelectFactory.ɵfac,
  providedIn: "root"
});
var SelectFactory = _SelectFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Store
  }, {
    type: NgxsConfig
  }], null);
})();
var NG_DEV_MODE$12 = typeof ngDevMode !== "undefined" && ngDevMode;
var _LifecycleStateManager = class _LifecycleStateManager {
  constructor(_store, _internalStateOperations, _stateContextFactory, _appBootstrappedState) {
    this._store = _store;
    this._internalStateOperations = _internalStateOperations;
    this._stateContextFactory = _stateContextFactory;
    this._appBootstrappedState = _appBootstrappedState;
    this._destroy$ = new ReplaySubject(1);
  }
  ngOnDestroy() {
    this._destroy$.next();
  }
  ngxsBootstrap(action, results) {
    if (NG_DEV_MODE$12) {
      if (action instanceof InitState) {
        this._initStateHasBeenDispatched = true;
      } else if (
        // This is a dev mode-only check that ensures the correct order of
        // state initialization. The `NgxsModule.forRoot` or `provideStore` should
        // always come first, followed by `forFeature` and `provideStates`. If the
        // `UpdateState` is dispatched before the `InitState` is dispatched, it indicates
        // that modules or providers are in an invalid order.
        action instanceof UpdateState && !this._initStateHasBeenDispatched
      ) {
        console.error(getInvalidInitializationOrderMessage(action.addedStates));
      }
    }
    this._internalStateOperations.getRootStateOperations().dispatch(action).pipe(filter(() => !!results), tap(() => this._invokeInitOnStates(results.states)), mergeMap(() => this._appBootstrappedState), filter((appBootstrapped) => !!appBootstrapped), takeUntil(this._destroy$)).subscribe(() => this._invokeBootstrapOnStates(results.states));
  }
  _invokeInitOnStates(mappedStores) {
    for (const mappedStore of mappedStores) {
      const instance = mappedStore.instance;
      if (instance.ngxsOnChanges) {
        this._store.select((state) => getValue(state, mappedStore.path)).pipe(startWith(void 0), pairwise(), takeUntil(this._destroy$)).subscribe(([previousValue, currentValue]) => {
          const change = new NgxsSimpleChange(previousValue, currentValue, !mappedStore.isInitialised);
          instance.ngxsOnChanges(change);
        });
      }
      if (instance.ngxsOnInit) {
        instance.ngxsOnInit(this._getStateContext(mappedStore));
      }
      mappedStore.isInitialised = true;
    }
  }
  _invokeBootstrapOnStates(mappedStores) {
    for (const mappedStore of mappedStores) {
      const instance = mappedStore.instance;
      if (instance.ngxsAfterBootstrap) {
        instance.ngxsAfterBootstrap(this._getStateContext(mappedStore));
      }
    }
  }
  _getStateContext(mappedStore) {
    return this._stateContextFactory.createStateContext(mappedStore);
  }
};
_LifecycleStateManager.ɵfac = function LifecycleStateManager_Factory(t) {
  return new (t || _LifecycleStateManager)(ɵɵinject(Store), ɵɵinject(InternalStateOperations), ɵɵinject(StateContextFactory), ɵɵinject(ɵNgxsAppBootstrappedState));
};
_LifecycleStateManager.ɵprov = ɵɵdefineInjectable({
  token: _LifecycleStateManager,
  factory: _LifecycleStateManager.ɵfac,
  providedIn: "root"
});
var LifecycleStateManager = _LifecycleStateManager;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LifecycleStateManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Store
  }, {
    type: InternalStateOperations
  }, {
    type: StateContextFactory
  }, {
    type: ɵNgxsAppBootstrappedState
  }], null);
})();
var NG_DEV_MODE3 = typeof ngDevMode !== "undefined" && ngDevMode;
function rootStoreInitializer() {
  const prebootFns = inject(NGXS_PREBOOT_FNS, {
    optional: true
  }) || [];
  prebootFns.forEach((prebootFn) => prebootFn());
  const factory = inject(StateFactory);
  const internalStateOperations = inject(InternalStateOperations);
  inject(Store);
  inject(SelectFactory);
  const states = inject(ROOT_STATE_TOKEN, {
    optional: true
  }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);
  const results = factory.addAndReturnDefaults(states);
  internalStateOperations.setStateToTheCurrentWithNew(results);
  factory.connectActionHandlers();
  lifecycleStateManager.ngxsBootstrap(new InitState(), results);
}
function featureStatesInitializer() {
  inject(Store);
  const internalStateOperations = inject(InternalStateOperations);
  const factory = inject(StateFactory);
  const states = inject(FEATURE_STATE_TOKEN, {
    optional: true
  }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);
  const flattenedStates = states.reduce((total, values) => total.concat(values), []);
  const results = factory.addAndReturnDefaults(flattenedStates);
  if (results.states.length) {
    internalStateOperations.setStateToTheCurrentWithNew(results);
    lifecycleStateManager.ngxsBootstrap(new UpdateState(results.defaults), results);
  }
}
var NGXS_ROOT_STORE_INITIALIZER = new InjectionToken(NG_DEV_MODE3 ? "NGXS_ROOT_STORE_INITIALIZER" : "");
var NGXS_FEATURE_STORE_INITIALIZER = new InjectionToken(NG_DEV_MODE3 ? "NGXS_FEATURE_STORE_INITIALIZER" : "");
var NGXS_ROOT_ENVIRONMENT_INITIALIZER = [{
  provide: NGXS_ROOT_STORE_INITIALIZER,
  useFactory: rootStoreInitializer
}, {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useFactory() {
    return () => inject(NGXS_ROOT_STORE_INITIALIZER);
  }
}];
var NGXS_FEATURE_ENVIRONMENT_INITIALIZER = [{
  provide: NGXS_FEATURE_STORE_INITIALIZER,
  useFactory: featureStatesInitializer
}, {
  provide: ENVIRONMENT_INITIALIZER,
  multi: true,
  useFactory() {
    return () => inject(NGXS_FEATURE_STORE_INITIALIZER);
  }
}];
var _NgxsRootModule = class _NgxsRootModule {
  constructor() {
    rootStoreInitializer();
  }
};
_NgxsRootModule.ɵfac = function NgxsRootModule_Factory(t) {
  return new (t || _NgxsRootModule)();
};
_NgxsRootModule.ɵmod = ɵɵdefineNgModule({
  type: _NgxsRootModule
});
_NgxsRootModule.ɵinj = ɵɵdefineInjector({});
var NgxsRootModule = _NgxsRootModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsRootModule, [{
    type: NgModule
  }], () => [], null);
})();
var _NgxsFeatureModule = class _NgxsFeatureModule {
  constructor() {
    featureStatesInitializer();
  }
};
_NgxsFeatureModule.ɵfac = function NgxsFeatureModule_Factory(t) {
  return new (t || _NgxsFeatureModule)();
};
_NgxsFeatureModule.ɵmod = ɵɵdefineNgModule({
  type: _NgxsFeatureModule
});
_NgxsFeatureModule.ɵinj = ɵɵdefineInjector({});
var NgxsFeatureModule = _NgxsFeatureModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsFeatureModule, [{
    type: NgModule
  }], () => [], null);
})();
function getRootProviders(states, options) {
  return [StateFactory, PluginManager, ...states, {
    provide: ROOT_STATE_TOKEN,
    useValue: states
  }, {
    provide: APP_BOOTSTRAP_LISTENER,
    useFactory: () => {
      const appBootstrappedState = inject(ɵNgxsAppBootstrappedState);
      return () => appBootstrappedState.bootstrap();
    },
    multi: true
  }, {
    provide: NGXS_OPTIONS,
    useValue: options
  }, {
    provide: CUSTOM_NGXS_EXECUTION_STRATEGY,
    useValue: options.executionStrategy
  }, {
    provide: ɵNGXS_STATE_CONTEXT_FACTORY,
    useExisting: StateContextFactory
  }, {
    provide: ɵNGXS_STATE_FACTORY,
    useExisting: StateFactory
  }];
}
function getFeatureProviders(states) {
  return [StateFactory, PluginManager, ...states, {
    provide: FEATURE_STATE_TOKEN,
    multi: true,
    useValue: states
  }];
}
var _NgxsModule = class _NgxsModule {
  static forRoot(states = [], options = {}) {
    return {
      ngModule: NgxsRootModule,
      providers: getRootProviders(states, options)
    };
  }
  static forFeature(states = []) {
    return {
      ngModule: NgxsFeatureModule,
      providers: getFeatureProviders(states)
    };
  }
};
_NgxsModule.ɵfac = function NgxsModule_Factory(t) {
  return new (t || _NgxsModule)();
};
_NgxsModule.ɵmod = ɵɵdefineNgModule({
  type: _NgxsModule
});
_NgxsModule.ɵinj = ɵɵdefineInjector({});
var NgxsModule = _NgxsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsModule, [{
    type: NgModule
  }], null, null);
})();
function Action(actions, options) {
  return (target, name, _descriptor) => {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      const isStaticMethod = target.hasOwnProperty("prototype");
      if (isStaticMethod) {
        throwActionDecoratorError();
      }
    }
    const meta = ɵensureStoreMetadata(target.constructor);
    const actionArray = Array.isArray(actions) ? actions : [actions];
    for (const action of actionArray) {
      const type = action.type;
      if (!meta.actions[type]) {
        meta.actions[type] = [];
      }
      meta.actions[type].push({
        fn: name,
        options: options || {},
        type
      });
    }
  };
}
function State(options) {
  return (target) => {
    const stateClass = target;
    const meta = ɵensureStoreMetadata(stateClass);
    const inheritedStateClass = Object.getPrototypeOf(stateClass);
    const optionsWithInheritance = getStateOptions(inheritedStateClass, options);
    mutateMetaData({
      meta,
      inheritedStateClass,
      optionsWithInheritance
    });
    stateClass[ɵMETA_OPTIONS_KEY] = optionsWithInheritance;
  };
}
function getStateOptions(inheritedStateClass, options) {
  const inheritanceOptions = inheritedStateClass[ɵMETA_OPTIONS_KEY] || {};
  return __spreadValues(__spreadValues({}, inheritanceOptions), options);
}
function mutateMetaData(params) {
  const {
    meta,
    inheritedStateClass,
    optionsWithInheritance
  } = params;
  const {
    children,
    defaults,
    name
  } = optionsWithInheritance;
  const stateName = typeof name === "string" ? name : name && name.getName() || null;
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureStateNameIsValid(stateName);
  }
  if (inheritedStateClass.hasOwnProperty(ɵMETA_KEY)) {
    const inheritedMeta = inheritedStateClass[ɵMETA_KEY] || {};
    meta.actions = __spreadValues(__spreadValues({}, meta.actions), inheritedMeta.actions);
  }
  meta.children = children;
  meta.defaults = defaults;
  meta.name = stateName;
}
var DOLLAR_CHAR_CODE = 36;
function createSelectObservable(selector) {
  if (!SelectFactory.store) {
    throwSelectFactoryNotConnectedError();
  }
  return SelectFactory.store.select(selector);
}
function createSelectorFn(name, rawSelector, paths = []) {
  rawSelector = !rawSelector ? removeDollarAtTheEnd(name) : rawSelector;
  if (typeof rawSelector === "string") {
    const propsArray = paths.length ? [rawSelector, ...paths] : rawSelector.split(".");
    return propGetter(propsArray, SelectFactory.config);
  }
  return rawSelector;
}
function removeDollarAtTheEnd(name) {
  const lastCharIndex = name.length - 1;
  const dollarAtTheEnd = name.charCodeAt(lastCharIndex) === DOLLAR_CHAR_CODE;
  return dollarAtTheEnd ? name.slice(0, lastCharIndex) : name;
}
function Select(rawSelector, ...paths) {
  return function(target, key) {
    const name = key.toString();
    const selectorId = `__${name}__selector`;
    const selector = createSelectorFn(name, rawSelector, paths);
    Object.defineProperties(target, {
      [selectorId]: {
        writable: true,
        enumerable: false,
        configurable: true
      },
      [name]: {
        enumerable: true,
        configurable: true,
        get() {
          return this[selectorId] || (this[selectorId] = createSelectObservable(selector));
        }
      }
    });
  };
}
var SELECTOR_OPTIONS_META_KEY = "NGXS_SELECTOR_OPTIONS_META";
var selectorOptionsMetaAccessor = {
  getOptions: (target) => {
    return target && target[SELECTOR_OPTIONS_META_KEY] || {};
  },
  defineOptions: (target, options) => {
    if (!target) return;
    target[SELECTOR_OPTIONS_META_KEY] = options;
  }
};
function setupSelectorMetadata(originalFn, creationMetadata) {
  const selectorMetaData = ɵensureSelectorMetadata(originalFn);
  selectorMetaData.originalFn = originalFn;
  let getExplicitSelectorOptions = () => ({});
  if (creationMetadata) {
    selectorMetaData.containerClass = creationMetadata.containerClass;
    selectorMetaData.selectorName = creationMetadata.selectorName || null;
    getExplicitSelectorOptions = creationMetadata.getSelectorOptions || getExplicitSelectorOptions;
  }
  const selectorMetaDataClone = __spreadValues({}, selectorMetaData);
  selectorMetaData.getSelectorOptions = () => getLocalSelectorOptions(selectorMetaDataClone, getExplicitSelectorOptions());
  return selectorMetaData;
}
function getLocalSelectorOptions(selectorMetaData, explicitOptions) {
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, selectorOptionsMetaAccessor.getOptions(selectorMetaData.containerClass) || {}), selectorOptionsMetaAccessor.getOptions(selectorMetaData.originalFn) || {}), selectorMetaData.getSelectorOptions() || {}), explicitOptions);
}
function SelectorOptions(options) {
  return function decorate(target, methodName, descriptor) {
    if (methodName) {
      descriptor ||= Object.getOwnPropertyDescriptor(target, methodName);
      const originalFn = descriptor.value || descriptor.originalFn;
      if (originalFn) {
        selectorOptionsMetaAccessor.defineOptions(originalFn, options);
      }
    } else {
      selectorOptionsMetaAccessor.defineOptions(target, options);
    }
  };
}
function createSelector(selectors, projector, creationMetadata) {
  const memoizedFn = createMemoizedSelectorFn(projector, creationMetadata);
  const selectorMetaData = setupSelectorMetadata(projector, creationMetadata);
  selectorMetaData.makeRootSelector = createRootSelectorFactory(selectorMetaData, selectors, memoizedFn);
  return memoizedFn;
}
function Selector(selectors) {
  return (target, key, descriptor) => {
    descriptor ||= Object.getOwnPropertyDescriptor(target, key);
    const originalFn = descriptor?.value;
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (originalFn && typeof originalFn !== "function") {
        throwSelectorDecoratorError();
      }
    }
    const memoizedFn = createSelector(selectors, originalFn, {
      containerClass: target,
      selectorName: key.toString(),
      getSelectorOptions() {
        return {};
      }
    });
    const newDescriptor = {
      configurable: true,
      get() {
        return memoizedFn;
      },
      originalFn
    };
    return newDescriptor;
  };
}
var _NgxsDevelopmentModule = class _NgxsDevelopmentModule {
  static forRoot(options) {
    return {
      ngModule: _NgxsDevelopmentModule,
      providers: [NgxsUnhandledActionsLogger, {
        provide: NGXS_DEVELOPMENT_OPTIONS,
        useValue: options
      }]
    };
  }
};
_NgxsDevelopmentModule.ɵfac = function NgxsDevelopmentModule_Factory(t) {
  return new (t || _NgxsDevelopmentModule)();
};
_NgxsDevelopmentModule.ɵmod = ɵɵdefineNgModule({
  type: _NgxsDevelopmentModule
});
_NgxsDevelopmentModule.ɵinj = ɵɵdefineInjector({});
var NgxsDevelopmentModule = _NgxsDevelopmentModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsDevelopmentModule, [{
    type: NgModule
  }], null, null);
})();
function withNgxsDevelopmentOptions(options) {
  return makeEnvironmentProviders([NgxsUnhandledActionsLogger, {
    provide: NGXS_DEVELOPMENT_OPTIONS,
    useValue: options
  }]);
}
function ensureValidSelector(selector, context = {}) {
  const noun = context.noun || "selector";
  const prefix = context.prefix ? context.prefix + ": " : "";
  ensureValueProvided(selector, {
    noun,
    prefix: context.prefix
  });
  const metadata = ɵgetSelectorMetadata(selector) || ɵgetStoreMetadata(selector);
  if (!metadata) {
    throw new Error(`${prefix}The value provided as the ${noun} is not a valid selector.`);
  }
}
function ensureValueProvided(value, context = {}) {
  const noun = context.noun || "value";
  const prefix = context.prefix ? context.prefix + ": " : "";
  if (!value) {
    throw new Error(`${prefix}A ${noun} must be provided.`);
  }
}
function createModelSelector(selectorMap) {
  const selectorKeys = Object.keys(selectorMap);
  const selectors = Object.values(selectorMap);
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelectorMap({
      prefix: "[createModelSelector]",
      selectorMap,
      selectorKeys,
      selectors
    });
  }
  return createSelector(selectors, (...args) => {
    return selectorKeys.reduce((obj, key, index) => {
      obj[key] = args[index];
      return obj;
    }, {});
  });
}
function ensureValidSelectorMap({
  prefix,
  selectorMap,
  selectorKeys,
  selectors
}) {
  ensureValueProvided(selectorMap, {
    prefix,
    noun: "selector map"
  });
  ensureValueProvided(typeof selectorMap === "object", {
    prefix,
    noun: "valid selector map"
  });
  ensureValueProvided(selectorKeys.length, {
    prefix,
    noun: "non-empty selector map"
  });
  selectors.forEach((selector, index) => ensureValidSelector(selector, {
    prefix,
    noun: `selector for the '${selectorKeys[index]}' property`
  }));
}
function createPickSelector(selector, keys) {
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelector(selector, {
      prefix: "[createPickSelector]"
    });
  }
  const validKeys = keys.filter(Boolean);
  const selectors = validKeys.map((key) => createSelector([selector], (s) => s[key]));
  return createSelector([...selectors], (...props) => {
    return validKeys.reduce((acc, key, index) => {
      acc[key] = props[index];
      return acc;
    }, {});
  });
}
function createPropertySelectors(parentSelector) {
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelector(parentSelector, {
      prefix: "[createPropertySelectors]",
      noun: "parent selector"
    });
  }
  const cache = {};
  return new Proxy({}, {
    get(_target, prop) {
      const selector = cache[prop] || createSelector([parentSelector], (s) => s?.[prop]);
      cache[prop] = selector;
      return selector;
    }
  });
}
function provideStore(states = [], ...optionsAndFeatures) {
  const features = [];
  let options = {};
  if (optionsAndFeatures.length > 0) {
    if (isEnvironmentProvider(optionsAndFeatures[0])) {
      features.push(...optionsAndFeatures);
    } else {
      options = optionsAndFeatures[0];
      features.push(...optionsAndFeatures.slice(1));
    }
  }
  return makeEnvironmentProviders([...getRootProviders(states, options), NGXS_ROOT_ENVIRONMENT_INITIALIZER, features]);
}
function isEnvironmentProvider(target) {
  return !!target.ɵproviders;
}
function provideStates(states, ...features) {
  return makeEnvironmentProviders([...getFeatureProviders(states), features, NGXS_FEATURE_ENVIRONMENT_INITIALIZER]);
}
function withNgxsPlugin(plugin) {
  return makeEnvironmentProviders([{
    provide: NGXS_PLUGINS,
    useClass: plugin,
    multi: true
  }]);
}
function select(selector) {
  return inject(Store).selectSignal(selector);
}
function dispatch(ActionType) {
  const store = inject(Store);
  return (...args) => store.dispatch(new ActionType(...args));
}
function createSelectMap(selectorMap) {
  const store = inject(Store);
  return Object.entries(selectorMap).reduce((accumulator, [key, selector]) => {
    Object.defineProperty(accumulator, key, {
      enumerable: true,
      value: store.selectSignal(selector)
    });
    return accumulator;
  }, {});
}
function createDispatchMap(actionMap) {
  return Object.entries(actionMap).reduce((accumulator, [key, ActionType]) => {
    Object.defineProperty(accumulator, key, {
      enumerable: true,
      value: dispatch(ActionType)
    });
    return accumulator;
  }, {});
}
export {
  Action,
  Actions,
  InitState,
  NGXS_PLUGINS,
  NgxsConfig,
  NgxsDevelopmentModule,
  NgxsModule,
  NgxsSimpleChange,
  NgxsUnhandledActionsLogger,
  NgxsUnhandledErrorHandler,
  NoopNgxsExecutionStrategy,
  Select,
  Selector,
  SelectorOptions,
  State,
  StateToken,
  Store,
  UpdateState,
  actionMatcher,
  createDispatchMap,
  createModelSelector,
  createPickSelector,
  createPropertySelectors,
  createSelectMap,
  createSelector,
  dispatch,
  getActionTypeFromInstance,
  getValue,
  ofAction,
  ofActionCanceled,
  ofActionCompleted,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  provideStates,
  provideStore,
  select,
  setValue,
  withNgxsDevelopmentOptions,
  withNgxsPlugin,
  withNgxsPreboot,
  NgxsFeatureModule as ɵNgxsFeatureModule,
  NgxsRootModule as ɵNgxsRootModule
};
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v18.1.1
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=@ngxs_store.js.map
