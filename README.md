> [!NOTE]
>This website is in development check this repository regulary for updates.

<div align="center">
  
[![Development Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/jke-cs/cs2-sharptimer-webpanel)
[![Discord](https://img.shields.io/discord/371718546121556002?color=7289DA&logo=discord&logoColor=white)](https://discord.gg/n4xCDWrQRB)

A NextJS+React Webpanel for Sharptimer

</div>



# CS2 Sharptimer Webpanel



![CS2 Sharptimer Webpanel](https://i.gyazo.com/313029b595f669cac3fee4a5847cd22f.png)


## Requirements

[NodeJS](https://nodejs.org/en/download/package-manager/current)

[SharpTimer](https://github.com/Letaryat/poor-sharptimer)


## 🛠️ Setup

1. Clone the repository
2. Rename `.env.local.example` to `.env.local`
3. Edit `.env.local` and replace the server IPs and ports with your own and add your sharptimer mysql DB credentials
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start the development server

## Customizing Server IPs

To add or modify server IPs, edit the `SERVER_IPS` variable in your `.env.local` file. The format is a JSON array of objects, each containing an `ip` and `port`.

Example:
```
SERVER_IPS=[{"ip":"192.168.1.100","port":27015},{"ip":"192.168.1.101","port":27016}]
```


Join our Discord for Support.
https://discord.gg/n4xCDWrQRB
