<script lang="ts">
    import { slide } from 'svelte/transition';
    import {GameState, gameState, selectedExercises} from "./state";
    import exercises from "./exercises";

    let questions = exercises.filter(e => $selectedExercises.includes(e.id)).flatMap(exercise => exercise.questions)
    let currentIndex = 0;
    $: previousQuestion = currentIndex === 0 ? undefined : questions[currentIndex-1];
    $: currentQuestion = currentIndex < questions.length ? questions[currentIndex] : undefined;
    $: answers = currentQuestion?.translation.map(() => "")
    let answerChecks = [];
    let points = 0;
    let gameEnded = false;

    function handleEnter(event) {
        if (event.which === 13) {
            submitAnswer();
        }
    }

    function submitAnswer() {
        answerChecks = answers.map((answer, index) => currentQuestion.translation[index] === answer);
        if (answerChecks.every(check => check)) {
            passQuestion(true);
        }
    }
    function passQuestion(correctAnswers = false) {
        if (correctAnswers) {
            points = points + 1;
        }
        currentIndex = currentIndex + 1;
        answerChecks = [];
        if (currentIndex >= questions.length) {
            gameEnded = true;
        }
    }

    function startOver() {
        gameEnded = false;
        points = 0;
        currentIndex = 0;
    }

    function returnToMainMenu() {
        $gameState = GameState.ExerciseSelection;
    }
</script>

<div class="main-game">
    {#if previousQuestion}
        {#key previousQuestion}
            <div class="row previous-question" transition:slide|local="{{duration: 150}}">
                <div class="current-word">{previousQuestion.word}</div><div class="separator">-</div>{previousQuestion.translation.join(", ")}
            </div>
        {/key}
    {/if}
    {#if currentQuestion}
        {#key currentQuestion}
            <div class="row" class:active={true} transition:slide|local="{{duration: 150 }}" >
                <div class="current-word">{currentQuestion.word}</div><div class="separator">-</div>
                {#each currentQuestion.translation as translation, index (index)}
                    <input bind:value={answers[index]} class:incorrect={answerChecks[index] === false} type="text" on:keypress={handleEnter} />
                {/each}
                <div class="row-buttons">
                    <button class="submit-answer" on:click={submitAnswer}>Tarkista</button>
                    <button on:click={() => passQuestion()}>Ohita</button>
                </div>
            </div>
        {/key}
    {/if}
    {#if gameEnded}
        <div class="game-ended-description">Kierros päättyi, sait {points} / {questions.length} pistettä!</div>
        <button class="start-over" on:click={startOver}>Aloita alusta</button><button class="back-to-menu" on:click={returnToMainMenu}>Palaa päävalikkoon</button>
    {:else}
        <div>
            <button class="end-game" on:click={returnToMainMenu}>Palaa päävalikkoon</button>
        </div>
    {/if}
        <!--{answers?.[0]} - {answers?.[1]} - {answers?.[2]}-->
</div>

<style>
    .main-game {
        max-width: 800px;
        margin: auto;
    }

    .row {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
    }

    .row-buttons > button {
        margin: 0;
    }

    .previous-question {
        margin-bottom: 20px;
    }

    .current-word {
        margin: 0 0 10px;
        font-weight: bold;
    }

    .separator {
        display: none;
    }

    input {
        width: 200px;
        margin: 0 0 5px 0;
    }

    input.incorrect {
        border: 1px solid red;
    }

    button.submit-answer {
        margin-right: 3px;
    }

    .game-ended-description {
        margin: 10px;
    }

    button.start-over {
        margin-right: 10px;
    }

    button.end-game {
        margin-top: 40px;
    }

    @media (min-width: 800px) {
        .row {
            flex-direction: row;
        }
        .current-word {
            margin: 0;
        }
        .row-buttons {
            display: flex;
        }
        .separator {
            display: block;
            margin: 0 5px;
        }
        input {
            width: 200px;
            margin: 0 5px 0 0;
        }
    }
</style>