import pitta4 from "./exercises/pitta4";
import pitta5 from "./exercises/pitta5";
import testExercise from "./exercises/testExercise";

export interface Exercise {
  id: number;
  label: string;
  questions: {
    word: String;
    translation: {
      word: string;
      variety?: string;
    }[];
  }[];
}

const exercises: Exercise[] = [
  // testExercise,
  // pitta4,
  pitta5,
];

export default exercises;
