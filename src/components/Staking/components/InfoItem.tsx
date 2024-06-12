import clsx from "clsx";

const InfoItem = ({
  left,
  right,
  wrapperClassName,
}: {
  left: React.JSX.Element | string;
  right: React.JSX.Element | string;
  wrapperClassName?: string;
}) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between text-xs font-semibold tracking-[0.24px]",
        wrapperClassName
      )}
    >
      <span className="text-sand-11">{left}</span>
      <span>{right}</span>
    </div>
  );
};

export default InfoItem;
