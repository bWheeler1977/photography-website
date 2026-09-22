import type { DefaultDocumentNodeResolver } from "sanity/structure";

/** Keeps document editors on the same structure path as the list that opened them. */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType, documentId },
) => {
  const editor = S.document().schemaType(schemaType);

  return documentId ? editor.documentId(documentId) : editor;
};
