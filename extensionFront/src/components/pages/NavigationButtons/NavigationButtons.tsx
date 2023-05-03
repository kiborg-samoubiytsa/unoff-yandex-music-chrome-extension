import { FC } from "react";
import "./NavigationButtons.scss";
import { NavigationBack } from "./NavigationBack";
import { NavigationForward } from "./NavigationForward";

interface Props {
  back: {
    page: string;
    description: string;
  };
  forward: {
    page: string;
    description: string;
  };
}

export const NavigationButtons: FC<Props> = ({ back, forward }) => {
  return (
    <div className="navigationButtons">
      <NavigationBack description={back.description} page={back.page} />
      <NavigationForward
        description={forward.description}
        page={forward.page}
      />
    </div>
  );
};
