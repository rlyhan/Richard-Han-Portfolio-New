import cn from "classnames";
import Byline from "./Byline";
import SplitLine from "../common/SplitLine";
import {
  NOTE_TEXT_CLASS,
  PAGE_GUTTER_CLASS,
  PAGE_TITLE_CLASS,
} from "./sharedClasses";

// The Projects page's masthead: the name/location line, then the title at display
// size with its line of copy set beside it.
const PageMasthead = ({ heading, note, headingRef }) => (
  <header
    className={cn(
      "flex flex-col bg-smoke pt-5 pb-10 md:pt-6 md:pb-12",
      PAGE_GUTTER_CLASS,
    )}
  >
    <Byline />

    <div className="mt-14 flex flex-col md:mt-[clamp(2.375rem,7vh,5.625rem)] md:flex-row md:items-end md:justify-between md:gap-8">
      <h1
        ref={headingRef}
        className={cn(PAGE_TITLE_CLASS, "md:shrink-0")}
      >
        <SplitLine text={heading} />
      </h1>

      <p className={cn("mt-7 max-w-[25rem] md:mt-0", NOTE_TEXT_CLASS)}>
        {note}
      </p>
    </div>
  </header>
);

export default PageMasthead;
