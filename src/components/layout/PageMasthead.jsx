import cn from "classnames";
import Byline from "./Byline";
import { NOTE_TEXT_CLASS } from "./sharedClasses";

// The masthead the pages below the homepage open with: the name/location line, then
// the page's title at display size with its line of copy set beside it.
//
// About and Projects open identically, so this is one component rather than the same
// three elements written twice — the two mastheads can't drift a few pixels apart,
// and the display size is stated once.
const PageMasthead = ({ heading, note }) => (
  <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
    <Byline />

    <div className="mt-14 flex flex-col md:mt-[clamp(2.375rem,7vh,5.625rem)] md:flex-row md:items-end md:justify-between md:gap-8">
      <h1 className="font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:shrink-0 md:text-[clamp(3.375rem,5.9vw,5.875rem)]">
        {heading}
      </h1>

      <p className={cn("mt-7 max-w-[25rem] md:mt-0", NOTE_TEXT_CLASS)}>
        {note}
      </p>
    </div>
  </header>
);

export default PageMasthead;
