import { useEffect, useState } from "react";
import getLocationName from "../utils/geocode";

interface LocationPopupProps {
  lat: number;
  lng: number;
}

const LocationPopup: React.FC<LocationPopupProps> = ({ lat, lng }) => {
  const [locationName, setLocationName] = useState("Loading location...");

  useEffect(() => {
    getLocationName(lat, lng).then(setLocationName);
  }, [lat, lng]);

  return <em>{locationName}</em>;
};

export default LocationPopup;
