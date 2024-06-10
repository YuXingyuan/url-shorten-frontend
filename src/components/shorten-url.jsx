import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { WEB_BASE_URL, shortenUrl, restoreUrl } from "../utils/network";

const sxStyles = {
  root: {
    height: "100%vh",
    justifyContent: "center",
  },
  boxes: {
    width: "50%",
  },
  title: {
    textAlign: "center",
    marginTop: 8,
    marginBottom: 3,
  },
  links: {
    textDecoration: "none",
    color: "#0B6BCB",
  },
  inputs: {
    marginTop: 4,
    width: "40%",
  },
  buttons: {
    width: "20%",
    marginTop: 4,
  },
  errors: {
    color: "#C41C1C",
    marginTop: 1,
    width: "40%",
  },
  errorBox: {
    width: "20%",
  },
};
const ShortenUrl = () => {
  const { redirectShortUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectShortUrl) {
      restoreUrl(redirectShortUrl)
        .then(({ data }) => {
          console.log(data);
          window.location.replace(data);
        })
        .catch((error) => {
          console.log(error);
          navigate("/", { replace: true });
        });
    }
  }, [redirectShortUrl, navigate]);

  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    navigator.clipboard.writeText(shortUrl);
    setOpen(true);
  };

  const handleButtonClick = () => {
    shortenUrl(longUrl)
      .then(({ data }) => {
        setShortUrl(WEB_BASE_URL + data);
      })
      .catch((error) => {
        setError(error.response.data);
        setShortUrl("");
      });
  };

  if (redirectShortUrl) return null;

  return (
    <Grid container component="main" sx={sxStyles.root}>
      <Box sx={sxStyles.boxes}>
        <Typography variant="h3" component="div" sx={sxStyles.title}>
          <Link
            to="/"
            style={sxStyles.links}
            onClick={() => {
              setError("");
              setLongUrl("");
              setShortUrl("");
            }}
          >
            Shorten URL
          </Link>
        </Typography>

        <Card elevation={6}>
          <CardContent>
            <Typography variant="h4" component="div" align="center">
              Paste the URL to be shortened
            </Typography>

            <Typography variant="body1" component="div">
              <Stack direction="row" justifyContent="center">
                <TextField
                  variant="outlined"
                  placeholder="Enter the link here"
                  value={longUrl}
                  onChange={(e) => {
                    setError("");
                    setLongUrl(e.target.value);
                  }}
                  error={!!error}
                  sx={sxStyles.inputs}
                  data-testid={"longurl-text"}
                />
                <Button
                  variant="contained"
                  onClick={handleButtonClick}
                  sx={sxStyles.buttons}
                  data-testid={"longurl-button"}
                >
                  Shorten URL
                </Button>
              </Stack>
            </Typography>
            <Typography variant="body1" component="div">
              <Stack direction="row" justifyContent="center">
                <Box sx={sxStyles.errors}>{error}</Box>
                <Box sx={sxStyles.errorBox}></Box>
              </Stack>
            </Typography>
          </CardContent>
        </Card>

        {shortUrl && (
          <Box marginTop={3}>
            <Card elevation={6}>
              <CardContent>
                <Typography variant="body1" component="div">
                  <Stack direction="row" justifyContent="center">
                    <TextField
                      variant="outlined"
                      value={shortUrl}
                      sx={sxStyles.inputs}
                    />
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                      <Tooltip
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title="URL Copied"
                      >
                        <Button
                          variant="contained"
                          sx={sxStyles.buttons}
                          onClick={handleTooltipOpen}
                        >
                          Copy URL
                        </Button>
                      </Tooltip>
                    </ClickAwayListener>
                  </Stack>
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default ShortenUrl;
