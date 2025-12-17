import config from "config";
import mongoose from "mongoose";
import app from "./app";

const dbUri = config.get<string>("db.uri");
const port = config.get<number>("server.http.port");

const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  family: 4,
};

console.log(`Connexion à MongoDB à : ${dbUri}`);

mongoose
  .connect(dbUri, connectionOptions)
  .then(() => {
    console.log("Connexion MongoDB réussie.");

    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
      console.log(
        `Chemin de base API : http://localhost:${port}${config.get<string>(
          "app.basePath"
        )}`
      );
    });
  })
  .catch((err) => {
    console.error("ERREUR FATALE DE CONNEXION BD. Le serveur NE démarre PAS.");
    console.error(`Détails de l'erreur : ${err.message}`);
    process.exit(1);
  });

process.on("unhandledRejection", (err: Error) => {
  console.log("REJET NON GÉRÉ ! Extinction...");
  console.error(err.name, err.message);
  process.exit(1);
});

