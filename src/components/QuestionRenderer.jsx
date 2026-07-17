import { useSurveyContext } from '../context/SurveyContext';

const STARS = [1, 2, 3, 4, 5];
const EMOJIS = ['😞', '😕', '😐', '🙂', '😍'];

export default function QuestionRenderer({ question, value, error, onChange }) {
  const { t, language } = useSurveyContext();

  // Get localized text for yes/no
  const getLocalizedYesNo = (option) => {
    if (option === 'yes') {
      if (language === 'ta') return 'ஆம்';
      if (language === 'hi') return 'हाँ';
      return 'Yes';
    }
    if (option === 'no') {
      if (language === 'ta') return 'இல்லை';
      if (language === 'hi') return 'नहीं';
      return 'No';
    }
    return option;
  };

  return (
    <div>
      <div className="q-label">
        {question.question}
        {question.required && <span className="q-required">*</span>}
      </div>

      <div className="mt-3">
        {renderControl(question, value, onChange, t, language, getLocalizedYesNo)}
      </div>

      {error && (
        <div className="q-error" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </div>
      )}
    </div>
  );
}

function renderControl(question, value, onChange, t, language, getLocalizedYesNo) {
  switch (question.type) {
    case 'radio':
      return (
        <div role="radiogroup" aria-label={question.question}>
          {question.options.map((opt) => (
            <label
              key={opt}
              className={`option-pill ${value === opt ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={value === opt}
                onChange={() => onChange(opt)}
                style={{ accentColor: 'var(--primary)' }}
              />
              {opt}
            </label>
          ))}
        </div>
      );

    case 'checkbox': {
      const selected = Array.isArray(value) ? value : [];
      return (
        <div role="group" aria-label={question.question}>
          {question.options.map((opt) => {
            const isChecked = selected.includes(opt);
            return (
              <label
                key={opt}
                className={`option-pill ${isChecked ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const next = isChecked
                      ? selected.filter((v) => v !== opt)
                      : [...selected, opt];
                    onChange(next);
                  }}
                  style={{ accentColor: 'var(--primary)' }}
                />
                {opt}
              </label>
            );
          })}
        </div>
      );
    }

    case 'dropdown':
      return (
        <select
          className="form-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            {t.question.chooseOne}
          </option>
          {question.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );

    case 'rating':
      return (
        <div className="star-rating" role="radiogroup" aria-label={question.question}>
          {STARS.map((star) => (
            <button
              type="button"
              key={star}
              className={star <= (value || 0) ? 'active' : ''}
              aria-label={`${star} star`}
              aria-pressed={star <= (value || 0)}
              onClick={() => onChange(star)}
            >
              {star <= (value || 0) ? '★' : '☆'}
            </button>
          ))}
        </div>
      );

    case 'emoji':
      return (
        <div className="emoji-rating" role="radiogroup" aria-label={question.question}>
          {EMOJIS.map((emoji, idx) => (
            <button
              type="button"
              key={emoji}
              className={value === idx + 1 ? 'active' : ''}
              aria-label={`rating ${idx + 1}`}
              aria-pressed={value === idx + 1}
              onClick={() => onChange(idx + 1)}
            >
              {emoji}
            </button>
          ))}
        </div>
      );

    case 'yesno':
      return (
        <div className="d-flex gap-2">
          {['yes', 'no'].map((opt) => {
            const displayText = getLocalizedYesNo(opt);
            return (
              <button
                type="button"
                key={opt}
                className={`btn-survey ${value === opt ? 'btn-survey-primary' : 'btn-survey-ghost'}`}
                style={{ flex: 1, textTransform: 'capitalize' }}
                aria-pressed={value === opt}
                onClick={() => onChange(opt)}
              >
                {displayText}
              </button>
            );
          })}
        </div>
      );

    case 'text':
      return (
        <input
          type="text"
          className="form-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'textarea':
      return (
        <textarea
          className="form-field"
          rows={4}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          className="form-field"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          className="form-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'file':
      return (
        <div>
          <label className="btn-survey btn-survey-ghost d-inline-block" style={{ cursor: 'pointer' }}>
            {t.question.uploadFile}
            <input
              type="file"
              hidden
              onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
            />
          </label>
          <div className="mt-2" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            {value || t.question.noFile}
          </div>
        </div>
      );

    default:
      return null;
  }
}