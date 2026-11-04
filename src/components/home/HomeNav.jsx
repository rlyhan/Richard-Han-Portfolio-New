import cn from "classnames";
import { COPYRIGHT } from "../Footer";
import { useNavItems } from "../../hooks/useNavLinks";
import { INTRO_GUTTER_CLASS } from "./HomeIntro";

// Its own block rather than the intro's foot, so below md it can carry the site's
// links under the work panel at the bottom of the screen. From md HomeBlocks carries
// them, so this sits under the intro with the copyright in their place, level with
// the blocks' labels, worked out from the same tokens.
const HomeNav = ({ setNavRef, cue }) => {
  const navItems = useNavItems();

  return (
    <div
      ref={setNavRef}
      className={cn(
        "flex items-center justify-between gap-6 py-3 md:col-start-1 md:items-end md:row-start-2 md:pt-0 md:pb-[calc(theme(spacing.plate)+theme(spacing.plate-foot)+1px)]",
        INTRO_GUTTER_CLASS,
      )}
    >
      <nav aria-label="Portfolio sections" className="md:hidden">
        <ul className="flex gap-8">
          {navItems.map(({ id, label, link }) => (
            <li key={id}>
              <a
                {...link}
                className="flex min-h-12 items-center font-epilogue text-[0.75rem] leading-none font-medium tracking-[0.06em] text-ink uppercase transition-colors hover:text-ash focus-visible:outline-ink"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <small className="hidden font-epilogue text-[0.8125rem] leading-none font-medium text-ash md:block">
        {COPYRIGHT}
      </small>

      {cue}
    </div>
  );
};

export default HomeNav;
