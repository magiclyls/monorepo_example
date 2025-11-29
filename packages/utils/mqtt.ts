import type { MqttClient as TMqttClient } from 'precompiled-mqtt'
import { getEnv } from './bc.game'

/**
 * ws://34.92.35.218:8088
 * user = "rmqtt", password = "www.123.com",
 */

type TMqttProtocol = 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs'
type TMqttServer = Array<{
  host: string
  port: number
  protocol?: TMqttProtocol
}>

export class SocketClient {
  client: TMqttClient | null = null

  subscribeList: string[] = []

  /** 上一次连接登录状态 */
  lastLoginStatus?: boolean

  #MQTT_SERVER: TMqttServer | null = null

  clientId?: string

  isLogin: boolean = false

  #log = (message: string, ...rest: any) => {
    // eslint-disable-next-line no-console
    console.log(`%c Mqtt ${message}`, 'color: #e10d8a', ...rest)
  }

  constructor(SOCKET_URL_LIST_STRING: string) {
    this.#log('实例化')
    this.generateMQTT_SERVER(SOCKET_URL_LIST_STRING)
  }

  /** 生成 #MQTT_SERVER */
  public generateMQTT_SERVER(SOCKET_URL_LIST_STRING: string) {
    const VITE_SOCKET_URL_LIST_STRING = SOCKET_URL_LIST_STRING

    if (!VITE_SOCKET_URL_LIST_STRING) {
      this.#MQTT_SERVER = null
      return
    }

    const list = VITE_SOCKET_URL_LIST_STRING.split(',')
    const result: TMqttServer = []

    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const [protocol, host, port] = item.split('|')

      if (!host || !port) {
        this.#log('请在 env文件中 配置连接地址')
        return
      }

      result.push({
        host,
        port: Number(port),
        protocol: protocol as TMqttProtocol,
      })
    }

    this.#MQTT_SERVER = result
  }

  /** 断开重新连接 */
  public endOrConnect() {
    if (this.client != null) {
      this.#log('已经连接, 断开连接中...')
      const opts: any = null
      this.client.end(true, opts, () => {
        this.connect({
          msg: '断开 重新连接',
          clientId: this.clientId,
          isLogin: this.isLogin,
        })
      })
    }
  }

  public async connect(args: {
    clientId?: string
    /** 链接消息，判断是从哪里链接的 */
    msg?: string
    isLogin?: boolean
  }) {
    this.isLogin = args.isLogin ?? false
    this.clientId = args.clientId ?? Math.random().toString(36).slice(-10)

    this.#log('CONNECT', args.msg)
    if (this.#MQTT_SERVER) {
      if (this.lastLoginStatus === undefined)
        this.lastLoginStatus = this.isLogin

      if (this.lastLoginStatus === this.isLogin) {
        if (this.client != null) {
          this.#log('登录状态相同，且已经连接过，不执行连接', args.msg)
          return
        }
      }
      else {
        this.lastLoginStatus = this.isLogin
        this.endOrConnect()
        return
      }

      this.#log('连接中...')

      this.#log('clientId', this.clientId)

      import('precompiled-mqtt').then((mqtt) => {
        this.client = mqtt.connect({
          // username: VITE_SOCKET_USERNAME,
          // password: VITE_SOCKET_PASSWORD,
          keepalive: 20,
          clientId: this.clientId,
          servers: this.#MQTT_SERVER!,
        })
        this.eventHandler()
      })
    }
    else {
      this.#log('请在 env文件中 配置连接地址')
    }
  }

  /**
   * @param subscribeEvent 订阅的频道
   */
  public addSubscribe(subscribeEvent: string) {
    this.#log('开始订阅', subscribeEvent)
    if (this.client != null && subscribeEvent) {
      this.client.subscribe(subscribeEvent, { qos: 2 }, (error, granted) => {
        if (error) {
          this.#log(`订阅失败${subscribeEvent}`, error)
        }
        else {
          this.#log('订阅成功', granted)
        }
      })
    }
  }

  public removeSubscribe(subscribeEvent: string) {
    if (this.client != null && subscribeEvent) {
      this.client.unsubscribe(subscribeEvent, (error: any) => {
        if (error) {
          this.#log('取消订阅失败', error)
        }
        else {
          this.#log(`取消订阅成功 ${subscribeEvent}`)
          const index = this.subscribeList.indexOf(subscribeEvent)
          if (index > -1)
            this.subscribeList.splice(index, 1)
        }
      })
    }
  }

  public eventHandler() {
    if (this.client != null) {
      this.client.on('connect', (arg) => {
        this.#log('连接成功', 'Info: ', arg)
      })

      this.client.on('message', (topic, _message, packet) => {
        const message = packet.payload

        this.#log(`收到消息Topic：${topic}`)
        this.#log(`收到消息Message：${message}`)
        this.#log('收到消息Packet：', packet)
      })

      this.client.on('error', (error) => {
        this.#log(`发生错误：${error}`)
      })

      this.client.on('offline', () => {
        this.#log('离线')
      })

      this.client.on('disconnect', (disconnectInfo) => {
        this.#log('断开连接', disconnectInfo)
        this.client = null
      })

      this.client.on('reconnect', () => {
        this.#log('重新连接')
      })

      this.client.on('end', () => {
        this.#log('连接结束')
        this.client = null
      })

      this.client.on('close', () => {
        this.#log('连接关闭')
        // 连接关闭是会自动重连的
        // this.client = null
      })

      this.client.on('outgoingEmpty', () => {
        this.#log('发送队列为空')
      })

      this.client.on('packetreceive', () => {
        // this.#log('收到数据包 《《《《《《《《《《《', packetreceiveInfo)
      })

      this.client.on('packetsend', () => {
        // this.#log('发送数据包 》》》》》》》》》》》', packetsendInfo)
      })
    }
  }

  /** 关闭mqtt连接 */
  close() {
    if (this.client != null) {
      const opts: any = null
      this.client.end(true, opts)
    }
  }
}

const { VITE_SOCKET_URL_LIST_STRING } = getEnv()
export const socketClient = new SocketClient(VITE_SOCKET_URL_LIST_STRING)
