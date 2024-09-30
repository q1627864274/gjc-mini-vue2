import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
// 1 true "1"
// get set
// proxy -> object
// {} -> value get set
class RefImpl {
  private _value: any;
  // 只有一个key -> value
  public dep;
  private _rawValue: any;
  public _v_isRef = true;
  constructor(value) {
    // 传进来对象，保持原始类型，方便set的时候对象对比
    this._rawValue = value;
    this._value = convert(value);
    // value -> reactive
    this.dep = new Set();
  }
  // get value()是一个获取器（getter）方法
  // 调用这个获取器方法来获取    实例内部私有变量_value的值
  get value() {
    trackRefValue(this);
    return this._value;
  } 
  set value(newValue) { 
    // newValve -> this.value
    // value一定是要被改变两次不同
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      // 一定是先修改了value的
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  } 
}
// ref包裹的(传过来的value)是不是对象就用reactive 
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}
export function ref(value) {
  return new RefImpl(value);
}
// 防止直接.value获取报错与reactive的直接获取类似
function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function isRef(ref) {
  return !!ref._v_isRef;
}
export function unRef(ref) {
  // 看看是不是一个ref -> ref.value
  // ref
  return isRef(ref) ? ref.value : ref;
}


