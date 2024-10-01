import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    // ref
    // .value
    // 1. 缓存
    const user = reactive({ age: 1 });
    const age = computed(() => user.age);
    expect(age.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({ foo: 1 });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);
    // lazy
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);
    //   // should not compute until needed
    value.foo = 2; // trigger -> effect -> 再次调用计算属性的get重新执行了
    // 使用了effect会导致执行两次，因为响应式变量被设置会自动执行一次
    // 采用effect的第二个参数scheduler，存在就执行他而不是fn
    expect(getter).toHaveBeenCalledTimes(1);
    //   // now it should compute

    // 由于scheduler存在，所以执行第二个函数
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    //   // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
