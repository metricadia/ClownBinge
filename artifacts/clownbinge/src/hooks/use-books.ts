import { useListBooks } from "@workspace/api-client-react";

export function useStoreBooks() {
  return useListBooks();
}
