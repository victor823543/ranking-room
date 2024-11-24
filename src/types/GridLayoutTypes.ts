/* 
Structure
positionY - positionX - sizeY - sizeX

Naming convention?: 
positionY - top, mid, bottom
positionX - left, mid, right
sizeY - tall, base, short
sizeX - wide, base, narrow

*/

/* 
New scope: 
Cols: 7,
Rows: 6,
New naming convention:
positionY - top, inner, mid, bottom
positionX - left, inner, mid, right
sizeY - tall, base, half, short
sizeX - full, wider, wide, base, narrow
*/

import React from "react";

export type GridLayoutProps = Partial<{
  // TallFull
  topLeftTallFull: React.ReactNode;

  // TallWider
  topLeftTallWider: React.ReactNode;
  topRightTallWider: React.ReactNode;

  // TallWide
  topLeftTallWide: React.ReactNode;
  topRightTallWide: React.ReactNode;

  // TallBase
  topLeftTallBase: React.ReactNode;
  topRightTallBase: React.ReactNode;
  topInnerTallBase: React.ReactNode;

  // TallNarrow
  topLeftTallNarrow: React.ReactNode;
  topRightTallNarrow: React.ReactNode;
  topInnerTallNarrow: React.ReactNode;
  topMidTallNarrow: React.ReactNode;

  // BaseFull
  topLeftBaseFull: React.ReactNode;
  bottomLeftBaseFull: React.ReactNode;

  // BaseWider
  topLeftBaseWider: React.ReactNode;
  topRightBaseWider: React.ReactNode;
  bottomLeftBaseWider: React.ReactNode;
  bottomRightBaseWider: React.ReactNode;

  // BaseWide
  topLeftBaseWide: React.ReactNode;
  topRightBaseWide: React.ReactNode;
  bottomLeftBaseWide: React.ReactNode;
  bottomRightBaseWide: React.ReactNode;

  // BaseBase
  topLeftBaseBase: React.ReactNode;
  topInnerBaseBase: React.ReactNode;
  topRightBaseBase: React.ReactNode;
  bottomLeftBaseBase: React.ReactNode;
  bottomInnerBaseBase: React.ReactNode;
  bottomRightBaseBase: React.ReactNode;

  // BaseNarrow
  topLeftBaseNarrow: React.ReactNode;
  topInnerBaseNarrow: React.ReactNode;
  topMidBaseNarrow: React.ReactNode;
  topRightBaseNarrow: React.ReactNode;
  bottomLeftBaseNarrow: React.ReactNode;
  bottomInnerBaseNarrow: React.ReactNode;
  bottomMidBaseNarrow: React.ReactNode;
  bottomRightBaseNarrow: React.ReactNode;

  // HalfFull
  topLeftHalfFull: React.ReactNode;
  bottomLeftHalfFull: React.ReactNode;

  // HalfWider
  topLeftHalfWider: React.ReactNode;
  topRightHalfWider: React.ReactNode;
  bottomLeftHalfWider: React.ReactNode;
  bottomRightHalfWider: React.ReactNode;

  // HalfWide
  topLeftHalfWide: React.ReactNode;
  topRightHalfWide: React.ReactNode;
  bottomLeftHalfWide: React.ReactNode;
  bottomRightHalfWide: React.ReactNode;

  // HalfBase
  topLeftHalfBase: React.ReactNode;
  topInnerHalfBase: React.ReactNode;
  topRightHalfBase: React.ReactNode;
  bottomLeftHalfBase: React.ReactNode;
  bottomInnerHalfBase: React.ReactNode;
  bottomRightHalfBase: React.ReactNode;

  // HalfNarrow
  topLeftHalfNarrow: React.ReactNode;
  topInnerHalfNarrow: React.ReactNode;
  topMidHalfNarrow: React.ReactNode;
  topRightHalfNarrow: React.ReactNode;
  bottomLeftHalfNarrow: React.ReactNode;
  bottomInnerHalfNarrow: React.ReactNode;
  bottomMidHalfNarrow: React.ReactNode;
  bottomRightHalfNarrow: React.ReactNode;

  // ShortFull
  topLeftShortFull: React.ReactNode;
  bottomLeftShortFull: React.ReactNode;

  // ShortWider
  topLeftShortWider: React.ReactNode;
  topRightShortWider: React.ReactNode;
  midLeftShortWider: React.ReactNode;
  midRightShortWider: React.ReactNode;
  bottomLeftShortWider: React.ReactNode;
  bottomRightShortWider: React.ReactNode;

  // ShortWide
  topLeftShortWide: React.ReactNode;
  topRightShortWide: React.ReactNode;
  midLeftShortWide: React.ReactNode;
  midRightShortWide: React.ReactNode;
  bottomLeftShortWide: React.ReactNode;
  bottomRightShortWide: React.ReactNode;

  // ShortBase
  topLeftShortBase: React.ReactNode;
  topInnerShortBase: React.ReactNode;
  topRightShortBase: React.ReactNode;
  midLeftShortBase: React.ReactNode;
  midInnerShortBase: React.ReactNode;
  midRightShortBase: React.ReactNode;
  bottomLeftShortBase: React.ReactNode;
  bottomInnerShortBase: React.ReactNode;
  bottomRightShortBase: React.ReactNode;

  // ShortNarrow
  topLeftShortNarrow: React.ReactNode;
  topInnerShortNarrow: React.ReactNode;
  topMidShortNarrow: React.ReactNode;
  topRightShortNarrow: React.ReactNode;
  midLeftShortNarrow: React.ReactNode;
  midInnerShortNarrow: React.ReactNode;
  midMidShortNarrow: React.ReactNode;
  midRightShortNarrow: React.ReactNode;
  bottomLeftShortNarrow: React.ReactNode;
  bottomInnerShortNarrow: React.ReactNode;
  bottomMidShortNarrow: React.ReactNode;
  bottomRightShortNarrow: React.ReactNode;
}>;
