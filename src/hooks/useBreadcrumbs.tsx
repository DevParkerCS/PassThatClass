import { matchPath, useLocation, useParams } from "react-router-dom";
import { routes } from "../components/Routes";

type Crumb = {
  label: string;
  to?: string;
};

export const useBreadcrumbs = (): Crumb[] => {
  const location = useLocation();
  const params = useParams();

  const matchedRoute = routes.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  );

  if (!matchedRoute) return [];

  const crumbs: Crumb[] = [];

  // You can either keep this manual Dashboard,
  // or rely on the route config's Dashboard crumb.
  if (location.pathname !== "/dashboard") {
    crumbs.push({ label: "Dashboard", to: "/dashboard" });
  } else {
    crumbs.push({ label: "Dashboard" });
  }

  matchedRoute.breadcrumbConfigs.forEach((cfg) => {
    if (!cfg.getBreadcrumbName) return;

    const p = params as Record<string, string>;
    const label = cfg.getBreadcrumbName(p);
    if (!label) return;

    const to = cfg.getBreadcrumbHref ? cfg.getBreadcrumbHref(p) : undefined;

    // avoid duplicating "Dashboard" if you also add it via config
    if (
      label === "Dashboard" &&
      crumbs[crumbs.length - 1]?.label === "Dashboard"
    ) {
      return;
    }

    crumbs.push({ label, to });
  });

  return crumbs;
};
