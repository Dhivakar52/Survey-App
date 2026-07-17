export default function ProgressBar({ current, total, ofLabel }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <>
      <div className="progress-meta">
        <span className="count">
          {String(current).padStart(2, '0')} {ofLabel} {String(total).padStart(2, '0')}
        </span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="stamp-trail" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {Array.from({ length: total }).map((_, i) => (
          <div className="stamp-trail__step" key={i}>
            <div
              className="fill"
              style={{ width: i < current ? '100%' : '0%' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
