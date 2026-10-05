import cn from "classnames";
import Byline from "./Byline";
import { NOTE_TEXT_CLASS } from "./sharedClasses";

// The Projects page's masthead: the name/location line, then the title at display
// size with its line of copy set beside it.
const PageMasthead = ({ heading, note, headingRef }) => (
  <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
    <Byline />

    <div className="mt-14 flex flex-col md:mt-[clamp(2.375rem,7vh,5.625rem)] md:flex-row md:items-end md:justify-between md:gap-8">
      <h1
        ref={headingRef}
        className="font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:shrink-0 md:text-[clamp(3.375rem,5.9vw,5.875rem)]"
      >
        <span className="sr-only">{heading}</span>
        <span aria-hidden="true" data-split>
          {heading}
        </span>
      </h1>

      <p className={cn("mt-7 max-w-[25rem] md:mt-0", NOTE_TEXT_CLASS)}>
        {note}
      </p>
    </div>
  </header>
);

export default PageMasthead;
