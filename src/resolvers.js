

const resolvers = {
  Query: {
    statistics: async (parent, args, context) => {
      const token = context.token;
      const userData = await loadStatistics(token);
      return userData;
    },
    // Add other query resolvers as needed
  },
  Mutation: {
    login: async (parent, { username, password }) => {
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
        return { token };
      } else {
        throw new Error('Invalid credentials');
      }
    },
    logout: async (parent, args, context) => {
      localStorage.removeItem('jwt');
      return true;
    },
    // Add other mutation resolvers as needed
  }
};

async function loadStatistics(token) {
  const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
          query {
            me {
              id
              username
              email
              xp
              grades {
                project {
                  name
                  grade
                }
                exam {
                  name
                  grade
                }
              }
              audits {
                project {
                  name
                  auditStatus
                }
                exam {
                  name
                  auditStatus
                }
              }
              skills {
                name
                level
              }
              piscine {
                name
                stats {
                  xp
                  progress
                }
              }
            }
          }
        `
      })
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.data.me;
    } else {
      throw new Error('Failed to load statistics');
    }
  }

module.exports = resolvers;
