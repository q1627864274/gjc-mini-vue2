import { h } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  //.vue
  // <template></template>
  // / render
  render() {
    // / ui
    return h("div", "hi, " + this.msg);
  },
  setup: function () {
    // composition api
    return {
      msg: "mini-vue",
    };
  },
};
