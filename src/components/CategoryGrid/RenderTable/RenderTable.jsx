import { Timer } from "../Timer/Timer";
import { Category } from "../Category/Category";
import style from "./RenderTable.module.css";

export function RenderTable ({ 
  showRoundIntro, specialLabel, selectedQuestion, roundIntroText, setSelectedQuestion, setSpecialLabel, isShowAnswer, isShowTimer, timer,
  isTimerPaused, handleShowAnswer, handleAnswer, isDisabledCloseBtn, categories, handleButtonClick, answeredQuestions, isButtonBlinking, activeRoundIndex
}) {
  if (showRoundIntro) 
    return (
      <RenderRoundIntro text={roundIntroText} />
    );
  else if (specialLabel) 
    return (
      <RenderSpecialLabel
          label={specialLabel} 
          setSelectedQuestion={setSelectedQuestion} 
          setSpecialLabel={setSpecialLabel}
        />
    );
  else if (selectedQuestion) 
    return (
      <RenderSelectedQuestion
        question={selectedQuestion.question}
        isShowAnswer={isShowAnswer}
        isShowTimer={isShowTimer}
        timer={timer}
        isTimerPaused={isTimerPaused}
        handleShowAnswer={handleShowAnswer}
        handleAnswer={handleAnswer}
        isDisabledCloseBtn={isDisabledCloseBtn}
      />
    );
  else 
    return (
      <RenderCategories
        categories={categories}
        handleButtonClick={handleButtonClick}
        answeredQuestions={answeredQuestions}
        isButtonBlinking={isButtonBlinking}
        activeRoundIndex={activeRoundIndex}
      />
    );
}

function RenderSelectedQuestion ({ question, isShowAnswer, isShowTimer, timer, isTimerPaused, handleShowAnswer, handleAnswer, isDisabledCloseBtn }) {
  return (
    <>
        {!isShowAnswer && isShowTimer && (
            <Timer timer={timer} isTimerPaused={isTimerPaused} />
        )}

        <div className={style.question}>
        {!isShowAnswer ? (
            <>
                <p>{question.text}</p>
                <button className={style.button} onClick={handleShowAnswer}>
                    Показать ответ
                </button>
            </>
        ) : (
            <>
                <p className={style.answerText}>{question.answer}</p>
                <button
                    className={style.button}
                    onClick={handleAnswer}
                    disabled={isDisabledCloseBtn}
                >
                    Закрыть вопрос
                </button>
            </>
        )}
        </div>
    </>
  );
};

function RenderRoundIntro ({ text }) {
  return (
    <div className={style.question}><p>{text}</p></div>
  );
};

function RenderSpecialLabel ({ label, setSelectedQuestion, setSpecialLabel }) {
  return (
    <div className={style.question}>
        <p className="">{label.label}</p>
        <button
            className={style.button}
            onClick={() => {
                setSelectedQuestion({ value: label.value, question: label.question });
                setSpecialLabel(null);
            }}
        >
            Показать вопрос
        </button>
    </div>
  );
};

function RenderCategories ({ categories, handleButtonClick, answeredQuestions, isButtonBlinking, activeRoundIndex }) {
  return (
    categories.map((category) => (
        <Category
            key={category.id}
            name={category.name}
            questions={category.questions}
            onClick={handleButtonClick}
            answeredQuestions={answeredQuestions}
            questionText={isButtonBlinking}
            roundIndex={activeRoundIndex}
        />
    ))
  );
}