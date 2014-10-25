var zetta = require('zetta');
var Spark = require('../');

zetta()
  .use(Spark)
  .listen(1337);
