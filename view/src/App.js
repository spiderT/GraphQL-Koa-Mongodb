import React, { useState } from "react";
import { Switch } from "antd";

import Header from "./components/Header";
import Content from "./components/Content";
import "./App.css";
import { URL } from "./constants";

function App() {
  const [mode, setMode] = useState(true);

  function changeTheme(checked) {
    const dom = document.getElementById("theme");
    if (dom) {
      if (!checked) {
        dom.remove();
      }
    } else {
      const style = document.createElement("style");
      style.id = "theme";
      style.innerText =
        "html{background:black;filter:invert(1) hue-rotate(180deg);} iframe{filter:invert(1) hue-rotate(180deg);} ";
      if (checked) {
        document.body.append(style);
      }
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="setting">
        <Switch
          checkedChildren="普通模式"
          unCheckedChildren="graphql"
          defaultChecked
          onChange={(checked) => setMode(checked)}
        />
        <Switch
          checkedChildren="🌜"
          unCheckedChildren="🌞"
          onChange={changeTheme}
        />
      </div>
      {mode ? (
        <Content />
      ) : (
        <>
          <p>
            ps:由于GraphiQL组件依赖的react
            16版本（我想用17的新特性），所以就没用GraphiQL，直接嵌入iframe
          </p>
          <iframe src={URL} className="iframe-wrap" />
        </>
      )}
    </div>
  );
}

export default App;
