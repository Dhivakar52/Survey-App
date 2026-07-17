/**
 * Shared "boarding pass" card shell. `stub` renders a perforated footer row
 * (used for submission IDs / codes); omit it for plain content cards.
 */
export default function SurveyCard({ children, stub }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card__body">{children}</div>
      {stub && (
        <>
          <div className="ticket-perforation" aria-hidden="true" />
          <div className="ticket-stub">{stub}</div>
        </>
      )}
    </div>
  );
}
