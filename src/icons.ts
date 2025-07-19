import L from "leaflet";

export const Icons = {
  human: new L.DivIcon({
    className: "emoji-icon",
    html: "👤",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  animal: new L.DivIcon({
    className: "emoji-icon",
    html: "🐶",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
  plant: new L.DivIcon({
    className: "emoji-icon",
    html: "🌳",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  }),
};
