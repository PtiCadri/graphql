const token = localStorage.getItem('jwt');

function getStatisticsFromAPI(token) {
  const apiUrl = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';
  const query = `
    query {
      statistics {
        level
        project {
          currentProject
          realisedProjects
          projectPerMonth
        }
        exp {
          totalEXPEarned
          totalEXPGave
          totalEXPOnMonth
        }
        audits {
          auditsDone
          auditRatio
          passedFailedAuditRatio
        }
        piscine {
          Javascript {
            succeedPiscine
            passedFailedRatio
            triesPerExercise
            completedCheckpoints
            earnedEXP
            bonusEXP
          }
          Golang {
            succeedPiscine
            passedFailedRatio
            triesPerExercise
            completedCheckpoints
            earnedEXP
            bonusEXP
          }
          Rust {
            succeedPiscine
            passedFailedRatio
            triesPerExercise
            completedCheckpoints
            earnedEXP
            bonusEXP
          }
        }
      }
    }
  `;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({ query });

  fetch(apiUrl, {
    method: 'POST',
    headers,
    body
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      return response.json();
    }
  })
  .then(data => {
    console.log('Data retrieved:', data);
    // Handle the retrieved data here
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}
function displayStatistics() {
  const statsData = getStatisticsFromAPI(token);
  const statsElement = document.getElementById('statistics-display');

  statsElement.innerHTML = `
    <h2>Statistics</h2>
    <p>${statsData}</p>
  `;
}
