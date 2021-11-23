import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import formatISO from "date-fns/formatISO";
import { City } from "./types";

const cities: City[] = [
  {
    name: "Quebec",
    geohash: "f2m673",
  },
  {
    name: "Montreal",
    geohash: "f25dvk",
  },
];
interface Props {
  onSubmit(data: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }): void;
}

const DEFAULT_ORIGIN = {
  name: "Quebec",
  geohash: "f2m673",
};

const DEFAULT_DESTINATION = {
  name: "Montreal",
  geohash: "f25dvk",
};

const DEFAULT_DATE = new Date(2021, 7, 2);

export default function Form({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState<string>(DEFAULT_ORIGIN.geohash);
  const [destination, setDestination] = useState<string>(
    DEFAULT_DESTINATION.geohash
  );
  const [passengers, setPassengers] = useState<number>(1);
  const [date, setDate] = useState<Date | null>();

  const _onSubmit = useCallback(() => {
    onSubmit({
      origin,
      destination,
      date: formatISO(date || DEFAULT_DATE, { representation: "date" }),
      passengers,
    });
  }, [date, destination, onSubmit, origin, passengers]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Autocomplete
          disablePortal
          id="origin"
          options={cities}
          renderInput={(params) => (
            <TextField {...params} label={t("Origin")} />
          )}
          getOptionLabel={(option) => option.name}
          defaultValue={DEFAULT_ORIGIN}
          fullWidth
          onChange={(_event, value) => {
            setOrigin(value?.geohash || DEFAULT_ORIGIN.geohash);
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Autocomplete
          disablePortal
          id="destination"
          options={cities}
          renderInput={(params) => (
            <TextField {...params} label={t("Destination")} />
          )}
          getOptionLabel={(option) => option.name}
          defaultValue={DEFAULT_DESTINATION}
          onChange={(event, value) => {
            setDestination(value?.geohash || DEFAULT_DESTINATION.geohash);
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={t("Date")}
            value={date}
            onChange={(date) => {
              setDate(date);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={2}>
        <TextField
          id="passengers-number"
          label={t("Passengers")}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          value={passengers}
          onChange={(event) => {
            setPassengers(parseInt(event.target.value));
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <Button variant="contained" size="large" onClick={_onSubmit}>
          {t("Search")}
        </Button>
      </Grid>
    </Grid>
  );
}
