require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const flash = require('connect-flash');
const md5 = require('md5');
const app = express();

app.use(flash()); 

const saltrounds = 10;

// Set up session middleware
app.use(session({
    secret: 'Our little secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Set up static files, view engine, and body parser
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/booth');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

  data = {
        items: [
          {
            id: 1,
            name: "ABC Company",
            price: 2500,
            city: "Riyadh",
            category: "Company",
          },
          {
            id: 2,
            name: "XYZ Corporation",
            price: 4200,
            city: "Jeddah",
            category: "Company",
          },
          {
            id: 3,
            name: "123 Industries",
            price: 3000,
            city: "Dammam",
            category: "Company",
          },
          {
            id: 4,
            name: "Tech Innovators",
            price: 1500,
            city: "Khobar",
            category: "Company",
          },
          {
            id: 5,
            name: "Global Solutions",
            price: 4800,
            city: "Mecca",
            category: "Company",
          },
          {
            id: 6,
            name: "Smart Ventures",
            price: 2000,
            city: "Medina",
            category: "Company",
          },
          {
            id: 7,
            name: "Eco Enterprises",
            price: 3500,
            city: "Tabuk",
            category: "Company",
          },
          {
            id: 8,
            name: "Future Trends",
            price: 1200,
            city: "Hail",
            category: "Company",
          },
          {
            id: 9,
            name: "Innovate Arabia",
            price: 4300,
            city: "Najran",
            category: "Company",
          },
          {
            id: 10,
            name: "Golden Opportunities",
            price: 2800,
            city: "Buraidah",
            category: "Company",
          },
          {
            id: 11,
            name: "DEF Company",
            price: 3000,
            city: "Khamis",
            category: "Company",
          },
          {
            id: 12,
            name: "Coffee Haven",
            price: 2000,
            city: "Riyadh",
            category: "Cafeteria",
          },
          {
            id: 13,
            name: "Tea Time Delight",
            price: 3500,
            city: "Jeddah",
            category: "Cafeteria",
          },
          {
            id: 14,
            name: "Snack Shack",
            price: 1200,
            city: "Dammam",
            category: "Cafeteria",
          },
          {
            id: 15,
            name: "Sweet Treats Corner",
            price: 4800,
            city: "Khobar",
            category: "Cafeteria",
          },
          {
            id: 16,
            name: "Beverage Bliss",
            price: 3000,
            city: "Mecca",
            category: "Cafeteria",
          },
          {
            id: 17,
            name: "Crispy Bites Cafe",
            price: 4200,
            city: "Medina",
            category: "Cafeteria",
          },
          {
            id: 18,
            name: "Healthy Sips Cafe",
            price: 1500,
            city: "Tabuk",
            category: "Cafeteria",
          },
          {
            id: 19,
            name: "Quick Byte Cafe",
            price: 2800,
            city: "Hail",
            category: "Cafeteria",
          },
          {
            id: 20,
            name: "Yummy Munchies",
            price: 4300,
            city: "Najran",
            category: "Cafeteria",
          },
          {
            id: 21,
            name: "Fresh Flavor Cafe",
            price: 1000,
            city: "Buraidah",
            category: "Cafeteria",
          },
        ],
      };
      
const User = new mongoose.model('User', userSchema);



// Add authentication method to user schema
userSchema.methods.authenticate = function(password) {
    return bcrypt.compareSync(password, this.password);
};



// Configure Local Strategy for passport
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        return done(null, user);
      });
    });
  }));


// Configure Passport to use local strategy
passport.use(User.createStrategy());




// Serialize and deserialize user
passport.serializeUser(async (user, done) => {
    try {
        done(null, user.id);
    } catch (err) {
        done(err, null);
    }
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch (err) {
        done(err, null);
    }
});



// Configure Google Strategy for passport
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/booth",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// Define routes
app.get('/', function (req, res) {
    const yourDataObject = {
        // Your data goes here
        items: [
            {
              id: 1,
              name: "ABC Company",
              price: 2500,
              city: "Riyadh",
              category: "Company",
            },
            {
              id: 2,
              name: "XYZ Corporation",
              price: 4200,
              city: "Jeddah",
              category: "Company",
            },
            {
              id: 3,
              name: "123 Industries",
              price: 3000,
              city: "Dammam",
              category: "Company",
            },
            {
              id: 4,
              name: "Tech Innovators",
              price: 1500,
              city: "Khobar",
              category: "Company",
            },
            {
              id: 5,
              name: "Global Solutions",
              price: 4800,
              city: "Mecca",
              category: "Company",
            },
            {
              id: 6,
              name: "Smart Ventures",
              price: 2000,
              city: "Medina",
              category: "Company",
            },
            {
              id: 7,
              name: "Eco Enterprises",
              price: 3500,
              city: "Tabuk",
              category: "Company",
            },
            {
              id: 8,
              name: "Future Trends",
              price: 1200,
              city: "Hail",
              category: "Company",
            },
            {
              id: 9,
              name: "Innovate Arabia",
              price: 4300,
              city: "Najran",
              category: "Company",
            },
            {
              id: 10,
              name: "Golden Opportunities",
              price: 2800,
              city: "Buraidah",
              category: "Company",
            },
            {
              id: 11,
              name: "DEF Company",
              price: 3000,
              city: "Khamis",
              category: "Company",
            },
            {
              id: 12,
              name: "Coffee Haven",
              price: 2000,
              city: "Riyadh",
              category: "Cafeteria",
            },
            {
              id: 13,
              name: "Tea Time Delight",
              price: 3500,
              city: "Jeddah",
              category: "Cafeteria",
            },
            {
              id: 14,
              name: "Snack Shack",
              price: 1200,
              city: "Dammam",
              category: "Cafeteria",
            },
            {
              id: 15,
              name: "Sweet Treats Corner",
              price: 4800,
              city: "Khobar",
              category: "Cafeteria",
            },
            {
              id: 16,
              name: "Beverage Bliss",
              price: 3000,
              city: "Mecca",
              category: "Cafeteria",
            },
            {
              id: 17,
              name: "Crispy Bites Cafe",
              price: 4200,
              city: "Medina",
              category: "Cafeteria",
            },
            {
              id: 18,
              name: "Healthy Sips Cafe",
              price: 1500,
              city: "Tabuk",
              category: "Cafeteria",
            },
            {
              id: 19,
              name: "Quick Byte Cafe",
              price: 2800,
              city: "Hail",
              category: "Cafeteria",
            },
            {
              id: 20,
              name: "Yummy Munchies",
              price: 4300,
              city: "Najran",
              category: "Cafeteria",
            },
            {
              id: 21,
              name: "Fresh Flavor Cafe",
              price: 1000,
              city: "Buraidah",
              category: "Cafeteria",
            },
          ],
        };
    
      // Render the homePage template with the data object
      res.render("homePage", {
        data: yourDataObject,
      });

});

app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/register', function (req, res) {
    res.render('register');
});
app.get('/homePage', function (req, res) {
    res.render('homePage');
});
app.get('/ad', (req, res) => {
res.render('ad', );
  
});
app.get('/fav', function (req, res) {
    res.render('fav');
});
app.get('/apply_ad', function (req, res) {
    res.render('apply_ad');
});
app.get('/my_adds', function (req, res) {
    res.render('my_adds');
});
app.get('/search', function (req, res) {
    res.render('search');
});
app.get('/about_us', function (req, res) {
    res.render('footer/about_us');
});
app.get('/contact_us', function (req, res) {
    res.render('footer/contact_us');
});
app.get('/Frequently_Asked_Questions', function (req, res) {
    res.render('footer/Frequently_Asked_Questions');
});
app.get('/our_services', function (req, res) {
    res.render('footer/our_services');
});
app.get('/privacy', function (req, res) {
    res.render('footer/privacy');
});
app.get('/Special_Offers_Page', function (req, res) {
    res.render('footer/Special_Offers_Page');
});
app.get('/Terms', function (req, res) {
    res.render('Terms');
});
// Google authentication routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ["profile"] })
);
app.get('/auth/google/booth',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });
app.get('/logout', function (req, res) {
    req.logout((err) => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/login');
        }
    });
});



// Register route


app.post('/', (req, res) => {
    const category = req.body.all;
    const city = req.body.city;
    const price = req.body.price;
  
    // Assuming you have a function to filter items based on the selected options
    const filteredItems = filterItems(data.items, category, city, price);
  
    res.render('homePage', { data: { items: filteredItems } });
  });
  
  // Function to filter items
  function filterItems(items, category, city, price) {
    return items.filter(item => {
      return (
        (category === '' || item.category === category) &&
        (city === '' || item.city === city) &&
        (price === '' || checkPriceRange(item.price, price))
      );
    });
  }
  
  // Function to check if the item's price is within the selected price range
  function checkPriceRange(itemPrice, selectedPrice) {
    const [min, max] = selectedPrice.split('-');
    return itemPrice >= parseInt(min, 10) && itemPrice <= parseInt(max, 10);
  }
  

app.post('/register', async function (req, res) {
    const newUser = new User({
      username: req.body.username,
      password: md5(req.body.password),
    });
  
    try {
      await newUser.save();
      res.redirect('/login');
    } catch (err) {
      console.error(err);
    }
  });
  
 // Login route 
app.post('/login', async function (req, res) {
    const username = req.body.username;
    try {
      const foundUser = await User.findOne({ username });
      if (foundUser && foundUser.password === md5(req.body.password)) {
        res.redirect('/');
      } else {
        // Handle invalid login attempt
      }
    } catch (err) {
      console.error(err);
    }
  });
  
// Start the server
app.listen(8080, function () {
    console.log('listening on port 8080');
});
