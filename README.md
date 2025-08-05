# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install
```

## Development

### Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Setup database

```bash
npx prisma migrate dev
```

### ENV keys

#### GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

Go to [Github Devolopper Settings](https://github.com/settings/applications/new)
Register a new OAuth app:

- **Application name**: `Chose your name`
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000`

Then, copy the `Client ID` and `Client Secret` to your `.env` file (you can refer to the `.env.example` file):

#### GITHUB_TOKEN

Generate a personal access token with the `repo` scope. You can do this in your [Github settings](https://github.com/settings/personal-access-tokens).

- Go to **Developer settings** > **Personal access tokens** > **Fine-grained tokens**.
- Click on **Generate new token**.
- Give it a name and select the `All repositories` scope.
- In **Repository permissions**, select read-only access for **Issue Types**.
- Click on **Generate token**.

Then, copy the token to your `.env` file (you can refer to the `.env.example` file):

```bash
# .env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_TOKEN=your_github_token
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## License

This project is licensed under LGPL-3.0 License - see the [LICENSE](LICENSE) file for details.
