// Assuming you have a file named 'users.txt' to store user data

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve your HTML file at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const userData = `${name}, ${email}, ${password}\n`;

  // Read existing user data from the file
  const existingData = fs.readFileSync('users.txt', 'utf8');

  // Check if the user already exists
  if (existingData.includes(userData)) {
    // Account already exists, display a pop-up
    const popupHTML = `
      <script>
        alert('Account already exists. Please login.');
        window.location.href = '/login';
      </script>
    `;
    res.send(popupHTML);
  } else {
    // Append the new user data to the file
    fs.appendFile('users.txt', userData, (err) => {
      if (err) throw err;
      console.log('User data appended to file');
      // Redirect to the home route after registration
      res.redirect('/home');
    });
  }
});

// Display a simple message at the home route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userCredentials = `${email}, ${password}\n`;

  // Read existing user data from the file
  const existingData = fs.readFileSync('users.txt', 'utf8');

  // Check if the user exists and the password matches
  if (existingData.includes(userCredentials)) {
    // Successful login, redirect to home
    res.redirect('/home');
  } else {
    // Wrong password, display a message
    res.send('Wrong password. Please try again.');
  }
});

// Handle login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
