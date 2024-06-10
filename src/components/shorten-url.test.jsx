import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Link, MemoryRouter, useLocation } from "react-router-dom";

import App from "./app";
import ShortenUrl from "./shorten-url";
import axiosInstance from "../utils/network";

describe("ShortenUrlPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render page correctly", () => {
    render(<ShortenUrl />, { wrapper: MemoryRouter });

    const title = screen.getByText("Paste the URL to be shortened");
    expect(title).toBeInTheDocument();
  });

  it("should shorten url correctly", async () => {
    const user = userEvent.setup();

    const orignialUrl = "https://www.google.com";
    const shortUrl = "http://localhost:3000/P7Cv";

    axiosInstance.post = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({ data: "P7Cv" }));

    render(<ShortenUrl />, { wrapper: MemoryRouter });

    let short = screen.queryByTestId("shorturl-text");
    expect(short).not.toBeInTheDocument();

    const input = screen.getByTestId("longurl-text");
    const button = screen.getByTestId("longurl-button");

    await user.type(input, orignialUrl); // fireEvent.change() doesn't work on material-ui TextField
    await user.click(button); // fireEvent.click() can work on material-ui Button though

    short = screen.getByDisplayValue(shortUrl);
    expect(short).toHaveValue(shortUrl); // same as expect(short.value).toBe(shortUrl);

    expect(axiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it("should redirect to original url correctly", async () => {
    const user = userEvent.setup();

    const orignialUrl = "https://www.google.com";

    axiosInstance.get = jest.fn(() => Promise.resolve({ data: orignialUrl }));
    delete window.location;
    window.location = { replace: jest.fn() };

    let location;
    const ShortenUrlWrapper = () => {
      location = useLocation();
      return (
        <>
          <App />
          <Link to="/P7Cv">SimulateLink</Link>
        </>
      );
    };

    render(<ShortenUrlWrapper />, { wrapper: MemoryRouter });

    expect(location.pathname).toBe("/");

    const simulateLink = screen.getByText("SimulateLink");
    await user.click(simulateLink);

    expect(location.pathname).toBe("/P7Cv");

    expect(axiosInstance.get).toHaveBeenCalledTimes(1);

    const title = screen.queryByText("Paste the URL to be shortened");
    expect(title).not.toBeInTheDocument(); //page is redirected already
  });
});
