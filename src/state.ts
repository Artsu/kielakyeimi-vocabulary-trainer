import { writable } from 'svelte/store';

export enum GameState {
    ExerciseSelection,
    Game,
}

export const selectedExercises = writable([]);
export const gameState = writable(GameState.ExerciseSelection);