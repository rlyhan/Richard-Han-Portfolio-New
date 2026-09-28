import Byline from "./Byline";

// The masthead the pages below the homepage open with: the name/location line, the
// page's title at display size, and a line of copy under it.
//
// About and Projects open identically, so this is one component rather than the same
// three elements written twice — the two mastheads can't drift a few pixels apart,
// and the display size is stated once.
//
// It carries the hero's gutter rather than the page frame's. Both pages that use it
// band to the viewport edge and so opt out of PageSection's frame — see AboutPage.
const PageMasthead = ({ heading, note }) => (
  <header className="flex flex-col px-[1.4rem] pt-5 pb-10 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:pt-6 md:pb-12">
    <Byline />

    <h1 className="mt-14 font-urbanist text-[clamp(3.125rem,12vw,4.25rem)] leading-[0.99] font-medium md:mt-[clamp(2.375rem,7vh,5.625rem)] md:text-[clamp(3.375rem,5.9vw,5.875rem)]">
      {heading}
    </h1>

    <p className="mt-7 max-w-[25rem] text-[0.8125rem] leading-[1.65] text-ash">
      {note}
    </p>
  </header>
);

export default PageMasthead;
