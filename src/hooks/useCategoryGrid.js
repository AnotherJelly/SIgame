import { useState, useEffect, useMemo, useCallback } from "react";

import { useRoundIntro } from "./useRoundIntro";
import { settings } from "../utils/data";
import { RenderTable } from "../components/CategoryGrid/RenderTable/RenderTable";

export function useCategoryGrid({ playersData, rounds, onAwardPoints, onDeductPoints, resetAnswers }) {

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isButtonBlinking, setIsButtonBlinking] = useState(null);
  const [isQuestionSelected, setIsQuestionSelected] = useState(null);

  const [isShowAnswer, setIsShowAnswer] = useState(false);
  const [isShowTimer, setIsShowTimer] = useState(true);
  const [isDisabledCloseBtn, setIsDisabledCloseBtn] = useState(false);

  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [roundIntroText, setRoundIntroText] = useState('Раунд 1');
  const showRoundIntro = useRoundIntro(roundIntroText, settings.roundIntroPause);

  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [specialLabel, setSpecialLabel] = useState(null);

  const [bets, setBets] = useState({});

  const currentRoundQuestions = useMemo(
      () => rounds[activeRoundIndex]?.categories.flatMap(cat => cat.questions) || [],
      [rounds, activeRoundIndex]
  );

  const isEveryoneNull = useMemo(
      () => playersData.every(p => p.points <= 0),
      [playersData]
  );

  const categories = useMemo(
      () => rounds[activeRoundIndex]?.categories || [],
      [rounds, activeRoundIndex]
  );

  useEffect(() => {
      const allAnswered = currentRoundQuestions.every(q => answeredQuestions.includes(q.id));
  
      if (allAnswered && activeRoundIndex < rounds.length - 1) {
          nextRound();
      } else if (allAnswered && activeRoundIndex == rounds.length - 1) {
          setActiveRoundIndex(idx => idx + 1);
          setRoundIntroText(`Конец игры`);
      }
  }, [currentRoundQuestions, answeredQuestions, activeRoundIndex, rounds]);  

  const handleBetChange = useCallback((playerId, betValue) => {
      setBets(prev => {
          const max = playersData.find(p => p.id === playerId).points;
          if (betValue > max) return prev;
          return { ...prev, [playerId]: betValue };
      });
  }, [playersData]);

  const nextRound = useCallback(() => {
      setRoundIntroText(`Раунд ${activeRoundIndex + 2}`);
      setActiveRoundIndex(idx => idx + 1);
  }, [activeRoundIndex]);

  const handleAward = useCallback((playerId) => {
      if (!selectedQuestion) return;

      let value = selectedQuestion.value;
      if (selectedQuestion.question.questionType === 'bet') {
          const betValues = Object.values(bets);
          const maxBet = betValues.length > 0 ? Math.max(...betValues) : 0;
          value = maxBet > 0 ? maxBet : selectedQuestion.value;
          setBets({});
      }

      onAwardPoints(playerId, value);

      handleShowAnswer();
      setIsDisabledCloseBtn(true);
      setIsTimerPaused(false);
      setTimeout(() => {
          setIsDisabledCloseBtn(false);
          setIsShowAnswer(false);
          setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
          setSelectedQuestion(null);
      }, 5000);
  }, [selectedQuestion, bets]);

  const handleDeduct = useCallback((playerId) => {
      if (!selectedQuestion) return;

      const questionTypeBet = selectedQuestion.question.questionType === 'bet';
      const questionTypeCat = selectedQuestion.question.questionType === 'cat';

      let value = selectedQuestion.value;
      if (questionTypeBet) {
          const betValues = Object.values(bets);
          const maxBet = betValues.length > 0 ? Math.max(...betValues) : 0;
          value = maxBet > 0 ? maxBet : selectedQuestion.value;
          setBets({});
      }

      onDeductPoints(playerId, value);
      setIsTimerPaused(false);
      if (questionTypeBet || questionTypeCat) {
          handleShowAnswer();
          setIsDisabledCloseBtn(true);

          setTimeout(() => {
              setIsDisabledCloseBtn(false);
              setIsShowAnswer(false);
              setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
              setSelectedQuestion(null);
              resetAnswers();
          }, 5000);
      }
    }, [selectedQuestion, bets]);

  const handleButtonClick = useCallback((value, question) => {
      setIsButtonBlinking(question);
      setTimeout(() => {
          setIsButtonBlinking(null);
          setIsQuestionSelected(true);
          if (!answeredQuestions.includes(question.id)) {
              if (['cat', 'bet'].includes(question.questionType)) {
                  const label = question.questionType === 'cat' ? 'Кот в мешке' : 'Вопрос со ставкой';
                  setSpecialLabel({ label, value, question });
              } else {
                  setSelectedQuestion({ value, question });
                  setIsShowTimer(true);
              }
          }
      }, 2000);
  }, [answeredQuestions]);

  const handleAnswer = useCallback(() => {
      if (!selectedQuestion) return;
      setAnsweredQuestions(prev => [...prev, selectedQuestion.question.id]);
      setSelectedQuestion(null);
      resetAnswers();
      setIsShowAnswer(false);
      setIsTimerPaused(false);
  }, [selectedQuestion]);

  const handleShowAnswer = () => {
      setIsQuestionSelected(false);
      setIsShowAnswer(true);
  };

  const handleSpecialLabelStart = useCallback((playerId) => {
      if (specialLabel?.question.questionType === "cat" || specialLabel?.question.questionType === "bet" ) {
          setSelectedQuestion({ value: specialLabel.value, question: specialLabel.question });
          setSpecialLabel(null);
          setIsShowTimer(false);
          const updatedPlayers = playersData.map(player => ({
              ...player,
              hasAnswered: player.id !== playerId
          }));
          resetAnswers(updatedPlayers);
      }
  }, [specialLabel]);

  const renderTable = 
    <RenderTable
      showRoundIntro={showRoundIntro} 
      specialLabel={specialLabel} 
      selectedQuestion={selectedQuestion}
      roundIntroText={roundIntroText}
      setSelectedQuestion={setSelectedQuestion}
      setSpecialLabel={setSpecialLabel}
      isShowAnswer={isShowAnswer}
      isShowTimer={isShowTimer}
      timer={settings.timer}
      isTimerPaused={isTimerPaused}
      handleShowAnswer={handleShowAnswer}
      handleAnswer={handleAnswer}
      isDisabledCloseBtn={isDisabledCloseBtn}
      categories={categories}
      handleButtonClick={handleButtonClick}
      answeredQuestions={answeredQuestions}
      isButtonBlinking={isButtonBlinking}
      activeRoundIndex={activeRoundIndex}
    />;

  return {
    state: { isQuestionSelected, isShowAnswer, specialLabel, bets },
    setState: { setIsTimerPaused, },
    handlers: { handleAward, handleDeduct, handleSpecialLabelStart, handleBetChange },
    computed: { isEveryoneNull, renderTable },
  };
}