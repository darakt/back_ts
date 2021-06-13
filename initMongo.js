db = new Mongo('localhost:27017').getDB('aDatabase');
admin = new Mongo('localhost:27017').getDB('admin');

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
  userId: '1',
  isAdmin: true,
  login: 'first',
  password: 'azerty',
});

db.users.insertOne({
  userId: '2',
  isAdmin: false,
  login: 'second',
  password: 'azerty',
});

db.users.insertOne({
  userId: '3',
  isAdmin: false,
  login: 'third',
  password: 'azerty',
});

db.comments.insertMany([
  {
    commentId: '1',
    userId: '2',
    orderId: '3',
    georeferenceId: '4',
    channel: '2o3g4',
    text: 'this is a first comment',
  },
  {
    commentId: '2',
    userId: '2',
    georeferenceId: '4',
    channel: '2g4',
    text: 'this is a second comment',
  },
  {
    commentId: '3',
    userId: '2',
    orderId: '4',
    georeferenceId: '4',
    channel: '2o4g4',
    text: 'this is a third comment',
  },
  {
    commentId: '4',
    userId: '2',
    orderId: '4',
    channel: '2o4',
    text: 'this is a fourth comment',
  },
  {
    commentId: '5',
    userId: '2',
    orderId: '4',
    georeferenceId: '4',
    channel: '2o4g4',
    text: 'this is a fifth comment',
  },
]);
