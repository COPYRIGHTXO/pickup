/* PipelinePanel — kanban-style campaign management board */
import { pipelineColumns } from '../../data/siteData';

export default function PipelinePanel() {
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <div className="pipeline-row reveal">
        {pipelineColumns.map((col, i) => (
          <div className="pipeline-col" key={i}>
            <h5>{col.title} <span>{col.count}</span></h5>
            {col.cards.map((card, j) => (
              <div className="pcard" key={j}>
                <div className="pname">{card.name}</div>
                <div className="pmeta">{card.meta}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
