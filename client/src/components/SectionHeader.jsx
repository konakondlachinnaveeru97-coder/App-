export default function SectionHeader({ title, subtitle, align = 'center' }) {
  return (
    <div className={`section-header align-${align}`}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
