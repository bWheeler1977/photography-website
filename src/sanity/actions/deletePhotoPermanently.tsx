import { TrashIcon } from "@sanity/icons";
import { useClient } from "sanity";
import type { DocumentActionComponent } from "sanity";

import { apiVersion } from "@/sanity/env";

function getPublishedId(documentId: string): string {
  return documentId.replace(/^drafts\./, "");
}

export const DeletePhotoPermanentlyAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion });
  const { id, type, draft, published, onComplete } = props;

  if (type !== "photo") {
    return null;
  }

  return {
    label: "Delete permanently",
    tone: "critical",
    icon: TrashIcon,
    onHandle: async () => {
      const confirmed = window.confirm(
        "Delete this photo permanently? The document and its uploaded image file will be removed from Sanity and will no longer appear on the website.",
      );

      if (!confirmed) {
        return;
      }

      const document = (draft ?? published) as
        | { image?: { asset?: { _ref?: string } } }
        | undefined;
      const assetRef = document?.image?.asset?._ref;
      const publishedId = getPublishedId(id);

      await Promise.all([
        client.delete(publishedId).catch(() => undefined),
        client.delete(`drafts.${publishedId}`).catch(() => undefined),
      ]);

      if (assetRef) {
        const referenceCount = await client.fetch<number>(
          `count(*[references($assetId)])`,
          { assetId: assetRef },
        );

        if (referenceCount === 0) {
          await client.delete(assetRef).catch(() => undefined);
        }
      }

      onComplete();
    },
  };
};
