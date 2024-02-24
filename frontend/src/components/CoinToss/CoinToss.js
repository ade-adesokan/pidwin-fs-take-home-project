import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useState } from "react";
import { tossCoin } from "../../actions/tossCoin";

import { styles } from "./styles";
import { useDispatch } from "react-redux";

const formDataInitVal = {
  wager: 0,
  toss: 'head',
};

const CoinToss = ({tokens}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(formDataInitVal);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(tossCoin(formData));
    setFormData(formDataInitVal);
  };

  return (
    <Box as="form" m={3} onSubmit={handleSubmit}>
      <TextField
        name="wager"
        label="Wager"
        type="number"
        value={formData.wager}
        onChange={handleChange}
        InputProps={{ inputProps: { max: tokens } }}
        fullWidth
        autoFocus
        required
      />
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="toss"
          value={formData.toss}
          onChange={handleChange}
        >
          <FormControlLabel value="head" control={<Radio />} label="Head" />
          <FormControlLabel value="tail" control={<Radio />} label="Tail" />
        </RadioGroup>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth sx={styles.button}>Toss Coin</Button>
    </Box>
  )
};

export default CoinToss;
