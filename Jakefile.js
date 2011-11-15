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
//        PictureSet = require('./models/picture_set');
//        Picture = require('./models/picture');
        DayCare.find({}, null, null, function(err, dayCares) {
            for (var i = 0; i < dayCares.length; i++) {
                dayCares[i].remove();
            }

            for (var i = 1; i < 4; i++) {
                pictureSets = [
                    {type: 'profile', name: 'Profile pictures', description: 'Your profile pictures.',
                     pictures: [
                        {primary: true, description: 'Our logo', url: '/images/seeds/profile_pic.jpg'}
                     ]
                    },
                    {type: 'daycare', name: 'Inside our day care', description: 'This is how our day care looks inside.',
                     pictures: [
                        {primary: false, description: 'Inside our day care 1', url: '/images/seeds/daycare1.jpg'},
                        {primary: true, description: 'Inside our day care 2', url: '/images/seeds/daycare2.jpg'},
                        {primary: false, description: 'Inside our day care 3', url: '/images/seeds/daycare3.jpg'}
                     ]
                    },
                    {type: 'daycare', name: 'Outside our day care', description: 'This is how our day care looks outside.',
                     pictures: [
                        {primary: false, description: 'Outside our day care 1', url: '/images/seeds/daycare1.jpg'},
                        {primary: true, description: 'Outside our day care 2', url: '/images/seeds/daycare2.jpg'},
                        {primary: false, description: 'Outside our day care 3', url: '/images/seeds/daycare3.jpg'}
                     ]
                    },
                    {type: 'daycare', name: 'Our playground', description: 'This is how our playground looks like.',
                     pictures: [
                        {primary: true, description: 'Playground 1', url: '/images/seeds/daycare1.jpg'},
                        {primary: false, description: 'Playground 2', url: '/images/seeds/daycare2.jpg'},
                        {primary: false, description: 'Playground 3', url: '/images/seeds/daycare3.jpg'}
                     ]
                    },
                    {type: 'default', name: 'New Year party.', description: 'Pictures from New Year party.',
                     pictures: [
                        {primary: false, description: 'New Year 1', url: '/images/seeds/daycare1.jpg'},
                        {primary: false, description: 'New Year 2', url: '/images/seeds/daycare2.jpg'},
                        {primary: true, description: 'New Year 3', url: '/images/seeds/daycare3.jpg'}
                     ]
                    },
                    {type: 'default', name: 'Halloween party.', description: 'Trick or treat on Halloween.'}
                ];
                dayCare = new DayCare({name: 'daycare' + i, picture_sets: pictureSets});
                dayCare.save()
            }
        });

    });

});