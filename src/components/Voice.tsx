import { Link } from 'react-router-dom';
import '../style/Voice.css';

interface VoiceProps {
  value: string;
  path: string;
}

function Voice({ value, path }: VoiceProps) {
  return (
    <li>
      <Link to={path}>{value}</Link>
    </li>
  );
}

export default Voice;