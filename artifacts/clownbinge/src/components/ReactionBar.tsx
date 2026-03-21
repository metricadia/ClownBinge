import { usePostReactions } from "@/hooks/use-reactions";
import { AddReactionRequestType } from "@workspace/api-client-react";

const STANDARD_REACTIONS = [
  { id: "clowned", emoji: "🤡", label: "Clowned" },
  { id: "side_eye", emoji: "👀", label: "Side Eye" },
  { id: "receipts", emoji: "🔥", label: "Receipts" },
  { id: "dead", emoji: "💀", label: "Dead" },
  { id: "self_owned", emoji: "🫵", label: "Self-Owned" },
] as const;

const HERO_REACTIONS = [
  { id: "thats_right", emoji: "✊", label: "That's Right" },
  { id: "receipts", emoji: "🔥", label: "Receipts" },
  { id: "king_queen", emoji: "👑", label: "King/Queen" },
  { id: "finished_them", emoji: "💀", label: "Finished Them" },
  { id: "nailed_it", emoji: "🎯", label: "Nailed It" },
] as const;

export function ReactionBar({ postId, isHero = false }: { postId: string, isHero?: boolean }) {
  const { reactions, isLoading, addReaction, isAdding } = usePostReactions(postId);
  
  const options = isHero ? HERO_REACTIONS : STANDARD_REACTIONS;

  const getCount = (type: string) => {
    return reactions?.find(r => r.type === type)?.count || 0;
  };

  return (
    <div className="border-y border-border py-6 my-8">
      <h3 className="text-center font-display font-bold text-sm tracking-widest text-muted-foreground uppercase mb-6">
        How you feeling about this one?
      </h3>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {options.map((reaction) => (
          <button
            key={reaction.id}
            onClick={() => addReaction(reaction.id as AddReactionRequestType)}
            disabled={isAdding}
            className="flex flex-col items-center gap-1 p-2 sm:px-4 sm:py-3 rounded-xl hover:bg-muted active:bg-border transition-colors group disabled:opacity-50"
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform origin-bottom">
              {reaction.emoji}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="font-semibold text-foreground">{reaction.label}</span>
              <span className="font-mono text-muted-foreground bg-muted group-hover:bg-background px-1.5 rounded text-[10px]">
                {isLoading ? "..." : getCount(reaction.id)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
