const PointList = ({ points }) => (
  <ul className="grid gap-2.5">
    {points.map((point) => (
      <li
        key={point}
        className="relative pl-[1.125rem] text-[0.84375rem] leading-[1.6] before:absolute before:top-[0.68em] before:left-0 before:h-px before:w-2 before:bg-ash before:content-['']"
      >
        {point}
      </li>
    ))}
  </ul>
);

export default PointList;
