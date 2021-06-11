import { Button } from "@material-ui/core";
import Box from "@material-ui/core/Box";

interface appFooterProps {
  step: number;
  totalSteps: number;
  nextStep: Function;
  prevStep: Function;
}

const AppFooter: React.FC<appFooterProps> = ({
  step,
  totalSteps,
  nextStep,
  prevStep,
}) => {
  const showBackButton = step > 0;
  const showNextButton = step < totalSteps;

  return (
    <Box marginTop={4}>
      {showBackButton ? (
        <Button onClick={() => prevStep()} size="large">
          Back
        </Button>
      ) : null}
      {showNextButton ? (
        <Button
          onClick={() => nextStep()}
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          size="large"
        >
          Next Step
        </Button>
      ) : null}
    </Box>
  );
};

export default AppFooter;
