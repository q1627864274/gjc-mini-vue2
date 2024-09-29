import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effect", () => {
  // 1. effect -> 运行一次fn
  // 2. fn内部响应式变量被改变就运行fn
  it("happy path", () => {
    const user = reactive({
      age: 10,
    });
    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });
    expect(nextAge).toBe(11);
    // update
    user.age++;
    expect(nextAge).toBe(12);
  });
});
