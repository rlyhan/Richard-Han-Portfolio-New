import PageSection from "../components/layout/PageSection";
import Byline from "../components/layout/Byline";
import NavMenu from "../components/layout/NavMenu";
import IconRenderer from "../components/icons/IconRenderer";
import { useNavItems } from "../hooks/useNavLinks";
import {
  CONTACT_CHANNELS,
  CONTACT_HEADING_LINES,
  CONTACT_NOTE,
  CONTACT_PORTRAIT,
} from "../data/contact.data";

const GUTTER_CLASS = "px-[1.4rem] md:px-[clamp(1.75rem,3.2vw,3.5rem)]";

const CHANNEL_CLASS =
  "flex w-full min-w-0 items-center justify-between gap-1 rounded-[2px] border border-grid px-[0.5625rem] py-3 font-urbanist text-[0.8125rem] leading-none font-semibold transition-colors duration-200 hover:border-ink hover:bg-shell focus-visible:outline-ink motion-reduce:transition-none md:gap-3 md:px-4 md:py-4 md:text-base";

const isExternal = (href) => href.startsWith("http");

const ContactTemplate = () => {
  const navItems = useNavItems();

  return (
    <PageSection
      id="contact"
      contained={false}
      additionalClasses="grid h-svh grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-cream font-epilogue text-ink"
    >
      <div className="grid min-h-0 grid-rows-[minmax(0,50%)_minmax(0,50%)] md:grid-cols-[minmax(0,45%)_minmax(0,55%)] md:grid-rows-none lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
        <figure className="relative min-h-0 w-full overflow-hidden bg-shell">
          <img
            src={CONTACT_PORTRAIT.src}
            alt={CONTACT_PORTRAIT.alt}
            width={CONTACT_PORTRAIT.width}
            height={CONTACT_PORTRAIT.height}
            fetchPriority="high"
            decoding="async"
            className="absolute top-0 left-[46%] h-full w-auto max-w-none min-w-full -translate-x-1/2 object-cover md:left-1/2"
          />
        </figure>

        <div className="grid min-h-0 min-w-0 grid-rows-[2.5rem_minmax(0,1fr)] md:grid-rows-[4rem_minmax(0,1fr)]">
          <div
            className={`grid items-center border-b border-grid ${GUTTER_CLASS}`}
          >
            <Byline />
          </div>

          <section
            aria-labelledby="contact-heading"
            className={`flex min-h-0 flex-col justify-center py-4 md:py-[clamp(1.5rem,4vh,3.5rem)] ${GUTTER_CLASS}`}
          >
            <h1
              id="contact-heading"
              className="max-w-[43.75rem] font-urbanist text-[clamp(2.25rem,8vw,3.25rem)] leading-[0.95] font-semibold md:text-[clamp(2.25rem,4.8vw,3.125rem)] lg:text-[clamp(3.125rem,5.3vw,4.875rem)]"
            >
              {CONTACT_HEADING_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mt-3.5 max-w-[33.125rem] text-[0.875rem] leading-[1.42] text-ash md:mt-[clamp(1.5rem,3vh,2.375rem)] md:text-[0.9375rem] md:leading-[1.55] lg:text-[clamp(1rem,1.4vw,1.1875rem)]">
              {CONTACT_NOTE}
            </p>

            <ul
              aria-label="Ways to reach me"
              className="mt-[1.125rem] flex items-center gap-2 md:mt-[clamp(2rem,5vh,3.5rem)] md:flex-wrap md:gap-2.5"
            >
              {CONTACT_CHANNELS.map(({ id, label, icon, href }) => (
                <li
                  key={id}
                  className="flex min-w-0 flex-1 md:min-w-[9.375rem] md:flex-none"
                >
                  <a
                    href={href}
                    target={isExternal(href) ? "_blank" : undefined}
                    rel={isExternal(href) ? "noreferrer" : undefined}
                    className={CHANNEL_CLASS}
                  >
                    <IconRenderer
                      icon={icon}
                      className="size-4 shrink-0 md:size-[1.1875rem]"
                    />
                    <span className="truncate">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <NavMenu items={navItems} />
    </PageSection>
  );
};

export default ContactTemplate;
