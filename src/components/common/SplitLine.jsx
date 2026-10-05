// Screen readers get the sr-only copy, since an aria-label on a plain span isn't
// reliably read and the split letters would otherwise be read out one by one.
const SplitLine = ({ text }) => (
  <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" data-split>
      {text}
    </span>
  </>
);

export default SplitLine;
