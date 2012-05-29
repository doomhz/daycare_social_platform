var sys = require('sys')
var _   = require('underscore')

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

    desc('Insert tags.');
    task('seed_tags', [], function (params) {
      require('./models/db_connect');
      Tag = require('./models/tag');
      Tag.remove()

      var generalAproachesToLearning = [
        "Play-Based", "Co-op", "Montessori"
      ];
      var learningPhilosophyAndToolsLanguage = [
        "Oral language", "Nursery rhymes", "poems", "songs", "Storybook", "reading", "Emerging", "literacy skills"
      ];
      var learningPhilosophyAndToolsCognitiveDev = [
        "Math & number sense", "Time & space", "Sci. reasoning/physical world", "Music", "Visual arts", "Physical activity", "Other subjects taught (specify)"
      ];
      var homeSchoolConnections = [
        "Notes", "Phone Calls", "Voice Mail", "Email", "Special Meetings", "Two or More Regular Conferences", "Drop-Off", "Pick-Up", "Regular newsletter/printed updates circulated to the whole school"
      ];
      homeSchoolSeparations = [
        "Pre-entry meetings with parents at school", "Extra staff dedicated to handle separation", "Small group sessions", "Parents in classroom early on", "Abbreviated schedule at start of school year"
      ];
      var certificates = [
        "CPR Certified", "First Aid Certified", "FIA Accepted", "Latchkey", "Educational Programs", "National Accreditation (NAFCC)", "Smoke-Free Environment", "Special Needs Children Accepted", "Do You Have Webcams available in your classes"
      ];
      var indoors = [
        "Clean restrooms and food preparation areas (with separate sinks)", "Adequate heating and ventilation", "Children are supervised at all times, even when they are sleeping", "Screened heating vents/heaters",
     "Inaccessible electrical outlets, stoves, and pilot lights", "Fire extinguishers and smoke detectors", "Adequate fire exits (at least two)", "Sharp edges are padded", "Cabinets have 'child proof' guards",
     "Adequate first-aid kit (indoors and out)", "Place for children's clothes and belongings", "Quiet nap area", "Dramatic play area (dress-up clothes, toy stove and sink, strollers)", "Low tables and chairs",
     "Musical toys", "Stuffed animals and dolls", "Record/cassette player (records/cassettes)", "Blocks and block accessories", "Age-appropriate manipulative toys (puzzles, etc.)", "Art supplies, clay, play dough",
     "Children's artwork displayed", "Age-appropriate books"
      ];
      var outdoors = [
        "Playground surrounded by a fence", "playground equipment is safe, with no sharp edges, and kept in good shape", "the soil and playground surfaces are often checked for dangerous substances and hazards", "Yard free of debris",
     "Drinking water available", "Sand or digging area", "Water play supplies", "Sturdy climbing equipment (with cushioning material beneath)", "Tricycles and other mobility toys", "Easels and paint", "Grass, shade trees, garden area"
      ];
      var forInfants = [
        "Toys that are a safe size (non-swallowable) and that can be easily sanitized", "Colorful mobiles and pictures", "Outdoor area with safe crawling space", "Equipment that infants can crawl over and through",
     "Wheel toys that are safe for toddlers to ride on, push, and be given rides in", "Sanitary diaper changing area accessible to running water", "Toilet-training procedures communicated to parents",
     "Daily observation charts recording feeding, napping, and diapering/toileting",
     "All child care staff, volunteers, and substitutes have been trained on and implementing infant back sleeping and safe sleep policies to reduce the risk of SIDS (Sudden Infant Death Syndrome)",
     "Caregivers always keep a hand on the child while diapering", "Caregivers clean and sanitize the surface after finishing the changing process of diapering"
      ];
      var healthAndSafetyIssues = [
        "Children are supervised at all times, even when they are sleeping", "The child care program have records proving that the other children in care are up-to-date on all their required immunizations",
     "The child care program have an emergency plan if a child is injured, sick, or lost", "All caregivers been trained how to prevent child abuse, how to recognize signs of child abuse, and  how to report suspected child abuse",
     "The caregivers were trained and the medications  are labeled to make sure the right child gets the right amount of the right medication at the right time", "The child care program has a first aid kit",
     "The staff have training in infant and child first aid, CPR, and infectious diseases", "The staff has been trained to understand and meet the needs of children of different ages",
     "All caregivers and children wash their hands often, especially before eating and after using the bathroom or changing diapers", "A health evaluation is required for a child to enter the program",
     "Emergency phone numbers are clearly posted (work/home, your pediatrician, a friend or relative, fire, police)", "Procedures are established to care for a child who becomes sick or is injured",
     "Every child has access to and wears a seat belt when traveling in a vehicle", "Car seats are provided for children who require them", "The facility has an earthquake or emergency evacuation plan",
     "The provider has emergency supplies stored in case of an earthquake", "Medicines, poisons, and pointed items are kept out of children's sight and reach"
      ];
      var transportationPolicies = [
        "Parents bring their children to and from school.", "Private bus service available.", "Located close to public transportation."
      ];

      var tagsToSeed = {
        general_aproach_to_learning: generalAproachesToLearning,
        learning_philosophy_and_tools_language: learningPhilosophyAndToolsLanguage,
        learning_philosophy_and_tools_cognitive_dev: learningPhilosophyAndToolsCognitiveDev,
        home_school_connections: homeSchoolConnections,
        home_school_separations: homeSchoolSeparations,
        certificates: certificates,
        indoors: indoors,
        outdoors: outdoors,
        for_infants: forInfants,
        health_and_safety_issues: healthAndSafetyIssues,
        transportation_policies: transportationPolicies
      };

      _.each(tagsToSeed, function (tags, tagType) {
        _.each(tags, function (tagName) {
          var tag = new Tag({type: tagType, name: tagName});
          tag.save()
        });
      });
    });

    desc('Repair locations.');
    task('repair_users_locations', [], function (params) {
        process.env.NODE_ENV = 'development';
        require('./models/db_connect');
        var User = require('./models/user');
        User.update({}, {location: []}, {safe: false, multi: true}).run();

    });

    desc('Repair locations in production.');
    task('repair_users_locations_prod', [], function (params) {
        process.env.NODE_ENV = 'production';
        require('./models/db_connect');
        var User = require('./models/user');
        User.update({}, {location: []}, {safe: false, multi: true}).run();

    });

});