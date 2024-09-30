import { extend } from "../shared";
let activeEffect;
let shouldTrack;
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    // 表示是stop后的状态
    if (!this.active) {
      return this._fn();
    }
    // 只有set的时候收集依赖
    shouldTrack = true;
    //  表示收集依赖
    activeEffect = this;
    const result = this._fn();
    // reset
    shouldTrack = false;
    return result;
  }
  stop() {
    // 避免stop频繁被调用
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  // 优化点：发现effect.deps为空了
  effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}
// 方便ref的track
export function trackEffects(dep) {
  // 不要重复添加deep
  if (dep.has(activeEffect)) return;
  // 使用全局变量activeEffect将_effect加入dep里面
  dep.add(activeEffect);
  // 存储所有的dep，方便stop的时候删除所有的
  activeEffect.deps.push(dep);
}
export function isTracking() {
  // 只是Reactive的get触发的track的activeEffect为null
  // 只有effect触发才有值所以if (!activeEffect) return;
  // 是否应该收集依赖针对，stop，a++的情况
  // 针对stop a++ 的情况是否收集依赖
  // 使用变量 shouldTrack
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffects(dep);
}

// 方便ref的trigger
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  // fn
  const _effect: any = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop;
  // 后面还有很多类型onStop的属性，使用extend方便继承
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
export function stop(runner) {
  runner.effect.stop();
}
