export default function FeedbackCard({ icon: Icon, title, children, tone }) {
  return (
    <article className={`feedback-card ${tone}`}>
      <h3>
        <Icon size={21} />
        {title}
      </h3>
      <p>{children}</p>
    </article>
  );
}
