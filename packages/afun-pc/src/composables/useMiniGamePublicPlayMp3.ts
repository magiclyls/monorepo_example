export function useMiniGamePublicPlayMp3(url: string) {
  const { volume } = useMiniGameGlobalStateMp3Volume()
  const context = new (window.AudioContext || window.webkitAudioContext)()
  let bufferSource

  // 加载和解码音频数据
  async function loadAudio() {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return await context.decodeAudioData(arrayBuffer)
  }

  let audioBuffer: any = null
  loadAudio().then((buffer) => {
    audioBuffer = buffer
  })

  function play(vol?: number) {
    if (audioBuffer) {
      bufferSource = context.createBufferSource()
      bufferSource.buffer = audioBuffer

      const gainNode = context.createGain()
      gainNode.gain.value = vol ?? +volume.value / 100

      bufferSource.connect(gainNode)
      gainNode.connect(context.destination)

      bufferSource.start(0)
    }
    else {
      console.error('Audio buffer is not loaded yet.')
    }
  }

  return {
    play,
  }
}
