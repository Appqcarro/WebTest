const {Client} = require('pg')
const express = require ("express")

const app = express();
app.use(express.json({limit: '1mb' }));

const client = new Client({
    "user": "postgres",
    "database": 'FIPE',
    "port": 5432,
    "host": 'localhost',
    "password": "Appqcarro",
    "max": 20,
    "connectionTimeoutMillis": 0,
    'idleTimeoutMillis': 0
})

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`))
app.get("/texts", (req, res) => res.sendFile(`${__dirname}/index2.html`))
app.get("/main", (req, res) => res.sendFile(`${__dirname}/main.html`))

app.get("/test", async(req, res) => {
    const rows = await actiondb();
    res.setHeader("content-type", "application/json")
    res.send(JSON.stringify(rows))
})


app.post("/test2", async (req, res) => {
    try {
        const dataf = req.body;
        const rows = await actiondb2(String(dataf.brand));
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    }

    catch (e) {
        console.log("Error of Post is: " + e);
    }
})

app.post("/test3", async (req, res) => {
    try {
        const dataf = req.body;
        console.log(dataf);
        const rows = await actiondb3(
            String(dataf.brand),
            String(dataf.vehicle)
            );
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    }

    catch (e) {
        console.log("Error of Post is: " + e);
    }
})

app.post("/test4", async (req, res) => {
    try {
        const dataf2 = req.body;
        const rows = await actiondb4(
            String(dataf2.vehicle),
            String(dataf2.ano)
            );
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    }

    catch (e) {
        console.log("Error of Post is: " + e);
    }
})

app.post("/test5", async (req, res) => {
    try {
        const dataf2 = req.body;
        const rows = await actiondb5(
            String(dataf2.vehicle),
            String(dataf2.ano)
            );
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(rows));
    }

    catch (e) {
        console.log("Error of Post is: " + e);
    }
}) 


app.listen(7072, () => console.log("Webser is listening on port 7072"))

// function to start
start()
async function start() {
    try {
        await connect();
    }
    catch (ex){
        console.log(`Something went wrong: ${ex}`)
    }
}

//connect to database
async function connect() {
    try {
        await client.connect();
    }
    catch (e) {
        console.log(`Failed to connect ${e}`)
    }
}

// function to query the database 1ST FILTER
async function actiondb() {
    try {
        const results = await client.query("select distinct(nome_marca) from fipe_price order by nome_marca ASC")
        return results.rows;        
    }
    catch (ex) {
        console.log("Something wrong happened: " + ex)
    }
}

// function to query the database 2ND FILTER
async function actiondb2(filter1) {
    try {
        const results = await client.query("SELECT distinct(nome_veiculo) FROM fipe_price WHERE nome_marca = '" + filter1 + "'ORDER BY nome_veiculo ASC;")
        return results.rows;
    }
    catch (ex) {
        console.log("Execution wrong happened: " + ex)
    }
}

// function to query the database 3RD FILTER
async function actiondb3(filter1, filter2) {
    try {
        const results = await client.query("SELECT distinct(ano_veiculo) FROM fipe_price WHERE nome_marca = '" + filter1 + "' AND nome_veiculo = '" + filter2 + "' ORDER BY ano_veiculo ASC;")
        return results.rows;
    }
    catch (ex) {
        console.log("Execution wrong happened: " + ex)
    }
}

// function to bring the price
async function actiondb4(filter1, filter2) {
    try {
        const results = await client.query("SELECT preco_veiculo FROM fipe_price WHERE id_veiculo = (SELECT MAX(id_veiculo) FROM fipe_price WHERE nome_veiculo = '" + filter1 + "' AND ano_veiculo = '" + filter2 + "');")
        return results.rows;
    }
    catch (ex) {
        console.log("Execution wrong happened: " + ex)
    }
}

// function to bring the price trend
async function actiondb5(filter1, filter2) {
    try {
        const results = await client.query("SELECT concat(LEFT (mes_pesquisa,3),' ', RIGHT(mes_pesquisa,2)) as mes_pesquisa, preco_veiculo FROM fipe_price WHERE nome_veiculo = '" + filter1 + "' AND ano_veiculo = '" + filter2 + "' ORDER BY id_veiculo DESC;")
        return results.rows;
    }
    catch (ex) {
        console.log("Execution wrong happened: " + ex)
    }
}