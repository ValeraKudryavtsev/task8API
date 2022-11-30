const client = require("./client");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("views", path.join(__dirname, "views")); app.set("view engine", "hbs");
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.render("subscribers", { results: data.subscribers });
        }
    });
});
app.post("/save", (req, res) => {
    let newSubscriber = {
        name: req.body.name,
        surname: req.body.surname, number: req.body.number,
        age: req.body.age, address: req.body.address
    };
    client.insert(newSubscriber, (err, data) => {
        if (err) throw err;
        console.log("Абонент создан", data); res.redirect("/");
    });
});
app.post("/update", (req, res) => {
    const updateSubscriber = {
        id: req.body.id,
        name: req.body.name,
        surname: req.body.surname, number: req.body.number, age: req.body.age, address: req.body.address
    };
    client.update(updateSubscriber, (err, data) => {
        if (err) throw err;
        console.log("Абонент успешно обновлён", data); res.redirect("/");
    });
});
app.post("/remove", (req, res) => {
    client.remove({ id: req.body.subscriber_id }, (err, _) => {
        if (err) throw err;
        console.log("Абонент удалён"); res.redirect("/");
    });
});
const PORT = process.env.PORT || 3000; app.listen(PORT, () => {
    console.log("Сервер запущен на порту %d", PORT);
});