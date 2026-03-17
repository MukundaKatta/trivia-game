import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import PageWrapper from '../components/shared/PageWrapper';
import ConnectionBanner from '../components/shared/ConnectionBanner';
import Timer from '../components/game/Timer';
import QuestionCard from '../components/game/QuestionCard';
import OptionButton from '../components/game/OptionButton';
import ScoreBoard from '../components/game/ScoreBoard';
import StreakBanner from '../components/game/StreakBanner';
import PointsPopup from '../components/game/PointsPopup';

export default function Game() {
  const socket = useSocket();
  const navigate = useNavigate();
  const answerStartTime = useRef(Date.now());

  const room = useGameStore((s) => s.room);
  const playerId = useGameStore((s) => s.playerId);
  const countdown = useGameStore((s) => s.countdown);
  const question = useGameStore((s) => s.currentQuestion);
  const timeLeft = useGameStore((s) => s.timeLeft);
  const hasAnswered = useGameStore((s) => s.hasAnswered);
  const selectedAnswer = useGameStore((s) => s.selectedAnswer);
  const answeredCount = useGameStore((s) => s.answeredCount);
  const totalPlayers = useGameStore((s) => s.totalPlayers);
  const roundResult = useGameStore((s) => s.roundResult);
  const lastPointsGained = useGameStore((s) => s.lastPointsGained);
  const currentStreak = useGameStore((s) => s.currentStreak);

  useEffect(() => {
    if (!room) navigate('/');
  }, [room, navigate]);

  useEffect(() => {
    if (question) {
      answerStartTime.current = Date.now();
    }
  }, [question?.id]);

  if (!room) return null;

  function handleAnswer(index: number) {
    if (hasAnswered || !question) return;
    const timeMs = Date.now() - answerStartTime.current;
    useGameStore.getState().setAnswered(index);
    socket.emit('game:answer', {
      questionId: question.id,
      selectedIndex: index,
      timeMs,
    });
  }

  // Countdown screen
  if (countdown !== null) {
    return (
      <PageWrapper className="flex items-center justify-center">
        <ConnectionBanner />
        <div className="text-center">
          <motion.div
            key={countdown}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="text-8xl font-black text-primary-400"
          >
            {countdown > 0 ? countdown : 'GO!'}
          </motion.div>
          <p className="text-surface-200/60 mt-4">Get ready!</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <ConnectionBanner />

      <PointsPopup points={lastPointsGained} show={!!roundResult && lastPointsGained > 0} />

      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          {/* Timer */}
          {question && !roundResult && (
            <div className="mb-4">
              <Timer timeLeft={timeLeft} totalTime={question.timeLimit} />
            </div>
          )}

          {/* Answer progress */}
          {!roundResult && totalPlayers > 0 && (
            <div className="text-center text-sm text-surface-200/50 mb-4">
              {answeredCount} / {totalPlayers} answered
            </div>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            {question && (
              <motion.div key={question.id}>
                <QuestionCard question={question} />

                {/* Streak banner */}
                <StreakBanner streak={currentStreak} />

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option, i) => (
                    <OptionButton
                      key={i}
                      index={i}
                      text={option}
                      selected={selectedAnswer === i}
                      disabled={hasAnswered}
                      correctIndex={roundResult ? roundResult.correctIndex : null}
                      onClick={() => handleAnswer(i)}
                    />
                  ))}
                </div>

                {/* Round result info */}
                {roundResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    {(() => {
                      const myAnswer = roundResult.answers.find((a) => a.playerId === playerId);
                      if (!myAnswer) {
                        return <p className="text-surface-200/50">Time's up! You didn't answer.</p>;
                      }
                      return myAnswer.isCorrect ? (
                        <p className="text-green-400 font-bold text-lg">
                          Correct! +{myAnswer.points} points
                        </p>
                      ) : (
                        <p className="text-red-400 font-bold text-lg">
                          Wrong! The answer was: {question.options[roundResult.correctIndex]}
                        </p>
                      );
                    })()}
                    <p className="text-xs text-surface-200/40 mt-2">Next question coming up...</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="hidden md:block">
          {roundResult ? (
            <ScoreBoard leaderboard={roundResult.leaderboard} currentPlayerId={playerId} />
          ) : (
            <div className="card">
              <h3 className="text-sm font-semibold text-surface-200/60 uppercase tracking-wider mb-3">Players</h3>
              <div className="space-y-2">
                {room.players.map((p) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 text-sm ${p.id === playerId ? 'text-primary-400' : ''}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.username[0]}
                    </div>
                    <span className="flex-1 truncate">{p.username}</span>
                    <span className="font-bold tabular-nums">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
