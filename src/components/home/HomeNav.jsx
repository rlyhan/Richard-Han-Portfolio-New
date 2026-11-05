import cn from "classnames";
import { COPYRIGHT } from "../Footer";
import { INTRO_GUTTER_CLASS } from "./HomeIntro";

// The foot of the intro from md: the copyright and the way on, its line level with
// the labels on HomeBlocks, worked out from the same tokens.
const HomeNav = ({ setNavRef, cue }) => (
  <div
    ref={setNavRef}
    className={cn(
      "hidden justify-between gap-6 md:col-start-1 md:row-start-2 md:flex md:items-end md:pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)]",
      INTRO_GUTTER_CLASS,
    )}
  >
    <small className="font-arial text-[0.8125rem] leading-none text-ash">
      {COPYRIGHT}
    </small>

    {cue}
  </div>
);

export default HomeNav;
