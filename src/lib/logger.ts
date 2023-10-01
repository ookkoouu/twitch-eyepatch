export const newLogger =
  (name: string) =>
  (...messages: any[]) => {
    if (process.env.NODE_ENV == "development") {
      console.log(`[${name}]:`, ...messages);
    }
  };
