import { eventHandler } from '@sanity/functions'
import { WebClient } from '@slack/web-api'
import { env } from 'node:process'

export const handler = eventHandler(async ({ event }) => {
  const time = new Date().toLocaleTimeString()
  console.log(`slack-post was called at ${time}`)

  const message: string = event?.data?.message

  const {
    SLACK_CHANNEL,
    SLACK_OAUTH_TOKEN,
  } = env

  try {
    // Create slack client
    const slack = new WebClient(SLACK_OAUTH_TOKEN)

    // Send message to Slack
    await slack.chat.postMessage({
      channel: SLACK_CHANNEL,
      text: message,
    })

    console.log(
      'Slack notification sent successfully to channel:',
      SLACK_CHANNEL,
    )
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : error
    console.error('Error occurred:', errMsg)
  }
})
