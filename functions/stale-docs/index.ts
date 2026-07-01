import { invoke, scheduledEventHandler } from '@sanity/functions'
import { createClient } from '@sanity/client'
import { env } from 'node:process'

interface Finding {
  title: String
  issue: String
  priority: 'high' | 'medium' | 'low'
}

interface Analysis {
  findings: Array<Finding>
}

export const handler = scheduledEventHandler(async ({ context }) => {
  const time = new Date().toLocaleTimeString()
  console.log(`Your scheduled Sanity Function was called at ${time}`)

  const {
    API_HOST = 'https://api.sanity.io',
    DATASET,
    DAYS_SINCE = 180,
    PROJECT_ID,
  } = env

  // Create sanity client
  const client = createClient({
    apiHost: API_HOST,
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: 'vX',
    token: context.clientOptions?.token,
  })

  // Query for out of date movie overviews
  const stalePages = await client.fetch(
    `*[_type in ["movie"] && dateTime(_updatedAt) > dateTime(now()) - 60*60*24*${DAYS_SINCE}] {
    _id, _type, title, _updatedAt, "overview": pt::text(overview)
  }`
  )

  console.log(`Stale movie overviews detected: ${stalePages.length}`)

  try {
    // Get the client to analyze our overviews
    const analysis: Analysis = await client.agent.action.prompt({
      instruction: `You are a snarky movie review. Review these movie overviews: $documents
      Report which ones need updating, why, and what specifically looks outdated.
      Respond in JSON with format: { "findings": [{ "title": "...", "issue": "...", "priority": "high|medium|low" }] }`,
      instructionParams: {
        documents: JSON.stringify(stalePages),
      },
      format: 'json',
    })

    // Prepare message content
    const message = `*Update these movie overviews*\n\n${analysis.findings.map(finding => `*${finding.title}*\n\n${finding.issue}\nPriority: ${finding.priority}`).join('\n\n')}`

    await invoke('slack-post', { context, event: { data: { message } } })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : error
    console.error('Error occurred:', errMsg)
  }
})
