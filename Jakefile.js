var sys = require('sys')

desc('Default task.');
task('default', [], function (params) {
  console.log('Jake is working.');
  console.log(sys.inspect(arguments));
});

namespace('db', function () {

    desc('Insert day cares for test environment.');
    task('seed_day_cares_for_test', [], function (params) {
        process.env.NODE_ENV = 'test';
        DayCare = require('./models/day_care');
        DayCare.find({}, null, null, function(err, dayCares) {
            for (var i = 0; i < dayCares.length; i++) {
                dayCares[i].remove();
            }

            for (var i = 1; i < 4; i++) {
                dayCare = new DayCare({name: 'daycare' + i})
                dayCare.save()
            }
        });

    });

    desc('Insert day cares for development environment.');
    task('seed_day_cares_for_development', [], function (params) {
        process.env.NODE_ENV = 'development';
        DayCare = require('./models/day_care');
        DayCare.find({}, null, null, function(err, dayCares) {
            for (var i = 0; i < dayCares.length; i++) {
                dayCares[i].remove();
            }

            for (var i = 1; i < 4; i++) {
                dayCare = new DayCare({name: 'daycare' + i})
                dayCare.save()
            }
        });

    });

});