import React, { useEffect } from "react";
import { Box, Typography, Button, Menu, MenuItem, Pagination, Grid, Tooltip, Link, styled } from "@mui/material";
import SimpleBar from "simplebar-react";
import ErrorBoundary from "../utils/ErrorBoundary";
import AdSense from "react-adsense";
import CustomLink from "../utils/CustomLink";
import Footer from "../utils/Footer";
import Loading from "../utils/Loading";
import default_thumbnail from "../assets/default_thumbnail.png";
import { tooltipClasses } from "@mui/material/Tooltip";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

const limit = 50;
const API_BASE = "https://api.xqc.wtf";

export default function Vods() {
  const [vods, setVods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(null);
  const [totalPages, setTotalPages] = React.useState(null);

  useEffect(() => {
    document.title = `VODS - xQc`;
    const fetchVods = async () => {
      await fetch(`${API_BASE}/vods?$limit=${limit}&$sort[createdAt]=-1`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setPage(1);
          setVods(
            response.data.map((vod, i) => {
              return <Vod key={vod.id} vod={vod} />;
            })
          );
          setTotalPages(Math.floor(response.total / limit));
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchVods();
    return;
  }, []);

  const handlePageChange = (e, value) => {
    if (page === value) return;
    setLoading(true);
    setPage(value);

    fetch(`${API_BASE}/vods?$limit=${limit}&$skip=${(value - 1) * limit}&$sort[createdAt]=-1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.data.length === 0) return;

        setVods(
          response.data.map((vod, i) => {
            return <Vod key={vod.id} vod={vod} />;
          })
        );
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading) return <Loading />;

  return (
    <SimpleBar style={{ height: "calc(100% - 64px)" }}>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
          <ErrorBoundary>
            <AdSense.Google client="ca-pub-8093490837210586" slot="3667265818" style={{ display: "block" }} format="auto" responsive="true" layoutKey="-gw-1+2a-9x+5c" />
          </ErrorBoundary>
        </Box>
        <Grid container spacing={2} sx={{ mt: 1, justifyContent: "center" }}>
          {vods}
        </Grid>
        <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
          <ErrorBoundary>
            <AdSense.Google client="ca-pub-8093490837210586" slot="3667265818" style={{ display: "block" }} format="auto" responsive="true" layoutKey="-gw-1+2a-9x+5c" />
          </ErrorBoundary>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
        {totalPages !== null && <Pagination count={totalPages} disabled={totalPages <= 1} color="primary" page={page} onChange={handlePageChange} />}
      </Box>
      <Footer />
    </SimpleBar>
  );
}

const Vod = (props) => {
  const { vod } = props;
  return (
    <Grid item xs={2} sx={{ maxWidth: "18rem", flexBasis: "18rem" }}>
      <Box
        sx={{
          overflow: "hidden",
          height: 0,
          paddingTop: "56.25%",
          position: "relative",
          "&:hover": {
            boxShadow: "0 0 8px #fff",
          },
        }}
      >
        <Link href={vod.youtube.length > 0 ? `/youtube/${vod.id}` : `/manual/${vod.id}`}>
          <img className="thumbnail" alt="" src={vod.thumbnail_url ? vod.thumbnail_url : default_thumbnail} />
        </Link>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Box sx={{ position: "absolute", bottom: 0, left: 0 }}>
            <Typography variant="caption" sx={{ padding: "0 .2rem", backgroundColor: "rgba(0,0,0,.6)" }}>
              {`${vod.date}`}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ pointerEvents: "none", position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <Box sx={{ position: "absolute", bottom: 0, right: 0 }}>
            <Typography variant="caption" sx={{ padding: "0 .2rem", backgroundColor: "rgba(0,0,0,.6)" }}>
              {`${vod.duration}`}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 1, mb: 1 }}>
        <Box sx={{ display: "flex", flexWrap: "nowrap", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, flexShrink: 1, width: "100%", minWidth: 0 }}>
            <Box>
              <CustomWidthTooltip title={vod.title} placement="bottom">
                <span>
                  <CustomLink
                    component={Button}
                    href={vod.youtube.length > 0 ? `/youtube/${vod.id}` : `/manual/${vod.id}`}
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
                  >
                    <Typography variant="caption" color="primary">
                      {vod.title}
                    </Typography>
                  </CustomLink>
                </span>
              </CustomWidthTooltip>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <WatchMenu vod={vod} />
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: "none",
  },
});

const WatchMenu = (props) => {
  const { vod } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box>
      <Button onClick={handleClick}>
        <Box sx={{ mr: 1 }}>
          <Typography variant="h7">Watch on</Typography>
        </Box>
        <PlayCircleIcon />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {vod.youtube.length > 0 && (
          <CustomLink href={`/youtube/${props.vod.id}`}>
            <MenuItem>Youtube</MenuItem>
          </CustomLink>
        )}
        {Date.now() - new Date(vod.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000 && (
          <CustomLink href={`/cdn/${props.vod.id}`}>
            <MenuItem>CDN</MenuItem>
          </CustomLink>
        )}
        <CustomLink href={`/manual/${props.vod.id}`}>
          <MenuItem>Manual</MenuItem>
        </CustomLink>
      </Menu>
    </Box>
  );
};
