/**
 * SectionHeader — reusable heading block used by most sections.
 * Shows a tag, title (h2), and optional description.
 */
export default function SectionHeader({ tag, title, desc }) {
  return (
    <div className="section-head reveal comic-outline">
      <div>
        <span className="num-tag comic-text">{tag}</span>
        <h2
          className="comic-text"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      {desc && <p>{desc}</p>}
    </div>
  );
}
