import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  //.vue
  // <template></template>
  // / render
  render() {
    // / ui
    return h(
      "div",
      { id: "root", class: ["red", "hard"] },
      // "hi, " + this.msg
      // "hi, min-vue"
      [
        // Array
        h("div", { class: "red" }, "hi"),
        h("p", { class: "blue" }, "mini vue"),
      ]
    );
  },
  setup: function () {
    // composition api
    return {
      msg: "mini-vue",
    };
  },
};
