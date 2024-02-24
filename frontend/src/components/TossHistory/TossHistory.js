import { useEffect, useState } from "react";
import * as api from "../../api";
import * as messages from "../../messages";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";

const TossHistory = () => {
  const [tosses, setTosses] = useState();
  const tossHistoryData = useSelector(state => {
    return state.toss.tossHistoryData
  });

  useEffect(() => {
    async function fetchTosses() {
      try {
        const { data } = await api.getTosses({limit: 10})
        setTosses(data);
      } catch (error) {
        messages.error(error.response.data.message);
      }
    }
    fetchTosses();
  }, []);

  useEffect(() => {
    if (tossHistoryData) {
      setTosses(tossHistoryData)
    }
  }, [tossHistoryData]);


  return (
    <Box m={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" component="h2">Toss History</Typography>
      <TableContainer>
        <Table aria-label="toss history table">
          <TableHead>
            <TableRow>
              <TableCell>Wager</TableCell>
              <TableCell>Toss</TableCell>
              <TableCell>Win</TableCell>
              <TableCell>Loss</TableCell>
            </TableRow>
          </TableHead>
          {tosses && <TableBody>
            {tosses.map((toss) => (
              <TableRow
                key={toss._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  {toss.wager}
                </TableCell>
                <TableCell>{toss.toss}</TableCell>
                <TableCell>{toss.win ? <CheckIcon/> : ""}</TableCell>
                <TableCell>{!toss.win ? <CloseIcon/> : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>}
        </Table>

      </TableContainer>
    </Box>
  )

};

export default TossHistory;
