import React, { Suspense } from "react";
import "./index.css";
import "./style/index.scss";
import "./locales/i18n";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./router/router";
import NProgressHandler from "./components/custom/NProgress";
import LoadingOverlay from "./components/custom/loading";
import PrivateRoute from "./router/private";

const App = () => {
  return (
    <Router>
      <NProgressHandler />
      <Routes>
        {routes.map((route, index) => {
          const Component = route.component;
          const Layout = route.layout as React.FC<any> | undefined;

          const element = (
            <Suspense fallback={<LoadingOverlay />}>
              {Layout ? (
                <Layout>
                  <Component />
                </Layout>
              ) : (
                <Component />
              )}
            </Suspense>
          );

          return (
            <Route
              key={`${route.path}-${index}`}
              path={route.path}
              element={
                route.private ? (
                  <PrivateRoute>{element}</PrivateRoute>
                ) : (
                  element
                )
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
};

export default App;
