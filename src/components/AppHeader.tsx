import beautifyPrice from "../helpers/beautifyPrice";

interface appHeaderProps {
  step: number;
  totalSteps: number;
  clientBudget: number;
  priceRange: { lowPrice: number; highPrice: number };
}

const AppHeader: React.FC<appHeaderProps> = ({
  step,
  totalSteps,
  clientBudget,
  priceRange,
}) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <span>
        {step + 1}/<b>{totalSteps}</b>
      </span>
      {step !== 0 ? (
        <div style={{ float: "right" }}>
          Budget: {beautifyPrice(clientBudget, "compact")} &nbsp;|&nbsp; Total
          Range:{" "}
          <span
            style={{
              color: clientBudget > priceRange.lowPrice ? "inherit" : "red",
            }}
          >
            {beautifyPrice(priceRange.lowPrice, "compact")}-
            {beautifyPrice(priceRange.highPrice, "compact")}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default AppHeader;
