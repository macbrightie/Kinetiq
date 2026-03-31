import { FitnessActivity } from "@/components/FitnessFigure";

export const EMOJI_TO_ACTIVITY: Record<string, FitnessActivity> = {
  "🚴": "cycling",
  "🏃": "running",
  "🚶": "walking",
  "🧘": "yoga",
  "🤸": "yoga", // Pilates
  "💪": "strength",
  "🏋️": "strength",
  "💥": "hiit",
  "🏊": "swimming",
  "💃": "dance",
  "⚽": "football",
  "💤": "rest",
  "—": "rest"
};

export function getActivityType(emoji: string): FitnessActivity {
  return EMOJI_TO_ACTIVITY[emoji] || "default";
}
