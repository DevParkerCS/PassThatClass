// Breadcrumb.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Breadcrumb.module.scss";
import { useBreadcrumbs } from "../../hooks/useBreadcrumbs"; // or inline from above

export const Breadcrumb = () => {
  const nav = useNavigate();
  const crumbs = useBreadcrumbs();

  if (crumbs.length === 0) return null;

  return (
    <span className={styles.breadcrumb}>
      {crumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <p
            className={`${styles.breadcrumbItem} ${
              crumb.to && index !== crumbs.length - 1
                ? styles.breadcrumbClickable
                : ""
            }`}
            onClick={() =>
              crumb.to && index !== crumbs.length - 1 && nav(crumb.to)
            }
          >
            {crumb.label}
          </p>
          {index < crumbs.length - 1 && (
            <p className={styles.breadcrumbItem}>{">"}</p>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};
