<script lang="ts">
    import exercises from "./exercises";
    import {selectedExercises, GameState, gameState} from "./state";
</script>

<div class="exercise-selection">
    <div class="exercises">
        {#each exercises as exercise}
            <label><input type="checkbox" value={exercise.id} bind:group={$selectedExercises} /> {exercise.label}</label>
        {/each}
    </div>
    <div>
        <button on:click={() => $selectedExercises = exercises.map(e => e.id)}>Valitse kaikki</button>
        <button on:click={() => $selectedExercises = []}>Tyhjennä</button>
    </div>
    <div>
        <button on:click={() => $gameState = GameState.Game} disabled={$selectedExercises.length === 0}>Aloita harjoitus</button>
    </div>
</div>

<style>
    label {
        cursor: pointer;
    }

    .exercise-selection {
        max-width: 600px;
        margin: auto;

    }

    .exercises {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
</style>