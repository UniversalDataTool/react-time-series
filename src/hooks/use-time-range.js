export default (matrix, width) => {
  const visibleTimeStart = matrix.inverse().applyToPoint(0, 0).x;
  const visibleTimeEnd = matrix.inverse().applyToPoint(width, 0).x;
  const visibleDuration = visibleTimeEnd - visibleTimeStart;

  return {
    visibleTimeStart,
    visibleTimeEnd,
    visibleDuration,
  };
};
