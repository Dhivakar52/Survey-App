export function Spinner({ label }) {
  return (
    <div className="d-flex flex-column align-items-center gap-3 py-5">
      <div className="spinner-ring" role="status" aria-label={label || 'Loading'} />
      {label && <div style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{label}</div>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="ticket-card">
      <div className="ticket-card__body">
        <div className="skeleton mb-3" style={{ height: 14, width: '40%' }} />
        <div className="skeleton mb-2" style={{ height: 22, width: '85%' }} />
        <div className="skeleton mb-4" style={{ height: 14, width: '60%' }} />
        <div className="skeleton mb-2" style={{ height: 44, width: '100%', borderRadius: 14 }} />
        <div className="skeleton mb-2" style={{ height: 44, width: '100%', borderRadius: 14 }} />
        <div className="skeleton" style={{ height: 44, width: '100%', borderRadius: 14 }} />
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry, retryLabel }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card__body text-center">
        <div className="stamp-seal neutral" style={{ color: 'var(--danger)' }}>
          <span style={{ fontSize: '2rem' }} aria-hidden="true">!</span>
        </div>
        <p style={{ color: 'var(--ink-soft)' }}>{message}</p>
        {onRetry && (
          <button className="btn-survey btn-survey-primary" onClick={onRetry}>
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
