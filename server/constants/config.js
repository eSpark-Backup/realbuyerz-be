const corsOptions = {
    origin: '*', // replace with your client URL
  Credential: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  };

    const BADAMI_TOKEN= "badami"
    const BADMIN_TOKEN="admin"
    export {corsOptions,BADAMI_TOKEN,BADMIN_TOKEN};