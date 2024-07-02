declare module Express {
  interface Request {
    user?: {
      id: number;
      username: string;
    };
  }
  interface Response {
    sendInst: <T>(body: T | T[], groups?: string[]) => void;
  }
}
