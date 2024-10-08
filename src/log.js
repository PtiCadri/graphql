// log.js
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginContainer = document.getElementsByClassName('login-container')[0];
const usernameDisplay = document.getElementById('username-display');
const statisticsDisplay = document.getElementById('statistics-display');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  try {
    const response = await fetch('https://zone01normandie.org/api/auth/signin', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('jwt', token);

      // Remove login container
      loginContainer.style.display = 'none';

      // Display username and statistics
      const userData = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      usernameDisplay.textContent = `Welcome, ${username}!`;
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    localStorage.removeItem('jwt');
    loginContainer.style.display = 'block';
    usernameDisplay.textContent = '';
    statisticsDisplay.innerHTML = '';
    alert('Logout successful');
  } catch (error) {
    console.error(error);
  }
});
