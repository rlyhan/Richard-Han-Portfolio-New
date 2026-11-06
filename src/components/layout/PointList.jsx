const PointList = ({ points }) => (
  <ul className="grid gap-2.5">
    {points.map((point) => (
      <li
        key={point}
        className="relative pl-[1.125rem] font-arial text-[0.84375rem] leading-[1.6] font-medium text-pretty text-ink before:absolute before:top-[0.65em] before:left-0.5 before:size-1 before:rounded-full before:bg-ash before:content-['']"
      >
        {point}
      </li>
    ))}
  </ul>
);

export default PointList;
