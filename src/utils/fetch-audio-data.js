export default async (audioUrl) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const audioContext = new AudioContext()
  const audioBuffer = await fetch(audioUrl)
    .then((res) => res.arrayBuffer())
    .then((arBuf) => audioContext.decodeAudioData(arBuf))

  // Convert into timeData
  const channel = audioBuffer.getChannelData(0)

  const blockDuration = 1
  const samplesPerBlock = audioBuffer.sampleRate * (blockDuration / 1000)
  const timeData = []
  for (let i = 0; i < channel.length; i += samplesPerBlock) {
    const avg =
      channel.slice(i, i + samplesPerBlock).reduce((acc, a) => acc + a, 0) /
      samplesPerBlock

    timeData.push({ time: i * (1 / audioBuffer.sampleRate) * 1000, value: avg })
  }

  return timeData
}
