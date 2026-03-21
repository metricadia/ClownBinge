import { 
  useGetReactions, 
  useAddReaction,
  AddReactionRequestType
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function usePostReactions(postId: string) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetReactions(postId);
  
  const addReactionMutation = useAddReaction({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/reactions/${postId}`] });
      }
    }
  });

  const handleReact = (type: AddReactionRequestType) => {
    if (!postId) return;
    addReactionMutation.mutate({ data: { postId, type } });
  };

  return {
    reactions: data?.reactions || [],
    isLoading,
    addReaction: handleReact,
    isAdding: addReactionMutation.isPending
  };
}
