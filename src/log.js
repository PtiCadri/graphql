import { query } from './constants.js';

//#####################################################################\\
//####################  VARIABLE DECLARATION  #########################\\
//#####################################################################\\
const graphqlEndpoint = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
const signinEndpoint = 'https://zone01normandie.org/api/auth/signin';
//const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const loginButton = document.getElementById('Login-button');
const barChartButton = document.getElementById('barChartButton');
const circularButton = document.getElementById('circularButton');
const loginContainer = document.getElementsByClassName('login-container')[0];
const usernameDisplay = document.getElementById('username-display');
const statisticsDisplay = document.getElementById('statistics-display');
//const emailAdd = localStorage.getItem('email');
export let token = ""

//#####################################################################\\
//####################  LOGOUT BUTTON PART  ###########################\\
//#####################################################################\\
logoutButton.addEventListener('click', async () => {
  try {
    loginContainer.style.display = 'block';
    usernameDisplay.textContent = '';
    statisticsDisplay.innerHTML = '';
    document.getElementById('circular-diagram-container').style.display="none"
    document.getElementById('bar-chart-container').style.display="none"
    alert('Logout successful');
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});

//#####################################################################\\
//####################  CHAIN REQUEST PART ############################\\
//#####################################################################\\

/**
 * Chain requests to authenticate user and get his data.
 * @param {Event} event - Form submission event.
 */
const chainRequests = async (event) => {
  var username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  event.preventDefault();
  try {
    const auth = username; 
    const response = await fetch(signinEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      token = data;
      console.log('Token saved:', token);

      // Mettre à jour l'interface utilisateur
      loginContainer.style.display = 'none';
      barChartButton.style.display = 'block';
      circularButton.style.display = 'block';

      // Récupérer les données utilisateur
      const userData = await getLogData(query);
      console.log('User data:', userData);

      if (userData == "Data is empty") {
        return
      }

      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(auth)) {
        username = userData.user[0].firstName;
      }
      actualUser = userData.user[0].firstName;
      var actualUser = username
      usernameDisplay.textContent = `Welcome, ${actualUser}!`;

      displayStatistics();
    } else {
      const errorText = await response.text();
      console.error('Login error:', errorText);
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during chain requests:', error.message);
  }
};

//#####################################################################\\
//####################  GET DATA PART  ################################\\
//#####################################################################\\


/**
 * Récupère les données utilisateur en effectuant une requête GraphQL
 * à l'endpoint fourni.
 * 
 * @param {string} query - La requête GraphQL à exécuter.
 * 
 * @returns {Promise<Object>} - Les données utilisateur, ou une erreur si la requête échoue.
 */

 async function getLogData(query) {
  console.log(token);
  
  if (token === "") {
    return "Token is empty"
  }
  
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response}`);
  } 
  const data = await response.json();
  console.log(data);
  
    if (data.errors) {
      throw new Error('GraphQL error:',data);
    }
  return data.data;
};

//#####################################################################\\
//####################  DISPLAY STATISTICS PART #######################\\
//#####################################################################\\

/**
 * Asynchronously fetches user data and displays it in the statistics section.
 * Retrieves data using a GraphQL query and updates the HTML content with user 
 * and audit information, including user ID, name, login, GitHub ID, experience points, 
 * and audit ratio. Also displays buttons for generating charts if data is available.
 */
async function displayStatistics() {
  const statsElement = document.getElementById('statistics-display');
  const data = await getLogData(query);
  if (data === "data is empty") {
    return
  }

  statsElement.innerHTML = `
    <h1>User Data</h2>
    <h2>Statistics</h2>
    <p>User ID: ${data.user[0].id}</p>
    <p>First Name: ${data.user[0].firstName}</p>
    <p>Last Name: ${data.user[0].lastName}</p>
    <p>Login: ${data.user[0].login}</p>
    <p>Github ID: ${data.user[0].githubId}</p>
    <h2> ${data.user[0].login}'s expreriences</h2>
    <p>Given experiences: ${data.user[0].totalUp} xps</p>
    <p>Earned experiences: ${data.user[0].totalDown} xps</p>
    <p>Audit Ratio: ${data.user[0].auditRatio.toFixed(2)}</p>
    <h2>Auditor</h2>
    <p>Auditor Login: ${data.audit[0].auditorLogin}</p>
  `;
  barChartButton.style.display = 'block';
  circularButton.style.display = 'block';
}

loginButton.addEventListener('click', chainRequests);

export { getLogData };
