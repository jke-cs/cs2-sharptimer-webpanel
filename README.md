> [!NOTE]
>This website is in development check this repository regulary for updates.
# CS2 Sharptimer Webpanel 

This project is a NextJS+React Webpanel for Sharptimer.

## Setup

1. Clone the repository
2. Rename `.env.local.example` to `.env.local`
3. Edit `.env.local` and replace the server IPs and ports with your own and your sharptimer mysql DB credentials
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start the development server

## Customizing Server IPs

To add or modify server IPs, edit the `SERVER_IPS` variable in your `.env.local` file. The format is a JSON array of objects, each containing an `ip` and `port`.
