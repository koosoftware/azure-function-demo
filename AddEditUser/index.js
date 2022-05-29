const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const id = (req.query.id || (req.body && req.body.id));

    const endpoint = "https://mckoo.documents.azure.com:443/";
    const key = "<YOUR_PRIMARY_KEY>";
    const client = new CosmosClient({ endpoint, key });

    const { database } =  await client.databases.createIfNotExists({ id: "MyDatabase" });

    const { container } = await database.containers.createIfNotExists({ id: "User" });

    if (id) {
        // Edit User
        await container.items.upsert({
            id: id,
            name: name, 
        });
    } else {
        // Add User
        await container.items.create({
            name: name,
        });
    }

    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        body: responseMessage
    };
}