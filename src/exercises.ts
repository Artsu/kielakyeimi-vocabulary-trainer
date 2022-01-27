import pitta4 from "./exercises/pitta4";

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

const exercises: Exercise[] = [pitta4];

export default exercises;
