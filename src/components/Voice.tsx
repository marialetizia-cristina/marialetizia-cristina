import '../style/Voice.css';

interface VoiceProps {
  value: string;
  path: string;
}

const Voice = ({ value, path }: VoiceProps) => {
  return (
    <li>
      <a href={path}>{value}</a>
    </li>
  );
}

export default Voice;