import "@testing-library/jest-dom";
import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Alertbox from "./../component/Common/Alertbox";

test("Show Alertbox when the button is clicked", () => {
  const testMessage = "Test Message";

  render(<Alertbox>{testMessage}</Alertbox>);

  expect(screen.queryByText(testMessage)).toBeNull();
  fireEvent.click(screen.getByLabelText(/alertbox/i));
  expect(screen.getByText(testMessage)).toBeInTheDocument();
});
