import { PATHS } from "../../routes/routes";
import { useNavLink } from "../../routes/useNavLinks";
import { INTRO_TOPLINE } from "../../data/home.data";

const [FIRST_NAME, LAST_NAME] = INTRO_TOPLINE.name.split(" ");

// The bar at the foot of the hero, and — pinned to the viewport by SiteNav — at the
// foot of every screen below it: the name at display size, the section links
// opposite it, and nothing between them. One component for both, and now one layout
// as well, so the pinned copy sits exactly on top of the hero's own wherever the two
// are stacked.
//
// The items are pages rather than sections of one, so each carries a real link to a
// real URL — see useNavLinks, which is where both copies of this bar get them.
//
// The name is the way back to the homepage, which is why there is no "Home" item
// beside the other three: a wordmark that leads home is the one piece of navigation
// every site already agrees on, and stating it twice in one bar would be the same
// link drawn twice. On the homepage itself it leads to the top of the page.
const NavMenu = ({
  items,
  setNameRef,
  setNavRef,
  ariaLabel = "Portfolio sections",
}) => {
  const homeLink = useNavLink(PATHS.home);

  return (
  <nav
    aria-label={ariaLabel}
    className="relative z-10 grid min-h-[4rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-grid bg-shell px-[1.4rem] py-2 md:min-h-[9.75rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-8 md:px-[clamp(1.75rem,3.2vw,3.5rem)] md:py-4"
  >
    <a
      {...homeLink}
      ref={setNameRef}
      className="font-heading text-[1.5rem] leading-none text-ink transition-colors hover:text-ash focus-visible:outline-ink md:py-[0.12em] md:text-[clamp(3.75rem,6vw,4.5rem)] md:leading-[0.85]"
    >
      {FIRST_NAME}&nbsp; <br />
      {LAST_NAME}.
    </a>

    <div
      ref={setNavRef}
      className="flex flex-row justify-end gap-[0.7rem] md:flex-col md:items-end md:gap-0 md:pb-[0.3rem]"
    >
      {items.map(({ id, label, link }, i) => (
        <a
          key={id}
          {...link}
          className="flex -mx-[0.35rem] min-h-12 items-center px-[0.35rem] font-urbanist text-[0.7rem] leading-[0.9] font-semibold whitespace-nowrap text-ink transition-colors hover:text-ash focus-visible:outline-ink md:mx-0 md:grid md:min-h-0 md:grid-cols-[1.6rem_minmax(0,1fr)] md:items-baseline md:px-0 md:text-[clamp(1.15rem,1.6vw,1.5rem)] md:leading-[1.55]"
        >
          <span
            aria-hidden="true"
            className="hidden font-epilogue text-[0.5625rem] tracking-[0.12em] text-ash md:block"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{label}.</span>
        </a>
      ))}
    </div>
  </nav>
  );
};

export default NavMenu;
