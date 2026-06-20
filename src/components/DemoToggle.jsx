export default function DemoToggle() {
  const handleClick = () => {
    alert(
      'Demo Mode would populate sample campaigns, creators, fraud reports and AI insights instantly — wire this button to your seed-data function.'
    );
  };

  return (
    <button className="demo-toggle" onClick={handleClick}>
      <span className="pulse"></span>
      <span className="dtext">Demo Mode</span>
    </button>
  );
}
