/* Marquee — infinite scrolling ticker strip */
import { marqueeItems } from '../data/siteData';

export default function Marquee() {
  const doubled = [...marqueeItems, ...marqueeItems]; // duplicate for seamless loop
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {doubled.map((text, i) => <span key={i}>{text}</span>)}
      </div>
    </div>
  );
}
