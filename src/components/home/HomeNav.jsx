import cn from "classnames";
import { useNavItems } from "../../hooks/useNavLinks";
import { INTRO_GUTTER_CLASS } from "./HomeIntro";

// Its own block rather than the intro's foot, so below md it can follow the work
// panel to the bottom of the screen. From md it sits under the intro, its last line
// on a baseline with the card plates' last line, worked out from the same tokens.
const HomeNav = ({ setNavRef, cue }) => {
  const navItems = useNavItems();

  return (
    <nav
      ref={setNavRef}
      aria-label="Portfolio sections"
      className={cn(
        "flex items-center justify-between gap-6 bg-ink/15 py-3 md:col-start-1 md:items-end md:row-start-2 md:bg-transparent md:pt-0 md:pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+2px)]",
        INTRO_GUTTER_CLASS,
      )}
    >
      <ul className="flex gap-8 md:gap-12">
        {navItems.map(({ id, label, link }) => (
          <li key={id}>
            <a
              {...link}
              className="flex min-h-12 items-center font-epilogue text-[0.75rem] leading-none font-medium tracking-[0.06em] text-ink uppercase transition-colors hover:text-ash focus-visible:outline-ink md:min-h-0 md:text-[0.8125rem] md:tracking-[0.08em]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {cue}
    </nav>
  );
};

export default HomeNav;
