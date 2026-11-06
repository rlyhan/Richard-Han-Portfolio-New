import ProjectTicker from "./ProjectTicker";

const TickerGround = () => (
  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate">
    <ProjectTicker />
    <div className="absolute inset-0 bg-slate/70" />
  </div>
);

export default TickerGround;
