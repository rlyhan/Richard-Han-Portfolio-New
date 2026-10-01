import { TECH } from "../../data/work.data";
import { EYEBROW_LABEL_CLASS } from "../layout/sharedClasses";

const AboutTech = () => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-[1.875rem] lg:grid-cols-4">
    {TECH.map(({ id, heading, listItems }) => (
      <div key={id}>
        <h3 className={EYEBROW_LABEL_CLASS}>
          {heading}
        </h3>
        <ul className="mt-3 grid gap-1.5">
          {listItems.map((item) => (
            <li key={item} className="text-[0.84375rem] leading-[1.45]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default AboutTech;
