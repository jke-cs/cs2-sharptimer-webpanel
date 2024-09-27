declare module 'gamedig' {
    interface QueryOptions {
      type: string;
      host: string;
      port: number;
    }
  
    interface QueryResult {
      name: string;
      map: string;
      numplayers: number;
      maxplayers: number;
      players: Array<{ name: string }>;
      bots: any[];
      connect: string;
      ping: number;
    }
  
    const Gamedig: {
      query: (options: QueryOptions) => Promise<QueryResult>;
    };
  
    export default Gamedig;
  }