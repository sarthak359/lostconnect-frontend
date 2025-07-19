import styled from "styled-components";
import { FiX } from "react-icons/fi";
import LocationPopup from "./LocationPopup"; // Adjust the path if needed

// ✅ Add this Project type at the top (or import it from a shared types file)
export interface Project {
  id: number;
  title: string;
  description: string;
  status: "lost" | "found";
  category: "human" | "animal" | "plant";
  lat: number;
  lng: number;
  image_url?: string;
  date?: string;
  user_id: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
}

interface BookingCardProps {
  project: Project;
  onClose: () => void;
}

const BookingCard = ({ project, onClose }: BookingCardProps) => {
  const handleClose = () => {
    // 👇 Dispatch a "unzoom-map" event when the card is closed
    window.dispatchEvent(
      new CustomEvent("unzoom-map", {
        detail: { lat: project.lat, lng: project.lng },
      })
    );

    // Then trigger the parent onClose
    onClose();
  };
  return (
    <CardWrapper>
      <CloseButton onClick={handleClose}>
        <FiX size={24} />
      </CloseButton>
      <Logo src="/logo.svg" alt="logo" />{" "}
      {/* Replace with your actual logo/image */}
      <Title>{project.title}</Title>
      <InfoRow>
        <Label>Creator</Label>
        <Value>{project.creator.name}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Description</Label>
        <Value>{project.description}</Value>
      </InfoRow>
      <InfoRow>
        <Label>Location</Label>
        {project.lat && project.lng ? (
          <LocationPopup lat={project.lat} lng={project.lng} />
        ) : (
          <Value>Unknown</Value>
        )}
      </InfoRow>
      <ButtonRow>
        <Button className="owner">Owner Profile</Button>
        <Button className="support">Support</Button>
      </ButtonRow>
    </CardWrapper>
  );
};
const CardWrapper = styled.div`
  position: relative;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 24px 20px;
  font-family: "Segoe UI", sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: #444;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto 16px auto;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  margin: 0 4px;

  &.owner {
    background-color: #a855f7;
    color: white;
  }

  &.support {
    background-color: #22c55e;
    color: white;
  }
`;

export default BookingCard;
