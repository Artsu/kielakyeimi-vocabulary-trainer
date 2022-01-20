<script lang="ts">
	import Game from "./Game.svelte";
	import ExerciseSelection from "./ExerciseSelection.svelte";
	import {GameState, gameState} from "./state";
</script>

<main>
	<h1>Kielâkyeimi sanasto</h1>

	{#if $gameState === GameState.ExerciseSelection}
		<ExerciseSelection />
	{:else}
		<Game />
	{/if}
</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>