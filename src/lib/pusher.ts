import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

/* eslint-disable no-var*/
declare global {
  var PusherServerInstance: PusherServer | undefined
  var PusherClientInstance: PusherClient | undefined
}

if (!global.PusherServerInstance) {
  global.PusherServerInstance = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: 'eu',
    useTLS: true
  })
}

if (!global.PusherClientInstance) {
  global.PusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    channelAuthorization: {
      endpoint: '/api/pusher-auth',
      transport: 'ajax'
    },
    cluster: 'eu'
  })
}

export const pusherServer = global.PusherServerInstance
export const pusherClient = global.PusherClientInstance
