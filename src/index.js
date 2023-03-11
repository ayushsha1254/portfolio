import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// import { Suspense } from "react";
import Loader from "./Pages/Loader";
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log = function () {};
// const App = React.lazy(() => import("./App"));
root.render(
  <React.StrictMode>
    <div className="lg:block hidden">
      {/* <Suspense fallback={<Loader />}>/ */}

      <App />
      {/* </Suspense> */}
    </div>
    <div className="lg:hidden block">
      Mobile Website is under development...
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
