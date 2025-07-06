export interface Interval {
  name: string;
  semitones: number;
}

export interface Feedback {
  severity: "success" | "error";
  text: string;
}

export interface IntervalExerciseProps {
  onBack: () => void;
}