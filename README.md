# stale-docs

This is an example Blueprint that contains a scheduled function that runs every Monday morning at 8am. It queries the project/dataset you provide looking for out of date movie overviews. Then it sends these overviews to the Sanity Content Agent for commentary. Finally, it posts the results to a Slack channel.

This is a POC and when adopting it to a real Sanity recipe we'll change it from movie reviews.

## Setup
1. **Set up Slack Integration**

   First, create a Slack app and get an OAuth token:
   1. **Create a new Slack app:**
      - Go to [https://api.slack.com/apps](https://api.slack.com/apps)
      - Click "Create New App"
      - Choose "From scratch"
      - Give your app a descriptive name (e.g., "Sanity Content Notifications")
      - Select your workspace from the dropdown

   2. **Configure permissions:**
      - Once your app is created, go to "OAuth & Permissions" in the sidebar
      - Scroll down to the "Scopes" section
      - Under "Bot Token Scopes", click "Add an OAuth Scope"
      - Add the `chat:write` permission (this allows your bot to send messages).

   3. **Install the app:**
      - Click "Install to Workspace" at the top of the OAuth & Permissions page
      - Review the permissions and click "Allow"
      - Copy the "Bot User OAuth Token" that starts with `xoxb-` (you'll need this for the next step)

   4. **Invite the app to your channel:**
      - Go to the Slack channel where you want notifications (e.g., `#test-channel`)
      - Type `/invite @your-app-name` or click the channel name → Settings → Integrations → Add apps
      - Select your newly created app to add it to the channel

2. **Initialize the example**

   Run this if you haven't initialized blueprints:

   ```bash
   npx sanity blueprints init
   ```

   You'll be prompted to select your organization and Sanity project.

   Since this repo deploys a Scheduled Function you will need an organization scoped Blueprint. Currently you need to promote a project based blueprint to a organization scoped blueprint but that requirement will be going away soon as you will be able to create a organization scoped blueprint.

   Then run:

   ```bash
   npx sanity@latest blueprints promote
   ```

3. **Configure environment variables**

   Create a `.env` file in your project root with the following variables:

   ```env
   # Required
   SLACK_OAUTH_TOKEN=xoxb-your-slack-bot-token-here
   SLACK_CHANNEL='name of the Slack Channel you want to post to'
   PROJECT_ID='Sanity Project ID to query'
   DATASET='Dataset name to query'
   API_HOST='Optional, defaults to https://api.sanity.io'
   DAY_SINCE='Optional, defaults to 180'
   ```

4. **Install dependencies**

   Install dependencies in the project root:

   ```bash
   npm install
   ```

5. **Configure environment variables**

   Deploy your Blueprint:

   ```env
   npx sanity@latest blueprints deploy
   ```
