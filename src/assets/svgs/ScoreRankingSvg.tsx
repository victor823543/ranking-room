const ScoreRankingSvg = () => {
  const primaryColor = "rgb(var(--primary))";
  const secondaryColor = "rgb(var(--primary-dark))";
  return (
    <svg
      id="eMIad1BElck1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 300 300"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <g transform="matrix(2.352605 0 0 2.767108-185.961828-260.902862)">
        <line
          x1="-56.585259"
          y1="0"
          x2="56.58526"
          y2="0"
          transform="translate(142.804187 110.55386)"
          fill="none"
          stroke={primaryColor}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="-56.58526"
          y1="0"
          x2="56.58526"
          y2="0"
          transform="translate(142.804187 150)"
          fill="none"
          stroke={primaryColor}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <line
          x1="-56.58526"
          y1="0"
          x2="56.585259"
          y2="0"
          transform="translate(142.804188 186.436982)"
          fill="none"
          stroke={primaryColor}
          strokeWidth="7"
          strokeLinecap="round"
        />
        <rect
          width="7.195813"
          height="16.354121"
          rx="3"
          ry="3"
          transform="matrix(1.000001 0 0 1.44 123.179239 98.778893)"
          fill={secondaryColor}
          strokeWidth="0"
        />
        <rect
          width="7.195813"
          height="16.354121"
          rx="3"
          ry="3"
          transform="matrix(1.000001 0 0 1.44 150 174.662015)"
          fill={secondaryColor}
          strokeWidth="0"
        />
        <rect
          width="7.195813"
          height="16.354121"
          rx="3"
          ry="3"
          transform="matrix(1.000001 0 0 1.44 174.204097 138.225033)"
          fill={secondaryColor}
          strokeWidth="0"
        />
      </g>
    </svg>
  );
};

export default ScoreRankingSvg;
