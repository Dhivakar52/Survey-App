export default function ProgressBar({ current, total, ofLabel, onStepClick, questions = [], answers = {} }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  // Function to check if a question has been answered
  const isAnswered = (index) => {
    if (!questions || !questions[index]) return false;
    const question = questions[index];
    if (!question) return false;
    const answer = answers[question.id];
    return answer !== undefined && answer !== null && answer !== '';
  };

  const handleStepClick = (index) => {
    if (onStepClick) {
      onStepClick(index);
    }
  };

  return (
    <>
      <div className="progress-meta">
        <span className="count">
          {String(current).padStart(2, '0')} {ofLabel} {String(total).padStart(2, '0')}
        </span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="stamp-trail" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {Array.from({ length: total }).map((_, i) => {
          const stepNumber = i + 1;
          const isCurrentStep = i === current - 1;
          const isCompleted = i < current - 1;
          const answered = isAnswered(i);
          
          return (
            <div 
              className="stamp-trail__step" 
              key={i}
              onClick={() => handleStepClick(i)}
              style={{ 
                cursor: onStepClick ? 'pointer' : 'default',
                position: 'relative',
              }}
              title={`Question ${stepNumber}${answered ? ' (Answered)' : isCurrentStep ? ' (Current)' : ' (Not answered)'}`}
            >
              <div
                className="fill"
                style={{ 
                  width: i < current ? '100%' : '0%',
                  backgroundColor: isCompleted && answered ? '#4CAF50' : undefined,
                }}
              />
              {/* Optional: Show a small indicator on answered questions */}
              {answered && isCompleted && (
                <span style={{
                  position: 'absolute',
                  right: '-3px',
                  top: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  border: '2px solid white',
                  zIndex: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}