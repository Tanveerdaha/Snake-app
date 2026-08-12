import Svg, { Circle, Path } from 'react-native-svg';

import { COLORS } from '../theme';

export default function SettingsIcon({ size = 22, color = COLORS.accent }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path
        d="M19.4 13.5c.1-.5.1-1 .1-1.5s0-1-.1-1.5l2-1.5-2-3.5-2.4 1a7.2 7.2 0 0 0-2.6-1.5L14 2h-4l-.4 2.5a7.2 7.2 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5c-.1.5-.1 1-.1 1.5s0 1 .1 1.5l-2 1.5 2 3.5 2.4-1a7.2 7.2 0 0 0 2.6 1.5L10 22h4l.4-2.5a7.2 7.2 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="1.2" fill={color} />
    </Svg>
  );
}
