import { HomeIcon } from "@sanity/icons";
import type { DocumentBadgeComponent } from "sanity";

export const featuredPhotoBadge: DocumentBadgeComponent = (props) => {
  const document = props.published ?? props.draft;

  if (!document || (document as { featured?: boolean }).featured !== true) {
    return null;
  }

  return {
    icon: HomeIcon,
    label: "Featured",
    title: "Featured on homepage",
    color: "primary",
  };
};
