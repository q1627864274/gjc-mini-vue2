import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
export const enum ReactiveFlags {
  IS_REACTIVE = "_isReactive",
  IS_READONLY = "_isReadonly",
}
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
export function isReactive(value) {
  // 通过触发reactive的get操作，获得readonly的值来判断是什么get
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
