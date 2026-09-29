// As tall as the nav bar pinned over it, which is what the height is for: the bar
// is fixed to the foot of the viewport and so takes no room in the flow, and this
// is the last thing in the document — the only room the page has to scroll its own
// last row out from under it. A short page (Projects filtered to three tiles) has
// no other slack, and its bottom row was unreachable without this.
//
// The fallback is the bar's own floor on small screens, for the frame before
// useNavHeightVar has measured it.
const Footer = () => {
  return (
    <footer className="flex min-h-[var(--nav-height,4rem)] items-center justify-center px-6 py-6 text-center text-sm text-carbon-400">
      © 2026 Richard Han. Icons by Freepik from Flaticon.
    </footer>
  );
};

export default Footer;
