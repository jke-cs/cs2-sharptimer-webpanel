> [!NOTE]
>This website is in development check this repository regulary for updates.

# CS2 Sharptimer Webpanel

<div align="center">

![CS2 Sharptimer Webpanel](https://i.gyazo.com/11a7ae649cdaab755b273c92aaad79ad.png)

[![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/jke-cs/cs2-sharptimer-webpanel)
[![[Discord](https://miro.medium.com/v2/resize:fit:800/1*_AsB_hCguMYC-wEG2Bidmw.png)](https://discord.gg/n4xCDWrQRB)
[![Discord](https://img.shields.io/discord/1284504448978124902?color=7289DA&logo=discord&logoColor=white)](https://discord.gg/n4xCDWrQRB)

A NextJS+React Webpanel for Sharptimer

</div>

## 🛠️ Setup

1. Clone the repository
2. Rename `.env.local.example` to `.env.local`
3. Edit `.env.local` and replace the server IPs and ports with your own and your sharptimer mysql DB credentials
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start the development server

## Customizing Server IPs

To add or modify server IPs, edit the `SERVER_IPS` variable in your `.env.local` file. The format is a JSON array of objects, each containing an `ip` and `port`.

Example:
```
SERVER_IPS=[{"ip":"192.168.1.100","port":27015},{"ip":"192.168.1.101","port":27016}]
```


Join our Discord for Support.
