import React, { Suspense } from "react";
import './index.css';
import './style/index.scss';
import "./locales/i18n";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./router/router";
import NProgressHandler from "./components/custom/NProgress";
import LoadingOverlay from "./components/custom/loading";
import PrivateRoute from "./router/private";
const App = () => {
  const menuRoutes = routes.filter(
    (r) => r.layout && r.showInMenu
  );

  return (
    <Router>
      <NProgressHandler />
      <Routes>
        {routes.map((route, index) => {
          const Component = route.component;
          const Layout = route.layout as React.FC<any> | undefined;
          return (
            <Route
              key={`${route.path}-${index}`}
              path={route.path}
              element={
                route.private ? (
                  <PrivateRoute>
                    <Suspense fallback={<div><LoadingOverlay /></div>}>
                      {Layout ? (
                        <Layout menu={menuRoutes}>
                          <Component />
                        </Layout>
                      ) : (
                        <Component />
                      )}
                    </Suspense>
                  </PrivateRoute>
                ) : (
                  <Suspense fallback={<div><LoadingOverlay /></div>}>
                    {Layout ? (
                      <Layout menu={menuRoutes}>
                        <Component />
                      </Layout>
                    ) : (
                      <Component />
                    )}
                  </Suspense>
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
