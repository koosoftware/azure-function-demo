const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const id = (req.query.id || (req.body && req.body.id));

    const endpoint = "https://mckoo.documents.azure.com:443/";
    const key = "<YOUR_PRIMARY_KEY>";
    const client = new CosmosClient({ endpoint, key });

    const { database } =  await client.databases.createIfNotExists({ id: "MyDatabase" });

    const { container } = await database.containers.createIfNotExists({ id: "User" });

    const response = await container.item(id, id).delete();

    const responseMessage = id
        ? "ID " + id + " has been deleted successfully."
        : "This HTTP triggered function executed successfully. Pass a id in the query string or in the request body for a personalized response.";

    context.res = {
        body: responseMessage
    };
}