import React from 'react';
import Svg, { Path } from 'react-native-svg';

const HalfCircle = ({ size, color, strokeWidth }) => {
    const halfSize = size - strokeWidth
    const radius = (halfSize - strokeWidth) / 2;
    const cx = (size) / 2;
    const cy = (size) / 2;

    // Define the half-circle path
    const d = `
        M ${cx - radius}, ${cy}
        A ${radius},${radius} 0 1 1 ${cx + radius},${cy}
        A ${radius},${radius} 0 1 1 ${cx},${cy - radius}

    `;

    return (
        <Svg width={halfSize} height={size}>
            <Path
                d={d}
                fill={color}
                strokeLinecap="round"
            />
        </Svg>
    );
};

export default HalfCircle;