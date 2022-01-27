<script lang="ts">
    import { slide } from 'svelte/transition';
    import {GameState, gameState, selectedExercises} from "./state";
    import exercises from "./exercises";
    import {shuffleArray} from "./randomizer";

    let partialQuestions = exercises
        .filter(e => $selectedExercises.includes(e.id))
        .flatMap(exercise => exercise.questions);
    let questions = shuffleArray(partialQuestions.concat(partialQuestions.map(question => ({
        word: question.translation.map(t => t.word).join(", "),
        translation: [{word: question.word}],
    }))));

    let currentIndex = 0;
    $: previousQuestion = currentIndex === 0 ? undefined : questions[currentIndex-1];
    $: currentQuestion = currentIndex < questions.length ? questions[currentIndex] : undefined;
    let answers = currentQuestion?.translation.map(() => "") ?? []
    let answerChecks = [];
    let previousAnswerChecks = [];
    let points = 0;
    let gameEnded = false;

    function handleEnter(event) {
        if (event.charCode === 13) {
            submitAnswer();
        }
    }

    function wordComparison(word1 = "", word2 = "") {
        function normalize(word: string) {
            return word.toLowerCase().replace(/\?/g, "").trim()
        }
        return word2.split(",").some(w2 => normalize(word1) === normalize(w2))
    }

    function submitAnswer() {
        answerChecks = currentQuestion.translation
            .map((translation, index) => wordComparison(answers[index], translation.word));
        if (answerChecks.every(check => check)) {
            passQuestion(true);
        }
    }
    function passQuestion(correctAnswers = false) {
        if (correctAnswers) {
            points = points + 1;
        }
        currentIndex = currentIndex + 1;
        previousAnswerChecks = answerChecks;
        answerChecks = [];
        answers = [];
        if (currentIndex >= questions.length) {
            gameEnded = true;
        }
    }

    function startOver() {
        gameEnded = false;
        points = 0;
        currentIndex = 0;
        questions = shuffleArray(questions)
    }

    function returnToMainMenu() {
        $gameState = GameState.ExerciseSelection;
    }
</script>

<div class="main-game">
    {#if previousQuestion}
        {#key previousQuestion}
            <div class="row previous-question" transition:slide|local="{{duration: 150}}">
                <div class="current-word">{previousQuestion.word}</div><div class="separator">-</div>
                {#each previousQuestion.translation as translation, index (index)}
                    <span class="answer" class:correct={previousAnswerChecks[index]}>
                        {previousQuestion.translation[index].word}{index === previousQuestion.translation.length -1 ? "" : ","}&nbsp;
                    </span>
                {/each}
            </div>
        {/key}
    {/if}
    {#if currentQuestion}
        {#key currentQuestion}
            <div class="row" class:active={true} transition:slide|local="{{duration: 150 }}" >
                <div class="current-word">{currentQuestion.word}</div><div class="separator">-</div>
                {#each currentQuestion.translation as translation, index (index)}
                    <input bind:value={answers[index]}
                           placeholder={translation.variety}
                           class:incorrect={answerChecks[index] === false}
                           type="text" on:keypress={handleEnter}
                           autofocus="{index === 0}"
                    />
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

    .answer {
        color: #e73757;
    }

    .answer.correct {
        color: #64e737;
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