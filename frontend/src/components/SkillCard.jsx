export default function SkillCard({
  title,
  icon: Icon,
  items,
  danger = false,
}) {
  return (
    <section className="dashboard-card skill-card">
      <div className="skill-heading">
        <h3>
          <Icon size={20} />
          {title}
        </h3>
      </div>
      <div className="skill-list">
        {items.map(({ name, value, icon: ItemIcon }) => (
          <div className="skill-row" key={name}>
            <span className={`skill-symbol ${danger ? "danger" : ""}`}>
              <ItemIcon size={17} />
            </span>
            <div>
              <p>
                <b>{name}</b>
                <strong className={danger ? "danger-text" : ""}>
                  {value}%
                </strong>
              </p>
              <div className="skill-progress">
                <i
                  className={danger ? "danger-fill" : ""}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
