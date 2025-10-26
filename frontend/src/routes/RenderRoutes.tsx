// src/admin/routes/renderRoutes.tsx
import { Route } from "react-router-dom";
import { RouteType } from "./admin-routes/config";

export const renderRoutes = (routes: RouteType[]) =>
  routes.map((route, index) => {
    if (route.child && route.child.length > 0) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.child)}
        </Route>
      );
    }

    return (
      <Route
        key={index}
        index={route.index}
        path={route.path}
        element={route.element}
      />
    );
  });
