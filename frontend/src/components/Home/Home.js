import React from "react";
import { Box, Container, Grow, Paper, Typography } from "@mui/material";
import {getUserFromStorage} from '../../utils/getUserFromStorage';
import CoinToss from "../CoinToss/CoinToss";
import TossHistory from "../TossHistory/TossHistory";

const Home = () => {

  const user = getUserFromStorage();
  const isSignedIn = user;

  return (
    <Grow in>
      <Container component="main" maxWidth="sm">
        <Paper elevation={3}>
            {isSignedIn !== "null" && isSignedIn !== null ? (
              <Box>
                <Typography variant="h4" align="center" color="primary">
                  {`Welcome ${user.name}`}
                </Typography>
                <CoinToss />
                <TossHistory />
              </Box>
            ) : (
              <Typography variant="h4" align="center" color="primary">
                Login to Play
              </Typography>
            )}
        </Paper>
      </Container>
    </Grow>
  );
};

export default Home;
