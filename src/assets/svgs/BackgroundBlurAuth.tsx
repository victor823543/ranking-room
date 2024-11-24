const BackgroundBlurAuth = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 800 450"
      opacity="0.44"
      width={"100%"}
      height={"100%"}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="66"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          ></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)">
        <ellipse
          rx="147"
          ry="148.5"
          cx="589.3651344992898"
          cy="-22.391580755060374"
          fill="hsla(229, 7%, 79%, 1.00)"
        ></ellipse>
        <ellipse
          rx="147"
          ry="148.5"
          cx="738.5014315518465"
          cy="-9.270836570046157"
          fill="hsla(0, 0%, 100%, 1.00)"
        ></ellipse>
        <ellipse
          rx="147"
          ry="148.5"
          cx="47.02012356844813"
          cy="465.2408253062855"
          fill="hsla(212, 6%, 87%, 1.00)"
        ></ellipse>
      </g>
    </svg>
  );
};

export default BackgroundBlurAuth;
