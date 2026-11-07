const PointList = ({ points }) => (
  <ul className="grid gap-3">
    {points.map((point) => (
      <li
        key={point}
        className="font-arial text-base leading-[1.55] text-pretty text-ink md:text-[1.125rem]"
      >
        {point}
      </li>
    ))}
  </ul>
);

export default PointList;
