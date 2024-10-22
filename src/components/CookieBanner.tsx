import Button from "./Button";
import { Card } from "./Card";

const CookieBanner = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      aria-live="assertive"
      className="sm:w-auto sm:px-6 sm:pb-6 fixed bottom-0 left-0 z-50 w-fit px-4 pb-4"
    >
      <Card className="sm:space-x-8 flex items-center justify-between space-x-5 overflow-hidden rounded-xl p-4 text-sm">
        <div className="leading-tight">
          This site uses cookies. <br />
        </div>
        <Button size="sm" onClick={onClick}>
          OK
        </Button>
      </Card>
    </div>
  );
};

export default CookieBanner;
