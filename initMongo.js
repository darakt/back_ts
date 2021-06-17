db = new Mongo('localhost:27017').getDB('aDatabase');
admin = new Mongo('localhost:27017').getDB('admin');
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

admin.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: ['userAdminAnyDatabase', 'dbAdminAnyDatabase', 'readWriteAnyDatabase'],
});

db.createUser({
  user: 'user',
  pwd: 'user',
  roles: [
    {
      role: 'dbOwner',
      db: 'aDatabase',
    },
  ],
});

db.createCollection('users');

db.createCollection('comments');

db.users.insertOne({
  _id: ObjectId('60c8989238d29f00f1cb8834'),
  isAdmin: true,
  username: 'first',
  password: 'azerty',
});

db.users.insertOne({
  _id: ObjectId('60c8989238d29f10f1cb8834'),
  isAdmin: false,
  username: 'second',
  password: 'azerty',
});

db.users.insertOne({
  _id: ObjectId('60c8989238d29f0011cb8834'),
  isAdmin: false,
  username: 'third',
  password: 'azerty',
});

db.comments.insertMany([
  {
    _id: ObjectId('60c8985638d29f10f1cb8834'),
    userId: ObjectId('60c8989238d29f0011cb8834'),
    orderId: ObjectId('60c8989238d29f00f1cb883a'),
    georeferenceId: ObjectId('70c8989238d29f00f1cb8834'),
    channel:
      '60c8989238d29f0011cb8834o60c8989238d29f00f1cb883ag70c8989238d29f00f1cb8834',
    text: 'this is a first comment',
    timeStamp: randomDate(new Date(2021, 0, 1), new Date()),
  },
  {
    _id: ObjectId('60c8985638d29f10f1cb8835'),
    userId: ObjectId('60c8989238d29f10f1cb8834'),
    georeferenceId: ObjectId('70c8989238d29f00f1cb8834'),
    channel: '60c8989238d29f10f1cb8834g70c8989238d29f00f1cb8834',
    text: 'this is a second comment',
    timeStamp: randomDate(new Date(2021, 0, 1), new Date()),
  },
  {
    _id: ObjectId('60c8985638d29f10f1cb8844'),
    userId: ObjectId('60c8989238d29f10f1cb8834'),
    orderId: ObjectId('60c8989238d29f00f1cb8832'),
    georeferenceId: ObjectId('70c8989238d29f00f1cb8834'),
    channel:
      '60c8989238d29f10f1cb8834o60c8989238d29f00f1cb8832g70c8989238d29f00f1cb8834',
    text: 'this is a third comment',
    timeStamp: randomDate(new Date(2021, 0, 1), new Date()),
  },
  {
    _id: ObjectId('60c8985638d29f10f1cb8934'),
    userId: ObjectId('60c8989238d29f00f1cb8834'),
    orderId: ObjectId('60c8989238d29f00f1cb8832'),
    channel: '60c8989238d29f00f1cb8834o60c8989238d29f00f1cb8832',
    text: 'this is a fourth comment',
    timeStamp: randomDate(new Date(2021, 0, 1), new Date()),
  },
  {
    _id: ObjectId('60c8985638d29f10f1ca8834'),
    userId: ObjectId('60c8989238d29f00f1cb8834'),
    orderId: ObjectId('60c8989238d29f00f1cb8844'),
    georeferenceId: ObjectId('70c8989238d29f00f1cb8834'),
    channel:
      '60c8989238d29f00f1cb8834o60c8989238d29f00f1cb8844g70c8989238d29f00f1cb8834',
    text: 'this is a fifth comment',
    timeStamp: randomDate(new Date(2021, 0, 1), new Date()),
  },
]);
