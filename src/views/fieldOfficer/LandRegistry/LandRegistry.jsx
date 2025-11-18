import { Typography, Box, Paper, Button, Breadcrumbs } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import LandRegistryDataGrid from "./LandRegistryDataGrid.jsx";
import { getLandsByFieldOfficerId } from "../../../api/land.js";

const LandRegistry = () => {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState([]);
  const [loggedUserId, setLoggedUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("loggedUserId") || "";
    setLoggedUserId(id);
  }, []);

  const fetchData = async function () {
    // console.log("Fetching lands for Field Officer ID:", loggedUserId);
    const response = await getLandsByFieldOfficerId(loggedUserId);
    //console.log("API lands:", response);
    setResponseData(response ?? []);
  };

  useEffect(() => {
    if (loggedUserId) {
      fetchData();
    }
  }, [loggedUserId]);

  const handleDelete = (deletedLandId) => {
    setResponseData((prev) =>
      prev.filter((land) => land._id !== deletedLandId)
    );
  };

  return (
    <>
      <Box>
        <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Land Registry
          </Typography>

          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/fieldOfficer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
              Home
            </Link>
            <Typography sx={{ color: "text.primary" }}>
              Land Registry
            </Typography>
          </Breadcrumbs>
        </Box>
        <Paper
          elevation={5}
          sx={{ maxWidth: 1100, mx: "auto", p: 3, borderRadius: 5 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/fieldOfficer/landRegistration1")}
            >
              ADD NEW LAND
            </Button>
          </Box>
          <LandRegistryDataGrid data={responseData} onDelete={handleDelete} />
        </Paper>
      </Box>
    </>
  );
};

export default LandRegistry;
