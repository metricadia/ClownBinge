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

  const getCount = (type: string) => reactions?.find(r => r.type === type)?.count || 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((reaction) => (
        <button
          key={reaction.id}
          onClick={() => addReaction(reaction.id as AddReactionRequestType)}
          disabled={isAdding}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted active:bg-border transition-colors group disabled:opacity-50 border border-border"
        >
          <span className="text-base group-hover:scale-110 transition-transform origin-bottom leading-none">
            {reaction.emoji}
          </span>
          <span className="text-xs font-medium text-foreground/70">{reaction.label}</span>
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1 rounded">
            {isLoading ? "·" : getCount(reaction.id)}
          </span>
        </button>
      ))}
    </div>
  );
}
