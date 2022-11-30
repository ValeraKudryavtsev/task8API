const PROTO_PATH = "./phonebook.proto";
var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});
var phonebookProto = grpc.loadPackageDefinition(packageDefinition); const { v4: uuidv4 } = require("uuid");
const server = new grpc.Server();
const subscribers = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc", name: "Иван",
        surname: "Иванов",
        number: "987654321",
        age: 23,
        address: "Москва1"
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7", name: "Пётр",
        surname: "Петров",
        number: "123456789",
        age: 20,
        address: "Москва 2"
    }
];
server.addService(phonebookProto.SubscriberService.service, {
    getAll: (_, callback) => {
        callback(null, { subscribers });
    },
    get: (call, callback) => {
        let subscriber = subscribers.find(n => n.id == call.request.id);
        if (subscriber) {
            callback(null, subscriber);
        } else {
            callback({
                code: grpc.status.NOT_FOUND, details: "Не найдено"
            });
        }
    },
    insert: (call, callback) => {
        let subscriber = call.request;
        subscriber.id = uuidv4(); subscribers.push(subscriber); callback(null, subscriber);
    },
    update: (call, callback) => {
        let existingSubscriber = subscribers.find(n => n.id == call.request.id);
        if (existingSubscriber) {
            existingSubscriber.name = call.request.name; existingSubscriber.surname = call.request.surname; existingSubscriber.number = call.request.number; existingSubscriber.age = call.request.age; existingSubscriber.address = call.request.address; callback(null, existingSubscriber);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено"
            });
        }
    },
    remove: (call, callback) => {
        let existingSubscriberIndex = subscribers.findIndex(n => n.id == call.request.id
        );
        if (existingSubscriberIndex != -1) {
            subscribers.splice(existingSubscriberIndex, 1); callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND, details: "Не найдено"
            });
        }
    }
});
server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure()); console.log("Сервер запущен по адресу http://127.0.0.1:50051"); server.start();