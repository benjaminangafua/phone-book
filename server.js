const http = require("http");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./phoneBook", (err) => {
    if (err) {
        console.error(err.message)
    } else {
        console.log('connection successful');
    }
});
// TODO 1
function createTable() {

    db.run("CREATE TABLE  IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar (55), contact varchar (20))")

    /**
     * Create a table called contacts with the following columns:
     *     a. id (the datatype should be int and also set as the primary key)
     *     b. name (the datatype should be varchar) and
     *     c. contact (the datatype should be varchar)
     * 
     */
}
createTable();

const server = http.createServer((req, res) => {
    let url = req.url;
    let method = req.method;

    if (url === "/" && method === "GET") {
        fs.readFile("./contacts.html", "utf8", (err, data) => {
            res.end(data);
        })
    } else if (url === "/contact/create" && method === "GET") {
        fs.readFile("./create-contact.html", "utf8", (err, data) => {
            res.end(data);

        })
    } else if (url === "/create" && method === "POST") {
        // TODO 2

        /**
         * Get the data from the front-end and store it in the contacts table
         */
        let create_contact = '';
        req.on("data", (data) => {
            create_contact += data; //Front-end data
            console.log("What is this body?", create_contact);
        })
        req.on("end", () => {
            let contact_created = JSON.parse(create_contact);
            db.run(`INSERT INTO contacts(name, contact) VALUES(?,?)`, contact_created.full_name, contact_created.contact, (err) => {
                if (err) {
                    console.error(err.message)
                }
            })
        })
    } else if (url === "/contacts" && method === "GET") {
        let contact_data = `SELECT * FROM contacts`
        db.all(contact_data, (err, row) => {
            if (err) {
                console.error(err.message)
            }
        });
        // TODO 3 

    } else {
        res.end("404")

    }
})
server.listen(3600, () => {
    console.log("Server is listening on port 3600");
})