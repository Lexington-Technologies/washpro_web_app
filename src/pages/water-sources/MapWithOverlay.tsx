import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MapOverlayCard from './MapOverlayCard'; // Adjust the import path as necessary
import { Box } from 'lucide-react';

const MapWithOverlay = ({ position, waterSource }: { position: [number, number]; waterSource: WaterSource }) => {
  return (
    <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', mb: 4, position: 'relative' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            {waterSource?.type} at {waterSource?.ward}
          </Popup>
        </Marker>
      </MapContainer>
      <MapOverlayCard
        latitude={position[0]}
        longitude={position[1]}
        village={waterSource.village}
        hamlet={waterSource.hamlet}
        ward={waterSource.ward}
      />
    </Box>
  );
};

export default MapWithOverlay;