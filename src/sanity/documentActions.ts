import type { DocumentActionsResolver } from "sanity";

import { DeleteGalleryCategoryAction } from "@/sanity/actions/deleteGalleryCategory";
import { DeletePhotoPermanentlyAction } from "@/sanity/actions/deletePhotoPermanently";

export const documentActions: DocumentActionsResolver = (previousActions, context) => {
  if (context.schemaType === "photo") {
    return [
      ...previousActions.filter((action) => action.action !== "delete"),
      DeletePhotoPermanentlyAction,
    ];
  }

  if (context.schemaType === "galleryCategory") {
    return [
      ...previousActions.filter((action) => action.action !== "delete"),
      DeleteGalleryCategoryAction,
    ];
  }

  return previousActions;
};
