// src/routes.ts
import { JSX } from "react";

import { LandingPage } from "../Pages/LandingPage/LandingPage";
import { Dashboard } from "../Pages/Dashboard/Dashboard";
import { Authentication } from "../Pages/Authentication/Authentication";
import { NewQuiz } from "../Pages/NewQuiz/NewQuiz";
import { QuizContent } from "../Pages/Quiz/QuizContent";
import { ClassFolder } from "../Pages/ClassFolder/ClassFolder";
import { EmailVerified } from "../Pages/EmailVerified/EmailVerified";

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type RouteConfig = {
  path: string;
  /** Label for this breadcrumb segment. */
  getBreadcrumbName?: (params: Record<string, string>) => string;
  /** Optional href for this breadcrumb segment. */
  getBreadcrumbHref?: (params: Record<string, string>) => string | undefined;
  element?: () => JSX.Element;
  subroutes?: RouteConfig[];
};

/**
 * Nested tree describing your app routes + breadcrumb segments.
 * Child paths are relative ("new", ":quizName/:quizId") so we can join them with the parent.
 */
const routeTree: RouteConfig[] = [
  {
    path: "/",
    element: LandingPage,
    getBreadcrumbName: () => "Home",
    getBreadcrumbHref: () => "/", // optional
  },
  {
    path: "/login",
    element: Authentication,
    getBreadcrumbName: () => "Login",
    getBreadcrumbHref: () => "/login",
  },
  {
    path: "/email-confirmed",
    element: EmailVerified,
  },
  {
    path: "/dashboard",
    element: Dashboard,
    getBreadcrumbName: () => "Dashboard",
    getBreadcrumbHref: () => "/dashboard",
  },
  {
    path: "/class/:className/:classId",
    element: ClassFolder,
    getBreadcrumbName: ({ className }) => className,
    getBreadcrumbHref: ({ className, classId }) =>
      `/class/${encodeURIComponent(className)}/${classId}`,
  },
  {
    path: "/quiz/:className/:classId",
    // this is where we want the "Class 3" crumb when we're on a quiz route
    getBreadcrumbName: ({ className }) => className,
    // and clicking it should go to the class page, not /quiz/...
    getBreadcrumbHref: ({ className, classId }) =>
      `/class/${encodeURIComponent(className)}/${classId}`,
    subroutes: [
      {
        path: "new",
        element: NewQuiz,
        getBreadcrumbName: () => "New Quiz",
        // no href -> leaf crumb stays non-clickable
      },
      {
        path: ":quizName/:quizId",
        element: QuizContent,
        getBreadcrumbName: ({ quizName }) => quizName,
        // also non-clickable leaf
      },
    ],
  },
];

/**
 * Utility to join parent + child paths nicely.
 */
const joinPaths = (parent: string, child: string): string => {
  if (!parent) return child;
  if (!child) return parent;

  const base = parent.endsWith("/") ? parent.slice(0, -1) : parent;
  const next = child.startsWith("/") ? child.slice(1) : child;

  return `${base}/${next}`;
};

/**
 * This is the flattened route type you'll use in your app.
 * `breadcrumbConfigs` is the chain of route configs (from root to this route)
 * that define breadcrumb segments.
 */
export type FlattenedRoute = WithRequired<RouteConfig, "element"> & {
  breadcrumbConfigs: RouteConfig[];
};

/**
 * Recursively flatten the route tree into a list of concrete routes
 * with full paths and accumulated breadcrumb configs.
 */
const collectRoutes = (
  nodes: RouteConfig[],
  parentPath = "",
  parentBreadcrumbConfigs: RouteConfig[] = []
): FlattenedRoute[] => {
  const result: FlattenedRoute[] = [];

  nodes.forEach((node) => {
    const fullPath =
      !parentPath || node.path.startsWith("/")
        ? node.path
        : joinPaths(parentPath, node.path);

    // If this node has a getBreadcrumbName, it contributes a breadcrumb segment
    const breadcrumbConfigs = node.getBreadcrumbName
      ? [...parentBreadcrumbConfigs, node]
      : parentBreadcrumbConfigs;

    if (node.element) {
      result.push({
        ...node,
        element: node.element,
        path: fullPath,
        subroutes: undefined,
        breadcrumbConfigs,
      });
    }

    if (node.subroutes && node.subroutes.length > 0) {
      result.push(
        ...collectRoutes(node.subroutes, fullPath, breadcrumbConfigs)
      );
    }
  });

  return result;
};

export const routes: FlattenedRoute[] = collectRoutes(routeTree);
