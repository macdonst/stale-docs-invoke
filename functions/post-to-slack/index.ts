import { eventHandler } from '@sanity/functions'
import { WebClient } from '@slack/web-api'
import { env } from 'node:process'

interface Finding {
  title: String
  issue: String
  priority: 'high' | 'medium' | 'low'
}

interface Analysis {
  findings: Array<Finding>
}

export const handler = eventHandler(async ({ event }) => {
  const time = new Date().toLocaleTimeString()
  console.log(`post-to-slack was called at ${time}`)

  const analysis: Analysis = event?.data?.analysis

  const {
    SLACK_CHANNEL,
    SLACK_OAUTH_TOKEN,
  } = env

  try {
    // Create slack client
    const slack = new WebClient(SLACK_OAUTH_TOKEN)

    // Prepare message content
    const message = `*Update these movie overviews*\n\n${analysis.findings.map(finding => `*${finding.title}*\n\n${finding.issue}\nPriority: ${finding.priority}`).join('\n\n')}`

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
