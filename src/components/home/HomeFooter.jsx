import cn from "classnames";
import { COPYRIGHT } from "../Footer";
import {
  BYLINE_TEXT_CLASS,
  PAGE_GUTTER_CLASS,
} from "../layout/sharedClasses";

// The foot of the intro from md: the copyright and the way on, its line level with
// the labels on HomeBlocks through the same `block-foot`.
const HomeFooter = ({ setFooterRef, cue }) => (
  <footer
    ref={setFooterRef}
    className={cn(
      "hidden justify-between gap-6 md:col-start-1 md:row-start-2 md:flex md:items-end md:pb-block-foot",
      PAGE_GUTTER_CLASS,
    )}
  >
    <small className={BYLINE_TEXT_CLASS}>{COPYRIGHT}</small>

    {cue}
  </footer>
);

export default HomeFooter;
