import { NextResponse } from 'next/server';
import { GameDig } from 'gamedig';

export async function GET() {
  const serverIPs = process.env.SERVER_IPS ? JSON.parse(process.env.SERVER_IPS) : [];

  try {
    const serversData = await Promise.all(
      serverIPs.map(async (server: { ip: string; port: number }) => {
        try {
          const state = await GameDig.query({
            type: 'csgo',
            host: server.ip,
            port: server.port,
          });

          return {
            name: state.name,
            map: state.map,
            numPlayers: state.numplayers,
            maxPlayers: state.maxplayers,
            players: state.players.map((player: any) => player.name.trim()),
            bots: state.bots.length,
            connect: state.connect,
            ping: state.ping
          };
        } catch (error) {
          console.error(`Error querying server ${server.ip}:${server.port}:`, error);
          return null;
        }
      })
    );

    const validServers = serversData.filter((server) => server !== null);

    return NextResponse.json(validServers);
  } catch (error) {
    console.error('Error fetching server data:', error);
    return NextResponse.json({ error: 'Failed to fetch server data' }, { status: 500 });
  }
}