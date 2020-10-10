import useGlobalTransformMatrix from "../use-global-transform-matrix"
export default () => {
  const transform = useGlobalTransformMatrix()

  const visibleTimeStart = transform.applyToPoint(0, 0).x
  const visibleTimeEnd = transform.applyToPoint(1, 0).x
  const visibleDuration = visibleTimeEnd - visibleTimeStart

  return {
    visibleTimeStart,
    visibleTimeEnd,
    visibleDuration,
  }
}
