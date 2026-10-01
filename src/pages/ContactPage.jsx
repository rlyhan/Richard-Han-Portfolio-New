import cn from "classnames";
import PageSection from "../components/layout/PageSection";
import Byline from "../components/layout/Byline";
import NavMenu from "../components/layout/NavMenu";
import IconRenderer from "../components/icons/IconRenderer";
import { useNavItems } from "../hooks/useNavLinks";
import {
  CONTACT_CHANNELS,
  CONTACT_HEADING_LINES,
  CONTACT_NOTE,
} from "../data/contact.data";
import { HEADSHOT } from "../data/photos.data";

const GUTTER_CLASS = "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

const CHANNEL_CLASS =
  "flex w-full min-w-0 items-center justify-between gap-1 rounded-[2px] border px-[0.5625rem] py-4 font-urbanist text-[0.875rem] leading-none font-semibold transition-colors duration-200 focus-visible:outline-ink motion-reduce:transition-none md:gap-3 md:px-5 md:py-5 md:text-base";

// Applied to the first channel, not flagged in the data — the list is already
// ordered by what's worth trying, and a flag beside that order could disagree
// with it.
const CHANNEL_PRIMARY_CLASS =
  "border-well bg-well text-cream hover:border-ink hover:bg-ink";

const CHANNEL_SECONDARY_CLASS = "border-grid hover:border-ink hover:bg-shell";

// A channel that leaves the site, read off the href rather than flagged in the data.
const isExternal = (href) => href.startsWith("http");

// One screen, like the hero, so the nav bar below is drawn here rather than left to
// the pinned SiteNav — see `hasOwnNav` on this page's route record.
const ContactPage = () => {
  const navItems = useNavItems();

  return (
    <PageSection
      id="contact"
      contained={false}
      additionalClasses="grid h-svh grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-cream font-epilogue text-ink"
    >
      <div className="grid min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] md:grid-cols-[minmax(0,45%)_minmax(0,55%)] md:grid-rows-[4rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
        <div
          className={cn(
            "row-start-1 grid items-center border-b border-grid py-3 md:col-start-2 md:row-start-1 md:py-0",
            GUTTER_CLASS,
          )}
        >
          <Byline />
        </div>

        <div className="relative row-start-2 h-[50svh] min-h-0 w-full bg-well md:col-start-1 md:row-span-2 md:row-start-1 md:h-auto">
          <h1
            id="contact-heading"
            className={cn(
              "absolute inset-x-0 bottom-0 pb-5 font-urbanist text-[clamp(2.125rem,9vw,3rem)] leading-[0.98] font-semibold text-cream md:pb-7 md:text-[clamp(1.75rem,3.6vw,2.5rem)] lg:pb-9 lg:text-[clamp(2.5rem,4.2vw,3.75rem)]",
              GUTTER_CLASS,
            )}
          >
            {CONTACT_HEADING_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>

        <section
          aria-labelledby="contact-heading"
          className={cn(
            "row-start-3 flex min-h-0 flex-col justify-center py-5 md:col-start-2 md:row-start-2 md:justify-end md:pt-6 md:pb-7 lg:pb-9",
            GUTTER_CLASS,
          )}
        >
          <div className="flex items-center gap-4 md:gap-5">
            <img
              src={HEADSHOT.src}
              alt={HEADSHOT.alt}
              width={HEADSHOT.width}
              height={HEADSHOT.height}
              decoding="async"
              className="size-[3.25rem] shrink-0 rounded-full border border-grid object-cover md:size-16 lg:size-[4.5rem]"
            />

            <p className="max-w-[32rem] text-[0.8125rem] leading-[1.55] text-ash md:text-[1.0625rem] lg:text-[clamp(1.125rem,1.6vw,1.5rem)]">
              {CONTACT_NOTE}
            </p>
          </div>

          <ul
            aria-label="Ways to reach me"
            className="mt-7 flex items-center gap-2 md:mt-[clamp(1.75rem,4.5vh,3rem)] md:flex-wrap md:gap-2.5"
          >
            {CONTACT_CHANNELS.map(({ id, label, icon, href }, i) => (
              <li
                key={id}
                className="flex min-w-0 flex-1 md:min-w-[10.5rem] md:flex-none"
              >
                <a
                  href={href}
                  target={isExternal(href) ? "_blank" : undefined}
                  rel={isExternal(href) ? "noreferrer" : undefined}
                  className={cn(
                    CHANNEL_CLASS,
                    i === 0 ? CHANNEL_PRIMARY_CLASS : CHANNEL_SECONDARY_CLASS,
                  )}
                >
                  <IconRenderer
                    icon={icon}
                    className="size-4 shrink-0 md:size-5"
                  />
                  <span className="truncate">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <NavMenu items={navItems} />
    </PageSection>
  );
};

export default ContactPage;
