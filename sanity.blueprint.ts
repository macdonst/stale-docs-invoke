import { defineBlueprint, defineRobotToken, defineScheduledFunction } from '@sanity/blueprints'
import 'dotenv/config'
import { env } from 'node:process'

const { API_HOST, DATASET, PROJECT_ID, SLACK_OAUTH_TOKEN, SLACK_CHANNEL } = env

export default defineBlueprint({
  resources: [
    defineRobotToken({
      name: 'stale-docs-robot',
      label: 'Stale Docs Robot',
      memberships: [
        {
          resourceType: 'project',
          resourceId: PROJECT_ID,
          roleNames: ['editor'],
        },
      ],
    }),
    defineScheduledFunction({
      name: 'stale-docs',
      event: { expression: '0 8 * * 1' },
      timezone: 'America/Montreal',
      env: {
        API_HOST,
        DAYS_SINCE: '180',
        SLACK_OAUTH_TOKEN,
        SLACK_CHANNEL,
        PROJECT_ID,
        DATASET
      },
      robotToken: '$.resources.stale-docs-robot.token',
      timeout: 30,
    }),
  ],
})
