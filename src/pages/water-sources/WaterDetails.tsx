import { useParams } from 'react-router-dom';

function WaterDetails() {   
  const { id } = useParams();
  return (
    <div>WaterDetails {id}</div>
  )
}

export default WaterDetails